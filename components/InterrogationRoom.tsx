

import React, { useState, useRef, useEffect } from 'react';
import { Scenario, ChatMessage } from '../types';
import { checkAnswerWithAI } from '../services/geminiService';
import { checkOfflineAnswer } from '../services/offlineCaseService';
import { Send, User, Bot, Lock, HardDrive } from 'lucide-react';

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

const BASE_QUESTIONS = 4; // Set to 4 as per request

const InterrogationRoom: React.FC<InterrogationRoomProps> = ({ 
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
      text: `Adli Tıp Laboratuvarı'na hoş geldiniz. Veritabanına erişim sağlandı.

DİKKAT: Kaynak kısıtlamaları nedeniyle sadece ${MAX_QUESTIONS} adet sorgu hakkınız bulunmaktadır. Sorularınızı dikkatli seçin. 

${isAiGenerated ? '"Evet/Hayır" ve "Bilmiyorum" formatında cevaplar alabilirsiniz.' : '[ÇEVRİMDIŞI MOD] Basit anahtar kelimeler kullanın (Örn: "Katil", "Ceset", "Motif").'}`,
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

  // Sync state with parent whenever local state changes
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
        // Simulate network delay for effect
        await new Promise(r => setTimeout(r, 600));
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
            text: '--- BAĞLANTI SONLANDIRILDI: GÜNLÜK SORGU LİMİTİ AŞILDI ---',
            timestamp: new Date()
          }]);
        }, 1000);
      } else {
        setMessages(updatedMessages);
      }

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sistem hatası. Lütfen tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingQuestions = MAX_QUESTIONS - questionCount;

  return (
    <div className={`flex flex-col h-[600px] animate-fade-in rounded-lg overflow-hidden border ${isDarkMode ? 'bg-black/40 border-stone-800' : 'bg-white border-stone-200 shadow-md'}`}>
      <div className={`flex items-center justify-between border-b p-3 ${isDarkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-stone-100'}`}>
        <h2 className="text-lg font-typewriter text-amber-500 flex items-center gap-2">
          <HardDrive size={18} /> {isAiGenerated ? 'Adli Tıp Terminali' : 'Yerel Arşiv (Offline)'}
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-stone-500 font-mono uppercase">İşlem Kapasitesi</span>
            <div className="flex gap-1">
               {Array.from({length: MAX_QUESTIONS}).map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-2 h-4 rounded-sm border transition-all duration-300 ${i < remainingQuestions ? 'bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)] border-stone-800' : (isDarkMode ? 'bg-stone-900 border-stone-800 opacity-30' : 'bg-stone-300 border-stone-400 opacity-30')}`}
                 />
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-4 p-4 font-mono ${isDarkMode ? 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]' : 'bg-slate-50'}`}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[85%] rounded p-3 text-sm leading-relaxed flex gap-3 shadow-lg
                ${msg.sender === 'user' 
                  ? (isDarkMode ? 'bg-stone-800 text-stone-100 border-l-2 border-stone-500' : 'bg-blue-600 text-white border-l-2 border-blue-400')
                  : (isDarkMode ? 'bg-black/80 border-l-2 border-amber-600 text-amber-500/90' : 'bg-white border-l-2 border-amber-500 text-amber-800 shadow-sm')
                }
              `}
            >
              <div className="shrink-0 mt-0.5 opacity-70">
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div>
                <p className={msg.sender === 'ai' ? 'font-typewriter' : ''}>{msg.text}</p>
                {msg.sender === 'ai' && msg.id === 'system-limit' && (
                  <div className="mt-2 text-red-500 font-bold tracking-widest text-xs border-t border-red-900/30 pt-1">
                    [OFFLINE]
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`border rounded p-2 px-4 flex gap-2 items-center ${isDarkMode ? 'bg-black/50 border-stone-800' : 'bg-white border-stone-300'}`}>
               <Bot size={14} className="text-stone-600" />
               <span className="text-xs text-stone-500 animate-pulse font-mono">Veritabanı taranıyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={`relative p-2 border-t ${isDarkMode ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200'}`}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={remainingQuestions <= 0 || isLoading || isCaseSolved}
          placeholder={isCaseSolved ? "Vaka kapandı. Terminal devre dışı." : (remainingQuestions > 0 ? "Soru girin..." : "Sorgu hakkı doldu.")}
          className={`w-full border rounded pl-4 pr-12 py-3 focus:outline-none focus:border-amber-700/50 text-sm font-mono transition-all placeholder:text-stone-500 ${isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-200 focus:bg-stone-800' : 'bg-white border-stone-300 text-stone-800 focus:bg-stone-50'}`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || remainingQuestions <= 0 || isCaseSolved}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-500 hover:text-amber-500 disabled:text-stone-400 disabled:hover:text-stone-400 transition-colors"
        >
          {remainingQuestions > 0 && !isCaseSolved ? <Send size={16} /> : <Lock size={16} />}
        </button>
      </form>
    </div>
  );
};

export default InterrogationRoom;