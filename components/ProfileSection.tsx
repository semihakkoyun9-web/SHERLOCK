

import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
// Added Users to the imports
import { Shield, ShieldCheck, Star, CheckCircle, Lock, Trophy, Edit, Zap, Save, X, Palette, User, Image, CreditCard, Medal, Users } from 'lucide-react';
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
  // Added missing brightness prop
  brightness: number;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, isDarkMode, onSelectDetective, onUpdateAvatar, onUpdateName, onUpdateProfileColor, onUpdateAvatarColor, language = 'tr', brightness }) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'image' | 'avatar_color' | 'card_color'>('image');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const isEn = language === 'en';

  const nextLevelXp = profile.level * 1000;
  const progressPercent = Math.min(100, (profile.xp / nextLevelXp) * 100);

  // Theme Integration - Fixed: getThemeColors expects 4 arguments (activeTheme, department, isDarkMode, brightness)
  const theme = useMemo(() => getThemeColors(profile.activeThemeId, undefined, isDarkMode, brightness), [profile.activeThemeId, isDarkMode, brightness]);
  
  const cardBg = `${theme.modalBg} border ${theme.modalBorder}`;
  const textPrimary = theme.text;

  const solidColors = ['#e5e5e5', '#1c1917', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899'];
  const gradientColors = [
     'linear-gradient(to right, #facc15, #a855f7)', 'linear-gradient(to right, #f472b6, #db2777)',
     'linear-gradient(to right, #60a5fa, #34d399)', 'linear-gradient(to right, #0f172a, #334155)',
     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  ];

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

  return (
    <div className={`animate-slide-up space-y-8 max-w-5xl mx-auto pb-10 ${textPrimary}`}>
      
      {/* HEADER CARD */}
      <div className={`${cardBg} rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl animate-slide-up stagger-1`} style={{ background: profile.profileColor || undefined, transform: 'translateZ(0)' }}>
        <div className="group relative cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
          <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white/20 relative z-10 transition-transform group-hover:scale-105" style={{ background: profile.avatarColor || '#e5e5e5' }}>
              {profile.avatar.startsWith('http') ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-5xl">{profile.avatar}</span>}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Edit className="text-white" size={32} /></div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-3 py-1 rounded-full text-[10px] font-bold z-20 border-2 border-stone-900 whitespace-nowrap shadow-lg uppercase">
             {isEn ? "EDIT ID" : "KİMLİĞİ DÜZENLE"}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3 relative z-10 w-full">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 animate-fade-in">
                    <input value={nameInput} onChange={e => setNameInput(e.target.value)} className={`text-3xl font-bold bg-black/20 border-b-2 border-amber-500 focus:outline-none ${textPrimary} px-2`} autoFocus />
                    <button onClick={() => { onUpdateName?.(nameInput); setIsEditingName(false); }} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white shadow-lg transition-all"><Save size={20}/></button>
                </div>
              ) : (
                <h2 className={`text-4xl font-bold ${textPrimary} flex items-center gap-3 group tracking-tight`}>
                  {profile.name}
                  <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-amber-500 transition-all transform hover:scale-110"><Edit size={20} /></button>
                </h2>
              )}
              <span className={`text-xs px-3 py-1 rounded-full border font-mono font-bold tracking-widest uppercase bg-black/30 border-white/10 shadow-inner ${textPrimary}`}>
                {isEn ? "Level" : "Seviye"} {profile.level} | {profile.title}
              </span>
            </div>
            
            <div className="flex items-center gap-3 max-w-md mx-auto md:mx-0">
              <Zap size={16} className="text-blue-500 animate-pulse" />
              <div className="flex-1 bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_10px_#3b82f6]" style={{ width: `${(profile.energy / profile.maxEnergy) * 100}%` }}></div>
              </div>
              <span className="text-xs font-mono text-blue-400 font-bold">{profile.energy}/{profile.maxEnergy} ENR</span>
            </div>

            <div className="w-full bg-black/40 h-4 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
              <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out shadow-[0_0_15px_#f59e0b]" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono font-bold opacity-70 tracking-widest">
              <span>XP: {profile.xp} / {nextLevelXp}</span>
              <span className="text-amber-500 uppercase">{isEn ? "Progress" : "İlerleme"}: %{Math.round(progressPercent)}</span>
            </div>
        </div>

        <div className={`flex flex-col gap-3 p-5 rounded-xl relative z-10 bg-black/30 border border-white/5 min-w-[200px] shadow-2xl`}>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Shield size={18} className="text-blue-500" /><span className="text-xs font-bold opacity-60">{isEn ? "DETECTIVES" : "DEDEKTİFLER"}</span></div><span className="font-mono font-bold">{profile.detectives.filter(d => d.isOwned).length}</span></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Star size={18} className="text-amber-500" /><span className="text-xs font-bold opacity-60">{isEn ? "COLLECTIBLES" : "KOLEKSİYON"}</span></div><span className="font-mono font-bold">{profile.inventory.length}</span></div>
            <div className="h-px bg-white/10 my-1"></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /><span className="text-xs font-bold opacity-60 uppercase">{isEn ? "TOTAL SCORE" : "TOPLAM PUAN"}</span></div><span className="font-mono font-bold text-amber-500">{profile.score.toLocaleString()}</span></div>
        </div>
      </div>
      
      {/* TABS / SECTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RANK PROGRESSION */}
        <div className="animate-slide-up stagger-2">
          <h3 className={`text-lg font-typewriter font-bold mb-4 flex items-center gap-3 opacity-80`}><Trophy size={20} className="text-amber-500"/> {isEn ? "RANK PROGRESSION" : "RÜTBE İLERLEMESİ"}</h3>
          <div className={`${cardBg} rounded-xl overflow-hidden shadow-xl`}>
             {rankData.map((r, idx) => {
                 const isAchieved = profile.xp >= r.minXp;
                 return (
                     <div key={idx} className={`p-4 flex items-center justify-between border-b last:border-0 transition-all ${theme.modalBorder} ${isAchieved ? 'bg-amber-600/5' : 'opacity-30 grayscale'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl border ${isAchieved ? 'bg-amber-600 border-amber-400 text-white shadow-lg' : 'bg-black/40 border-stone-800'}`}>{r.icon}</div>
                            <div>
                                <div className={`font-bold text-sm ${isAchieved ? textPrimary : 'text-stone-500'}`}>{r.rank}</div>
                                <div className="text-[10px] font-mono opacity-50 uppercase">{r.minXp} XP REQUIRED</div>
                            </div>
                         </div>
                         {isAchieved ? <CheckCircle className="text-green-500" size={20} /> : <Lock className="text-stone-700" size={16} />}
                     </div>
                 )
             })}
          </div>
        </div>

        {/* CHARACTER SELECTION */}
        <div className="animate-slide-up stagger-3">
          <h3 className={`text-lg font-typewriter font-bold mb-4 flex items-center gap-3 opacity-80`}><Users size={20} className="text-blue-500"/> {isEn ? "ACTIVE PERSONNEL" : "AKTİF PERSONEL"}</h3>
          <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {profile.detectives.map((det, idx) => {
                const isSelected = det.id === profile.selectedDetectiveId;
                const isLocked = !det.isOwned;
                return (
                   <div key={det.id} onClick={() => !isLocked && onSelectDetective(det.id)} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-4 animate-slide-up stagger-${(idx % 3) + 1}
                      ${isSelected ? `bg-amber-900/10 border-amber-600 shadow-2xl` : `${theme.modalBg} border-white/5 hover:border-white/20`} 
                      ${isLocked ? 'grayscale opacity-60' : ''}
                   `} style={{ transform: 'translateZ(0)' }}>
                      <div className="text-4xl shrink-0 bg-black/20 p-3 rounded-lg border border-white/5">{det.avatar}</div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                            <h4 className={`text-md font-bold truncate ${isSelected ? 'text-amber-500' : textPrimary}`}>{det.name}</h4>
                            {isSelected && <div className="bg-green-600 text-white text-[8px] px-2 py-0.5 rounded-full font-bold animate-pulse">ACTIVE</div>}
                         </div>
                         <div className={`text-[10px] p-1.5 rounded bg-black/30 font-mono border border-white/5 mt-1 text-blue-400`}>
                            <span className="font-bold opacity-70 uppercase">{isEn ? "TRAIT:" : "YETENEK:"}</span> {det.specialAbility}
                         </div>
                      </div>
                      {isLocked && <div className="bg-stone-800 text-stone-500 p-2 rounded-lg"><Lock size={16}/></div>}
                   </div>
                )
             })}
          </div>
        </div>
      </div>

      {/* AVATAR PICKER MODAL (Keep original logic but improve design) */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
           <div className={`w-full max-w-lg p-8 rounded-2xl border-2 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col gap-6 animate-scale-in ${theme.modalBg} ${theme.modalBorder}`}>
              <div className="flex justify-between items-center">
                 <h3 className={`text-2xl font-bold font-typewriter tracking-tighter ${textPrimary}`}>{isEn ? "ADJUST PERSONNEL FILE" : "PERSONEL DOSYASI DÜZENLE"}</h3>
                 <button onClick={() => setShowAvatarPicker(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} className="opacity-50 hover:opacity-100"/></button>
              </div>

              <div className={`flex p-1 rounded-xl bg-black/40 border ${theme.modalBorder}`}>
                 {['image', 'avatar_color', 'card_color'].map((tab) => (
                    <button key={tab} onClick={() => setPickerTab(tab as any)} className={`flex-1 py-3 text-[10px] font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${pickerTab === tab ? 'bg-amber-600 text-white shadow-lg' : 'opacity-40 hover:opacity-70'}`}>
                      {tab === 'image' ? <Image size={14} /> : tab === 'avatar_color' ? <Palette size={14} /> : <CreditCard size={14} />}
                      {tab.replace('_', ' ').toUpperCase()}
                    </button>
                 ))}
              </div>
              
              <div className="min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar">
                 {pickerTab === 'image' ? (
                   <div className="grid grid-cols-5 gap-3">
                      {availableAvatars.map((av, idx) => (
                          <button key={idx} onClick={() => { onUpdateAvatar(av); }} className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${profile.avatar === av ? 'border-amber-500 ring-4 ring-amber-500/20' : 'border-white/10 bg-stone-200'}`}>
                            <img src={av} alt="Avatar" className="w-full h-full object-cover bg-white" />
                          </button>
                      ))}
                   </div>
                 ) : (
                   <div className="space-y-6 animate-fade-in">
                      <div>
                        <span className="text-xs font-bold opacity-60 mb-4 block uppercase tracking-widest">{isEn ? "Solid Options" : "Düz Renkler"}</span>
                        <div className="flex flex-wrap gap-3">
                            {solidColors.map(c => (
                              <button key={c} onClick={() => pickerTab === 'avatar_color' ? onUpdateAvatarColor?.(c) : onUpdateProfileColor?.(c)} className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 active:scale-90 shadow-lg ${ (pickerTab === 'avatar_color' ? profile.avatarColor : profile.profileColor) === c ? 'border-white ring-4 ring-white/20 scale-105' : 'border-white/10'}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold opacity-60 mb-4 block uppercase tracking-widest">{isEn ? "Advanced Gradients" : "Özel Geçişler"}</span>
                        <div className="flex flex-wrap gap-3">
                            {gradientColors.map(c => (
                              <button key={c} onClick={() => pickerTab === 'avatar_color' ? onUpdateAvatarColor?.(c) : onUpdateProfileColor?.(c)} className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 active:scale-90 shadow-lg ${ (pickerTab === 'avatar_color' ? profile.avatarColor : profile.profileColor) === c ? 'border-white ring-4 ring-white/20 scale-105' : 'border-white/10'}`} style={{ background: c }} />
                            ))}
                        </div>
                      </div>
                   </div>
                 )}
              </div>
              
              <button onClick={() => setShowAvatarPicker(false)} className={`w-full py-4 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-bold uppercase text-sm tracking-widest transition-all shadow-2xl active:scale-[0.98]`}>
                {isEn ? "UPDATE DOSSIER" : "DOSYAYI GÜNCELLE"}
              </button>
           </div>
        </div>
      )}

      {/* FOOTER DECORATION */}
      <div className="mt-10 pt-10 border-t border-white/5 flex justify-center gap-12 opacity-10 grayscale">
         <div className="flex flex-col items-center gap-2"><Trophy size={32}/><span className="text-[10px] font-mono uppercase tracking-[0.2em]">Honor_System_v4</span></div>
         <div className="flex flex-col items-center gap-2"><Shield size={32}/><span className="text-[10px] font-mono uppercase tracking-[0.2em]">Dept_Verified</span></div>
         <div className="flex flex-col items-center gap-2"><Zap size={32}/><span className="text-[10px] font-mono uppercase tracking-[0.2em]">Engine_Ready</span></div>
      </div>
    </div>
  );
};

export default ProfileSection;
