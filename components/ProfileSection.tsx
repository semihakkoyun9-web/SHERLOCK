import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, ShieldCheck, Star, CheckCircle, Lock, Trophy, Edit, Zap, Save, X, Palette, User, Image, CreditCard, Medal } from 'lucide-react';
import { getThemeColors } from './Layout';

interface ProfileSectionProps {
  profile: UserProfile;
  isDarkMode: boolean;
  onSelectDetective: (id: string) => void;
  onUpdateAvatar: (avatar: string) => void;
  onUpdateName?: (name: string) => void; 
  onUpdateProfileColor?: (color: string) => void;
  onUpdateAvatarColor?: (color: string) => void;
  language?: 'tr' | 'en';
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, isDarkMode, onSelectDetective, onUpdateAvatar, onUpdateName, onUpdateProfileColor, onUpdateAvatarColor, language = 'tr' }) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'image' | 'avatar_color' | 'card_color'>('image');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const isEn = language === 'en';

  const nextLevelXp = profile.level * 1000;
  const progressPercent = Math.min(100, (profile.xp / nextLevelXp) * 100);

  // Theme Logic
  const theme = getThemeColors(profile.activeThemeId, undefined, isDarkMode, !isDarkMode && false, !isDarkMode);
  
  const cardBg = `${theme.modalBg} border ${theme.modalBorder}`;
  const textPrimary = theme.text;
  const textSecondary = 'opacity-70';

  const solidColors = ['#e5e5e5', '#1c1917', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899'];
  const gradientColors = [
     'linear-gradient(to right, #facc15, #a855f7)', 'linear-gradient(to right, #f472b6, #db2777)',
     'linear-gradient(to right, #60a5fa, #34d399)', 'linear-gradient(to right, #0f172a, #334155)',
     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  ];

  // USING DICEBEAR v7.x which is very stable
  const availableAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight', 
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooby',
    'https://api.dicebear.com/7.x/micah/svg?seed=Shadow', 
    'https://api.dicebear.com/7.x/micah/svg?seed=Buster',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Leo', 
    'https://api.dicebear.com/7.x/notionists/svg?seed=Mila',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=John', 
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Jane',
  ];

  const rankData = [
    { rank: 'Çaylak (Rookie)', minXp: 0, icon: <User size={16} /> },
    { rank: 'Memur (Officer)', minXp: 5000, icon: <Shield size={16} /> },
    { rank: 'Dedektif (Detective)', minXp: 15000, icon: <ShieldCheck size={16} /> }, 
    { rank: 'Başkomiser (Chief)', minXp: 30000, icon: <Star size={16} /> },
    { rank: 'Efsane (Legend)', minXp: 50000, icon: <Medal size={16} /> },
  ];

  const saveName = () => {
    if (onUpdateName) onUpdateName(nameInput);
    setIsEditingName(false);
  };

  return (
    <div className={`animate-fade-in space-y-6 max-w-4xl mx-auto ${textPrimary}`}>
      
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-md p-6 rounded-xl border-2 flex flex-col gap-4 ${theme.modalBg} ${theme.modalBorder}`}>
              <div className="flex justify-between items-center">
                 <h3 className={`text-xl font-bold font-typewriter ${textPrimary}`}>{isEn ? "EDIT ID" : "KİMLİK DÜZENLEME"}</h3>
                 <button onClick={() => setShowAvatarPicker(false)}><X size={20} className="opacity-70 hover:opacity-100"/></button>
              </div>

              <div className={`flex border-b ${theme.modalBorder}`}>
                 <button onClick={() => setPickerTab('image')} className={`flex-1 py-2 text-xs md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2 ${pickerTab === 'image' ? 'opacity-100 border-b-2' : 'opacity-50'}`}>
                   <Image size={16} /> {isEn ? "IMAGE" : "GÖRSEL"}
                 </button>
                 <button onClick={() => setPickerTab('avatar_color')} className={`flex-1 py-2 text-xs md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2 ${pickerTab === 'avatar_color' ? 'opacity-100 border-b-2' : 'opacity-50'}`}>
                   <Palette size={16} /> {isEn ? "BG COLOR" : "KİMLİK"}
                 </button>
                 <button onClick={() => setPickerTab('card_color')} className={`flex-1 py-2 text-xs md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2 ${pickerTab === 'card_color' ? 'opacity-100 border-b-2' : 'opacity-50'}`}>
                   <CreditCard size={16} /> {isEn ? "CARD COLOR" : "KART RENGİ"}
                 </button>
              </div>
              
              <div className="min-h-[250px]">
                 {pickerTab === 'image' ? (
                   <div className="grid grid-cols-4 gap-3">
                      {availableAvatars.map((av, idx) => (
                          <button key={idx} onClick={() => { onUpdateAvatar(av); }} className={`w-full aspect-square rounded overflow-hidden border-2 transition-transform hover:scale-105 ${profile.avatar === av ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/20 bg-stone-200'}`}>
                            {/* Force white background for preview */}
                            <img src={av} alt="Avatar" className="w-full h-full object-cover bg-white" />
                          </button>
                      ))}
                   </div>
                 ) : pickerTab === 'avatar_color' ? (
                   <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold opacity-60 mb-2 block uppercase">{isEn ? "Solid Colors" : "Düz Renkler"}</span>
                        <div className="flex flex-wrap gap-2">
                            {solidColors.map(c => (
                              <button key={c} onClick={() => onUpdateAvatarColor && onUpdateAvatarColor(c)} className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${profile.avatarColor === c ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/20'}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold opacity-60 mb-2 block uppercase">{isEn ? "Gradients" : "Gradientler"}</span>
                        <div className="flex flex-wrap gap-2">
                            {gradientColors.map(c => (
                              <button key={c} onClick={() => onUpdateAvatarColor && onUpdateAvatarColor(c)} className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${profile.avatarColor === c ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/20'}`} style={{ background: c }} />
                            ))}
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-4">
                       <div>
                         <span className="text-xs font-bold opacity-60 mb-2 block uppercase">{isEn ? "Card Colors" : "Kart Renkleri"}</span>
                         <div className="flex flex-wrap gap-2">
                             <button onClick={() => onUpdateProfileColor && onUpdateProfileColor('')} className={`w-10 h-10 rounded border-2 transition-transform hover:scale-110 flex items-center justify-center ${!profile.profileColor ? 'border-amber-500' : 'border-white/20'}`} title="Default"><X size={14} className="opacity-50" /></button>
                             {solidColors.map(c => (
                               <button key={c} onClick={() => onUpdateProfileColor && onUpdateProfileColor(c)} className={`w-10 h-10 rounded border-2 transition-transform hover:scale-110 ${profile.profileColor === c ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/20'}`} style={{ backgroundColor: c }} />
                             ))}
                         </div>
                       </div>
                       <div>
                         <span className="text-xs font-bold opacity-60 mb-2 block uppercase">{isEn ? "Card Gradients" : "Kart Gradientleri"}</span>
                         <div className="flex flex-wrap gap-2">
                             {gradientColors.map(c => (
                               <button key={c} onClick={() => onUpdateProfileColor && onUpdateProfileColor(c)} className={`w-10 h-10 rounded border-2 transition-transform hover:scale-110 ${profile.profileColor === c ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/20'}`} style={{ background: c }} />
                             ))}
                         </div>
                       </div>
                   </div>
                 )}
              </div>
              
              <button onClick={() => setShowAvatarPicker(false)} className={`w-full py-3 ${theme.button} rounded font-bold uppercase text-xs`}>
                {isEn ? "SAVE & CLOSE" : "KAYDET VE KAPAT"}
              </button>
           </div>
        </div>
      )}

      <div className={`${cardBg} rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden transition-colors duration-500 animate-fade-in`} style={{ background: profile.profileColor || undefined }}>
        <div className="group relative cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-white/10 relative z-10 transition-colors" style={{ background: profile.avatarColor || '#e5e5e5' }}>
              {/* Force white background on img if custom color is not set, otherwise it handles transparency */}
              {profile.avatar.startsWith('http') ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-4xl">{profile.avatar}</span>}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Edit className="text-white" size={24} /></div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2 relative z-10 w-full">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                    <input value={nameInput} onChange={e => setNameInput(e.target.value)} className={`text-2xl font-bold bg-transparent border-b-2 focus:outline-none ${textPrimary}`} autoFocus />
                    <button onClick={saveName} className="p-1 bg-green-600 rounded text-white"><Save size={16}/></button>
                </div>
              ) : (
                <h2 className={`text-3xl font-bold ${textPrimary} flex items-center gap-2 group`}>{profile.name}<button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-amber-500 transition-opacity"><Edit size={16} /></button></h2>
              )}
              <span className={`text-sm px-2 py-1 rounded border font-mono font-normal tracking-wide uppercase bg-black/10 border-white/10 ${textPrimary}`}>
                {isEn ? "Level" : "Seviye"} {profile.level} | {profile.title}
              </span>
            </div>
            
            <div className="text-xs font-mono opacity-60 flex justify-center md:justify-start gap-4">
              <span>ID: <span className="opacity-80 select-all">{profile.userId}</span></span>
            </div>
            
            <div className="flex items-center gap-2 max-w-sm mx-auto md:mx-0">
              <Zap size={14} className="text-blue-500" />
              <div className="flex-1 bg-black/30 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(profile.energy / profile.maxEnergy) * 100}%` }}></div>
              </div>
              <span className="text-xs font-mono text-blue-500">{profile.energy}/{profile.maxEnergy} {isEn ? "Energy" : "Enerji"}</span>
            </div>

            <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden relative">
              <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-xs font-mono opacity-60">
              <span>XP: {profile.xp} / {nextLevelXp}</span>
              <span>{isEn ? "Next Level" : "Sonraki Seviye"}: %{Math.round(progressPercent)}</span>
            </div>
        </div>
        <div className={`flex flex-col gap-2 p-4 rounded-lg min-w-[150px] relative z-10 bg-black/20`}>
            <div className="flex items-center gap-2"><Shield size={18} className="text-blue-500" /><span className={`font-bold ${textPrimary}`}>{profile.detectives.filter(d => d.isOwned).length} {isEn ? "Detectives" : "Dedektif"}</span></div>
            <div className="flex items-center gap-2"><Star size={18} className="text-amber-500" /><span className={`font-bold ${textPrimary}`}>{profile.inventory.length} {isEn ? "Items" : "Eşya"}</span></div>
            <div className="flex items-center gap-2 border-t border-white/10 pt-2 mt-1"><Trophy size={18} className="text-yellow-500" /><span className={`font-bold ${textPrimary}`}>{profile.score.toLocaleString()} {isEn ? "Pts" : "Puan"}</span></div>
        </div>
      </div>
      
      {/* RANK PROGRESSION CHART */}
      <h3 className={`text-xl font-typewriter font-bold mt-8 mb-4 border-b pb-2 opacity-80 border-white/20`}>{isEn ? "RANK PROGRESSION" : "RÜTBE İLERLEMESİ"}</h3>
      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
         {rankData.map((r, idx) => {
             const isAchieved = profile.xp >= r.minXp;
             return (
                 <div key={idx} className={`p-4 flex items-center justify-between border-b last:border-0 ${theme.modalBorder} ${isAchieved ? 'bg-white/5' : 'opacity-50 grayscale'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isAchieved ? 'bg-amber-600 text-white' : 'bg-black/40'}`}>{r.icon}</div>
                        <div>
                            <div className={`font-bold ${textPrimary}`}>{r.rank}</div>
                            <div className="text-xs opacity-60">{r.minXp} XP</div>
                        </div>
                     </div>
                     {isAchieved && <CheckCircle className="text-green-500" size={20} />}
                 </div>
             )
         })}
      </div>

      <h3 className={`text-xl font-typewriter font-bold mt-8 mb-4 border-b pb-2 opacity-80 border-white/20`}>{isEn ? "SELECT CHARACTER" : "KARAKTER SEÇİMİ"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {profile.detectives.map(det => {
            const isSelected = det.id === profile.selectedDetectiveId;
            const isLocked = !det.isOwned;

            return (
               <div key={det.id} onClick={() => onSelectDetective(det.id)} className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 overflow-hidden 
                  ${isSelected ? `${theme.modalBg} border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.2)]` : `${theme.modalBg} border-white/10 hover:border-white/30`} 
                  ${isLocked ? 'grayscale opacity-80 hover:opacity-100' : ''}
               `}>
                  {isSelected && <div className="absolute top-2 right-2 text-green-500"><CheckCircle size={20} /></div>}
                  {isLocked && <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10"><Lock className="text-stone-400 w-12 h-12" /></div>}
                  <div className="text-4xl mb-3">{det.avatar}</div>
                  <h4 className={`text-lg font-bold ${isSelected ? theme.accent : textPrimary}`}>{det.name}</h4>
                  <span className="text-xs uppercase tracking-widest opacity-60 block mb-2">{det.title}</span>
                  <p className={`text-sm opacity-60 mb-4 min-h-[40px]`}>{det.description}</p>
                  <div className={`text-xs p-2 rounded bg-black/20 font-mono border border-white/10`}>
                     <span className="block font-bold mb-1 opacity-80">{isEn ? "ABILITY:" : "ÖZEL YETENEK:"}</span> {det.specialAbility}
                  </div>
                  {isLocked && <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-white bg-black/80 py-1 rounded relative z-20 shadow-xl">{det.price} ₵ {isEn ? "BUY" : "SATIN AL"}</div>}
               </div>
            )
         })}
      </div>
    </div>
  );
};

export default ProfileSection;