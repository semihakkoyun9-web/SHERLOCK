import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, Friend, SocialPost } from '../types';
import { Send, Smile, Users, Globe, Circle, UserPlus, PlayCircle, X, MessageSquare, ShieldAlert } from 'lucide-react';

interface SocialHubProps {
  isDarkMode: boolean;
  userProfile: UserProfile;
  onInviteFriend?: (friendId: string) => void;
  isSidebar?: boolean; 
  language?: 'tr' | 'en';
}

const SocialHub: React.FC<SocialHubProps> = ({ isDarkMode, userProfile, onInviteFriend, isSidebar = false, language = 'tr' }) => {
  const [messages, setMessages] = useState<SocialPost[]>([]);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'friends'>('chat');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);

  const isEn = language === 'en';
  const scrollRef = useRef<HTMLDivElement>(null);

  const emojis = ['👍', '👋', '🕵️‍♂️', '🔍', '💡', '🚔', '🩸', '💻', '🤔', '😎', '😱', '🤐', '📜', '⚖️', '🗝️', '💣', '👀', '🤫', '👮', '🧠'];

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, activeTab]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if(!input.trim()) return;

    const newMsg: SocialPost = {
      id: Date.now().toString(),
      user: userProfile.name,
      avatar: userProfile.avatar || '👤',
      message: input,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'tr-TR', { hour: '2-digit', minute: '2-digit'}),
      isMe: true
    };
    setMessages(p => [...p, newMsg]);
    setInput('');
    setShowEmojis(false);
  };

  const addEmoji = (emoji: string) => setInput(p => p + emoji);

  const handleAddFriend = () => {
     if (!friendIdInput.trim()) return;
     const newFriend: Friend = {
        id: friendIdInput,
        name: `Agent_${friendIdInput.replace('#', '')}`,
        status: 'online',
        avatar: '🕵️'
     };
     setFriends(p => [...p, newFriend]);
     setShowAddFriend(false);
     setFriendIdInput('');
     const sysMsg: SocialPost = {
        id: Date.now().toString(),
        user: 'SYSTEM',
        avatar: '🛡️',
        message: isEn ? `Connected to frequency ${newFriend.id}.` : `${newFriend.id} frekansına bağlanıldı.`,
        timestamp: new Date().toLocaleTimeString(),
        isMe: false
     };
     setMessages(p => [...p, sysMsg]);
  };

  const cardBg = isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-md';
  const textPrimary = isDarkMode ? 'text-stone-200' : 'text-stone-800';
  
  const containerClass = isSidebar ? 'flex flex-col h-full bg-transparent p-0' : 'h-[calc(100vh-200px)] min-h-[500px] flex gap-4 max-w-6xl mx-auto flex-col md:flex-row relative';
  const chatContainerClass = isSidebar ? 'flex-1 flex flex-col overflow-hidden bg-transparent' : `flex-1 ${cardBg} border rounded-xl flex flex-col overflow-hidden order-2 md:order-1`;
  const friendsContainerClass = isSidebar ? 'flex-1 flex flex-col overflow-hidden bg-transparent' : `w-full md:w-64 flex flex-col ${cardBg} border rounded-xl overflow-hidden order-1 md:order-2 h-[300px] md:h-auto`;

  return (
    <div className={`animate-fade-in ${containerClass}`}>
       
       {showAddFriend && (
          <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className={`w-80 p-6 rounded-lg border shadow-2xl ${isDarkMode ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-bold font-typewriter ${textPrimary}`}>{isEn ? "ADD FREQUENCY" : "FREKANS EKLE"}</h3>
                   <button onClick={() => setShowAddFriend(false)} className="text-stone-500 hover:text-red-500"><X size={20}/></button>
                </div>
                <p className="text-xs text-stone-500 mb-2">{isEn ? "Enter Detective ID to connect." : "Bağlanmak istediğiniz Dedektifin ID numarasını girin."}</p>
                <input placeholder="#TR-XXXX" value={friendIdInput} onChange={e => setFriendIdInput(e.target.value)} className={`w-full p-2 rounded border mb-4 font-mono ${isDarkMode ? 'bg-stone-950 border-stone-800 text-white' : 'bg-stone-50 border-stone-300 text-black'}`} />
                <button onClick={handleAddFriend} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold">{isEn ? "CONNECT" : "BAĞLANTI KUR"}</button>
             </div>
          </div>
       )}
       
       {isSidebar && (
         <div className={`flex border-b ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
            <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-stone-500'}`}><MessageSquare size={14} /> {isEn ? "CHAT" : "SOHBET"}</button>
            <button onClick={() => setActiveTab('friends')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${activeTab === 'friends' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-stone-500'}`}><Users size={14} /> {isEn ? "AGENTS" : "FREKANSLAR"}</button>
         </div>
       )}

       {(!isSidebar || activeTab === 'chat') && (
         <div className={chatContainerClass}>
            {!isSidebar && (
              <div className={`p-4 border-b ${isDarkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-100 bg-stone-50'} flex items-center justify-between`}>
                <div className="flex items-center gap-2"><Globe className="text-blue-500" size={20} /><h2 className={`font-bold ${textPrimary}`}>{isEn ? "Encrypted Net" : "Şifreli Ağ"}</h2></div>
                <div className="text-xs text-stone-500 flex items-center gap-1 font-mono">ID: {userProfile.userId}</div>
              </div>
            )}

            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-[#111]' : 'bg-slate-50'}`} ref={scrollRef}>
              {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-2">
                      <ShieldAlert size={48} />
                      <p className="text-sm font-mono">{isEn ? "Waiting for connection..." : "Bağlantı bekleniyor..."}</p>
                  </div>
              ) : (
                messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border overflow-hidden shrink-0 ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200 shadow-sm'}`}>
                        {msg.avatar.startsWith('http') ? <img src={msg.avatar} alt="av" /> : msg.avatar}
                        </div>
                        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.isMe ? (isDarkMode ? 'bg-amber-900/50 text-amber-100 border border-amber-800' : 'bg-blue-600 text-white') : (isDarkMode ? 'bg-stone-800 text-stone-300 border border-stone-700' : 'bg-white text-stone-800 border border-stone-200 shadow-sm')}`}>
                        {!msg.isMe && <div className={`text-[10px] font-bold mb-1 opacity-70 ${isDarkMode ? 'text-amber-500' : 'text-blue-600'}`}>{msg.user}</div>}
                        {msg.message}
                        </div>
                    </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className={`p-3 border-t ${isDarkMode ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'} relative shrink-0`}>
              {showEmojis && (
                <div className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-xl grid grid-cols-5 gap-1 border ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'} max-h-40 overflow-y-auto w-64`}>
                    {emojis.map(e => <button key={e} type="button" onClick={() => addEmoji(e)} className="hover:bg-black/10 p-1 rounded text-lg">{e}</button>)}
                </div>
              )}
              <div className="flex gap-2">
                  <button type="button" onClick={() => setShowEmojis(!showEmojis)} className={`p-2 rounded hover:bg-black/10 transition-colors ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}><Smile size={20} /></button>
                  <input value={input} onChange={e => setInput(e.target.value)} placeholder={isEn ? "Message..." : "Mesaj yaz..."} className={`flex-1 bg-transparent focus:outline-none ${textPrimary} placeholder:opacity-50 min-w-0`} />
                  <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"><Send size={18} /></button>
              </div>
            </form>
         </div>
       )}

       {(!isSidebar || activeTab === 'friends') && (
         <div className={friendsContainerClass}>
            {!isSidebar && (
              <div className={`p-4 border-b ${isDarkMode ? 'border-stone-800 bg-stone-950' : 'border-stone-100 bg-stone-50'} flex justify-between items-center`}>
                <h3 className={`font-bold flex items-center gap-2 ${textPrimary}`}><Users size={18} /> {isEn ? "Contacts" : "Bağlantılar"}</h3>
                <button onClick={() => setShowAddFriend(true)} className="text-stone-500 hover:text-blue-500"><UserPlus size={16}/></button>
              </div>
            )}
            
            {isSidebar && (
               <div className={`p-3 border-b flex justify-between items-center ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                  <span className="text-xs font-bold text-stone-500">{isEn ? "CONTACT LIST" : "KİŞİ LİSTESİ"}</span>
                  <button onClick={() => setShowAddFriend(true)} className="text-xs bg-stone-800 p-1 rounded text-stone-400 border border-stone-700"><UserPlus size={14}/></button>
               </div>
            )}

            <div className="p-2 space-y-1 overflow-y-auto flex-1">
              {friends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-40 text-center p-4">
                      <p className="text-xs text-stone-500 mb-2">{isEn ? "List empty." : "Listeniz boş."}</p>
                      <button onClick={() => setShowAddFriend(true)} className="text-xs text-blue-500 underline">{isEn ? "Add by ID" : "ID ile Ekle"}</button>
                  </div>
              ) : (
                friends.map(friend => (
                    <div key={friend.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors group ${isDarkMode ? 'hover:bg-stone-800' : 'hover:bg-slate-100'}`}>
                        <div className="relative shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border overflow-hidden ${isDarkMode ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>{friend.avatar.startsWith('http') ? <img src={friend.avatar} alt="av" /> : friend.avatar}</div>
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-stone-900' : 'border-white'} ${friend.status === 'online' ? 'bg-green-500' : 'bg-stone-400'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold truncate ${textPrimary}`}>{friend.name}</div>
                            <div className="text-[10px] text-stone-500 uppercase">{friend.id}</div>
                        </div>
                        {friend.status === 'online' && onInviteFriend && (
                            <button onClick={() => onInviteFriend(friend.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500"><PlayCircle size={14} /></button>
                        )}
                    </div>
                ))
              )}
            </div>
         </div>
       )}
    </div>
  );
};

export default SocialHub;