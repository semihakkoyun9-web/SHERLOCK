import React, { useState, useRef, useEffect, memo } from 'react';
import { Scenario, ChatMessage } from '../types';
import { checkAnswerWithAI } from '../services/geminiService';
import { checkOfflineAnswer } from '../services/offlineCaseService';
import { Send, User, Bot, Lock, HardDrive, Cpu, ShieldCheck } from 'lucide-react';

interface InterrogationRoomProps {
  scenario: Scenario;
  initialMessages: ChatMessage[];
  initialQuestionCount: number;
  onStateUpdate: (messages: ChatMessage[], count: number) => void;
  isCaseSolved: boolean;
  bonusQuestions?: number;
  isDarkMode?: boolean;
  isAiGenerated?: boolean;
}

const BASE_QUESTIONS = 4;

const InterrogationRoom: React.FC<InterrogationRoomProps> = memo(({ 
  scenario, 
  initialMessages, 
  initialQuestionCount, 
  onStateUpdate,
  isCaseSolved,
  bonusQuestions = 0,
  isDarkMode = true,
  isAiGenerated = true
}) => {
  const MAX_QUESTIONS = BASE_QUESTIONS + bonusQuestions;

  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length > 0 ? initialMessages : [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Merkez Veri Portalı Aktif. Kimlik doğrulandı: Dedektif.

Sorgu limiti: ${MAX_QUESTIONS} birim. 
Sistem yanıtları: "Affirmative", "Negative" veya "Unknown" protokollerine dayanır.

${isAiGenerated ? 'Yapay zeka katmanı devrede. Doğal dilde sorgu yapılabilir.' : '[OFFLINE] Yerel indeksler kullanılıyor. Anahtar kelimelere odaklanın.'}`,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(initialQuestionCount);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    onStateUpdate(messages, questionCount);
  }, [messages, questionCount, onStateUpdate]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading || questionCount >= MAX_QUESTIONS || isCaseSolved) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    
    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    try {
      let answer = "";
      if (isAiGenerated) {
        answer = await checkAnswerWithAI(scenario, userMsg.text);
      } else {
        await new Promise(r => setTimeout(r, 800));
        answer = checkOfflineAnswer(scenario, userMsg.text);
      }
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: answer,
        timestamp: new Date()
      };
      
      const updatedMessages = [...newMessages, aiMsg];
      
      if (newCount >= MAX_QUESTIONS) {
        setTimeout(() => {
          setMessages([...updatedMessages, {
            id: 'system-limit',
            sender: 'ai',
            text: '>>> KRİTİK HATA: SORGU LİMİTİ AŞILDI. BAĞLANTI KESİLİYOR...',
            timestamp: new Date()
          }]);
        }, 1200);
      } else {
        setMessages(updatedMessages);
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: 'VERİ AKIŞI KESİLDİ. TEKRAR DENEYİN.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingQuestions = MAX_QUESTIONS - questionCount;

  return (
    <div className={`flex flex-col h-[650px] animate-slide-up rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-black/60 border-stone-800' : 'bg-white border-stone-200'}`} style={{ transform: 'translateZ(0)' }}>
      <div className={`flex items-center justify-between border-b-2 p-4 ${isDarkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-stone-100'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-600/10 rounded-lg"><Cpu size={20} className="text-amber-500 animate-spin-slow" /></div>
          <div>
             <h2 className="text-sm font-bold font-typewriter text-amber-500 uppercase tracking-widest">{isAiGenerated ? 'Forensic DB Terminal' : 'Local Archive V3'}</h2>
             <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] text-stone-500 font-mono font-bold uppercase tracking-tighter">SECURE_LINK: ESTABLISHED</span>
             </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] text-stone-500 font-mono font-bold uppercase opacity-50">{isDarkMode ? 'THREAD_CAPACITY' : 'SORGULAMA KAPASİTESİ'}</span>
          <div className="flex gap-1.5">
             {Array.from({length: MAX_QUESTIONS}).map((_, i) => (
               <div 
                 key={i} 
                 className={`w-3 h-5 rounded-sm border transition-all duration-500 ${i < remainingQuestions ? 'bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.6)] border-amber-400' : (isDarkMode ? 'bg-stone-900 border-stone-800 opacity-20' : 'bg-stone-300 border-stone-400 opacity-30')}`}
               />
             ))}
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-6 p-6 font-mono custom-scrollbar ${isDarkMode ? 'bg-[linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]' : 'bg-slate-50'}`}>
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            style={{ animationDelay: '0.1s', transform: 'translateZ(0)' }}
          >
            <div 
              className={`
                max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed flex gap-4 shadow-2xl relative
                ${msg.sender === 'user' 
                  ? (isDarkMode ? 'bg-stone-800 text-stone-100 border-r-4 border-stone-600 rounded-tr-none' : 'bg-blue-700 text-white border-r-4 border-blue-500 rounded-tr-none')
                  : (isDarkMode ? 'bg-black/90 border-l-4 border-amber-600 text-amber-500/90 rounded-tl-none' : 'bg-white border-l-4 border-amber-500 text-amber-900 shadow-sm rounded-tl-none')
                }
              `}
            >
              <div className={`shrink-0 p-2 rounded-xl h-fit ${msg.sender === 'user' ? 'bg-white/10' : 'bg-amber-600/10'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="flex-1">
                <p className={`${msg.sender === 'ai' ? 'font-typewriter' : 'font-sans font-medium'} leading-snug`}>{msg.text}</p>
                <div className="mt-2 text-[8px] opacity-30 font-mono tracking-widest uppercase">
                   {msg.sender === 'user' ? 'ENCRYPTED_SIG: USER_DET_8821' : 'TR_LOG_TRACE: AI_CORE_NODE_X'}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className={`border-2 rounded-2xl p-3 px-6 flex gap-3 items-center ${isDarkMode ? 'bg-black/50 border-stone-800' : 'bg-white border-stone-300'}`}>
               <Bot size={18} className="text-amber-500 animate-bounce" />
               <div className="flex flex-col">
                  <span className="text-[10px] text-amber-500 font-mono font-bold">ANALYZING QUERY...</span>
                  <div className="flex gap-1 mt-1">
                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={`p-4 border-t-2 ${isDarkMode ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200'} transition-all focus-within:ring-2 focus-within:ring-amber-500/20`}>
        <div className="relative flex items-center gap-3">
           <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-stone-900 text-stone-500' : 'bg-stone-100 text-stone-400'}`}>
              <ShieldCheck size={20} className={remainingQuestions > 0 ? 'text-green-500 animate-pulse' : 'text-stone-500'} />
           </div>
           <input
             type="text"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             disabled={remainingQuestions <= 0 || isLoading || isCaseSolved}
             placeholder={isCaseSolved ? "SORGU OTURUMU SONLANDI." : (remainingQuestions > 0 ? "KRİTİK SORU GİRİN..." : "KAPASİTE DOLDU.")}
             className={`flex-1 bg-transparent py-4 text-sm font-bold font-mono focus:outline-none placeholder:opacity-30 ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
           />
           <button
             type="submit"
             disabled={!inputText.trim() || isLoading || remainingQuestions <= 0 || isCaseSolved}
             className={`p-4 rounded-xl transition-all shadow-xl active:scale-90 flex items-center justify-center
                ${remainingQuestions > 0 && !isCaseSolved ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-stone-800 text-stone-600 cursor-not-allowed'}`}
           >
             {remainingQuestions > 0 && !isCaseSolved ? <Send size={20} /> : <Lock size={20} />}
           </button>
        </div>
      </form>
    </div>
  );
});

export default InterrogationRoom;