
import React, { useState, useMemo } from 'react';
import { ShieldCheck, ArrowLeft, Sun, Moon, User, ShoppingBag, LayoutGrid, Zap, AlertTriangle, CheckCircle, X, Settings, Volume2, Music, Power, PlayCircle, PauseCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { Department, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onReturnToDesk?: () => void;
  showBackButton?: boolean;
  department?: Department;
  currentSection: string;
  onNavigate: (section: string) => void;
  brightness: number; 
  setBrightness: (val: number) => void;
  userProfile: UserProfile;
  notification?: string;
  error?: string;
  onErrorClear?: () => void;
  onNotificationClear?: () => void;
  isStoreOpen: boolean;
  onToggleStore: () => void;
  storeContent: React.ReactNode;
  language: 'tr' | 'en';
  onLanguageChange: (lang: 'tr' | 'en') => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  sfxVolume: number;
  setSfxVolume: (v: number) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (p: boolean) => void;
  onPlayClick: () => void;
  currentMusicId?: string;
  setCurrentMusicId?: (id: string) => void;
  musicTracks?: { id: string; name: string; url: string }[];
  onExitDevMode?: () => void;
  onShowHowToPlay?: () => void;
}

export const getThemeColors = (activeTheme: string | undefined, department: string | undefined, isDarkMode: boolean, brightness: number) => {
    const isBright = brightness > 60;
    const baseTextColor = isBright ? 'text-stone-950' : (isDarkMode ? 'text-stone-200' : 'text-stone-800');
    const mutedTextColor = isBright ? 'text-stone-700' : (isDarkMode ? 'text-stone-400' : 'text-stone-500');
    const modalBg = isDarkMode ? 'bg-stone-900' : 'bg-white';
    const modalBorder = isDarkMode ? 'border-stone-700' : 'border-stone-200';

    if (activeTheme === 'theme_matrix') return { text: isBright ? 'text-green-950' : 'text-green-500', muted: 'text-green-800', bg: 'bg-green-600', border: 'border-green-900', accent: 'text-green-400', button: 'bg-green-700 text-green-100', modalBg: 'bg-black', modalBorder: 'border-green-500' };
    if (activeTheme === 'theme_ice') return { text: isBright ? 'text-cyan-950' : 'text-cyan-800', muted: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-300', accent: 'text-cyan-600', button: 'bg-cyan-600 text-white', modalBg: 'bg-cyan-50', modalBorder: 'border-cyan-300' };
    if (activeTheme === 'theme_luxury') return { text: isBright ? 'text-stone-950' : 'text-yellow-600', muted: 'text-yellow-800', bg: 'bg-stone-950', border: 'border-yellow-600', accent: 'text-yellow-500', button: 'bg-yellow-700 text-white', modalBg: 'bg-[#0f0f0f]', modalBorder: 'border-yellow-600' };
    if (activeTheme === 'theme_sepia') return { text: 'text-[#5d4037]', muted: 'text-[#8d6e63]', bg: 'bg-[#3e2723]', border: 'border-[#5d4037]', accent: 'text-[#8d6e63]', button: 'bg-[#5d4037] text-[#eecfa1]', modalBg: 'bg-[#fff9f0]', modalBorder: 'border-[#d7ccc8]' };
    if (activeTheme === 'theme_cyberpunk') return { text: 'text-fuchsia-400', muted: 'text-fuchsia-800', bg: 'bg-fuchsia-950', border: 'border-fuchsia-600', accent: 'text-cyan-400', button: 'bg-fuchsia-700 text-white', modalBg: 'bg-[#1a0a2e]', modalBorder: 'border-fuchsia-500' };
    if (activeTheme === 'theme_forest') return { text: 'text-emerald-400', muted: 'text-emerald-800', bg: 'bg-emerald-950', border: 'border-emerald-600', accent: 'text-emerald-500', button: 'bg-emerald-700 text-white', modalBg: 'bg-[#061a0f]', modalBorder: 'border-emerald-500' };
    if (activeTheme === 'theme_crimson') return { text: 'text-red-500', muted: 'text-red-900', bg: 'bg-red-950', border: 'border-red-700', accent: 'text-red-400', button: 'bg-red-800 text-white', modalBg: 'bg-[#1a0505]', modalBorder: 'border-red-600' };
    if (activeTheme === 'theme_midnight') return { text: 'text-indigo-200', muted: 'text-indigo-400', bg: 'bg-indigo-950', border: 'border-indigo-800', accent: 'text-indigo-300', button: 'bg-indigo-700 text-white', modalBg: 'bg-[#0a0a2e]', modalBorder: 'border-indigo-600' };
    if (activeTheme === 'theme_desert') return { text: 'text-amber-200', muted: 'text-amber-500', bg: 'bg-amber-950', border: 'border-amber-700', accent: 'text-amber-400', button: 'bg-amber-700 text-white', modalBg: 'bg-[#1f1a0a]', modalBorder: 'border-amber-600' };
    if (activeTheme === 'theme_terminal') return { text: 'text-[#00ff00]', muted: 'text-[#004400]', bg: 'bg-black', border: 'border-[#00ff00]', accent: 'text-[#00ff00]', button: 'bg-[#003300] text-[#00ff00]', modalBg: 'bg-black', modalBorder: 'border-[#00ff00]' };
    if (activeTheme === 'theme_ocean') return { text: 'text-sky-300', muted: 'text-sky-600', bg: 'bg-sky-950', border: 'border-sky-800', accent: 'text-sky-400', button: 'bg-sky-700 text-white', modalBg: 'bg-[#051a2e]', modalBorder: 'border-sky-600' };

    switch(department) {
      case 'cyber': return { text: isBright ? 'text-green-950' : 'text-green-500', muted: mutedTextColor, bg: 'bg-green-600', border: 'border-green-900', accent: 'text-green-400', button: 'bg-green-700 text-white', modalBg, modalBorder };
      case 'theft': return { text: isBright ? 'text-amber-950' : 'text-amber-500', muted: mutedTextColor, bg: 'bg-amber-600', border: 'border-amber-900', accent: 'text-amber-400', button: 'bg-amber-700 text-white', modalBg, modalBorder };
      case 'homicide': return { text: isBright ? 'text-red-950' : 'text-red-600', muted: mutedTextColor, bg: 'bg-red-600', border: 'border-red-900', accent: 'text-red-500', button: 'bg-red-700 text-white', modalBg, modalBorder };
      default: return { text: baseTextColor, muted: mutedTextColor, bg: 'bg-blue-600', border: 'border-stone-700', accent: 'text-stone-500', button: 'bg-blue-700 text-white', modalBg, modalBorder };
    }
};

const Layout: React.FC<LayoutProps> = React.memo(({ 
  children, onReturnToDesk, showBackButton, department, currentSection, onNavigate, brightness, setBrightness, userProfile, notification, error, onErrorClear, onNotificationClear, isStoreOpen, onToggleStore, storeContent, language, onLanguageChange, musicVolume, setMusicVolume, sfxVolume, setSfxVolume, isMusicPlaying, setIsMusicPlaying, onPlayClick, currentMusicId, setCurrentMusicId, musicTracks, onExitDevMode, onShowHowToPlay
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isDarkMode = brightness <= 33;
  const isEn = language === 'en';
  const theme = useMemo(() => getThemeColors(userProfile.activeThemeId, department, isDarkMode, brightness), [userProfile.activeThemeId, department, isDarkMode, brightness]);

  const headerBg = brightness > 66 ? 'bg-white border-stone-200' : (brightness > 33 ? 'bg-[#57534e] border-[#44403c]' : 'bg-stone-950/95 border-stone-800');
  const baseBg = brightness > 66 ? 'bg-[#f5f5f4]' : (brightness > 33 ? 'bg-[#78716c]' : 'bg-[#0c0c0c]');

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-700 overflow-hidden ${baseBg}`}>
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-slide-up flex items-center gap-3">
          <AlertTriangle size={20} /> <span className="font-bold">{error}</span>
          <button onClick={onErrorClear} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-slide-up flex items-center gap-3">
          <CheckCircle size={20} /> <span className="font-bold">{notification}</span>
          <button onClick={onNotificationClear} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="fixed top-0 left-0 w-full z-[150] shadow-md flex flex-col">
        <header className={`${headerBg} p-2 flex items-center justify-between border-b`}>
            <div className="flex items-center gap-2 md:gap-3">
              {showBackButton && (
                <button onClick={() => { onPlayClick(); onReturnToDesk?.(); }} className={`p-2 rounded-full ${theme.text} hover:bg-black/10`}>
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex items-center gap-2">
                 <ShieldCheck className={`${theme.text}`} size={24} />
                 <h1 className={`text-lg md:text-xl font-typewriter font-bold tracking-wider hidden md:block ${theme.text}`}>
                    {isEn ? "DETECTIVE" : "DEDEKTİF"} <span className="opacity-50 uppercase">{isEn ? "DESK" : "MASASI"}</span>
                 </h1>
                 {/* HOW TO PLAY BUTTON ADDED NEXT TO TITLE */}
                 <button onClick={() => { onPlayClick(); onShowHowToPlay?.(); }} className={`p-1.5 rounded-lg hover:bg-black/10 ${theme.text} transition-colors`} title={isEn ? "How to Play" : "Nasıl Oynanır"}>
                    <HelpCircle size={20} />
                 </button>
              </div>
              {userProfile.isDeveloperMode && onExitDevMode && (
                <button onClick={onExitDevMode} className="ml-4 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-xl transition-transform hover:scale-105">
                  <Power size={14} /> {isEn ? "EXIT DEV" : "DEV ÇIKIŞ"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
               <div className="flex items-center gap-1"><Zap size={16} className={userProfile.energy < 2 ? 'text-red-500 animate-pulse' : 'text-blue-500'} /><span className={`text-sm font-bold font-mono ${theme.text}`}>{userProfile.energy}/{userProfile.maxEnergy}</span></div>
               <div className="flex items-center gap-1"><div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${theme.text}`}>₵</div><span className={`text-sm font-bold font-mono ${theme.text}`}>{userProfile.coins}</span></div>
               <div className="flex items-center gap-1">
                  <button onClick={() => { onPlayClick(); setIsSettingsOpen(true); }} className={`p-2 rounded-lg hover:bg-black/10 ${theme.text}`}><Settings size={20} /></button>
               </div>
            </div>
        </header>
        <nav className={`flex ${headerBg} shadow-sm border-t`}>
          <button onClick={() => { onNavigate('dashboard'); onPlayClick(); }} className={`flex-1 py-3 text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${currentSection === 'dashboard' ? 'text-amber-500 bg-stone-800/20 border-b-2 border-amber-500' : `${theme.text} opacity-60`}`}><LayoutGrid size={18} /> <span className="hidden md:inline">{isEn ? "DESK" : "MASA"}</span></button>
          <button onClick={() => { onToggleStore(); onPlayClick(); }} className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 ${isStoreOpen ? 'text-amber-500 bg-stone-800/20' : `${theme.text} opacity-60`}`}><ShoppingBag size={18} /> <span className="hidden md:inline">{isEn ? "STORE" : "MAĞAZA"}</span></button>
          <button onClick={() => { onNavigate('profile'); onPlayClick(); }} className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 ${currentSection === 'profile' ? 'text-amber-500 bg-stone-800/20 border-b-2 border-amber-500' : `${theme.text} opacity-60`}`}><User size={18} /> <span className="hidden md:inline">{isEn ? "PROFILE" : "PROFİL"}</span></button>
        </nav>
      </div>

      <main className="flex-grow flex flex-col relative z-0 overflow-y-auto pt-32 pb-10 px-2 md:px-4 custom-scrollbar">
        {children}
      </main>

      {/* STORE MODAL */}
      {isStoreOpen && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
           <div className={`w-full max-w-6xl h-[90vh] rounded-2xl border-2 shadow-2xl flex flex-col overflow-hidden animate-scale-in ${theme.modalBg} ${theme.modalBorder}`}>
              <div className="p-6 border-b flex justify-between items-center shrink-0">
                 <h2 className={`text-2xl font-bold font-typewriter flex items-center gap-3 ${theme.text}`}><ShoppingBag size={32} /> {isEn ? "SUPPLY DEPOT" : "LEVAZIM AMBARI"}</h2>
                 <button onClick={onToggleStore} className={`p-2 hover:bg-white/10 rounded-full transition-colors ${theme.text}`}><X size={32} /></button>
              </div>
              <div className="flex-1 overflow-hidden">
                 {storeContent}
              </div>
           </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className={`w-full max-w-lg rounded-2xl border-2 shadow-2xl animate-scale-in flex flex-col ${theme.modalBg} ${theme.modalBorder} ${theme.text}`}>
              <div className="flex justify-between items-center p-6 border-b shrink-0">
                 <h2 className="text-xl font-bold font-typewriter flex items-center gap-2"><Settings size={24} /> {isEn ? "SYSTEM CONFIG" : "SİSTEM AYARLARI"}</h2>
                 <button onClick={() => { onPlayClick(); setIsSettingsOpen(false); }} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                 <div>
                    <div className="flex justify-between mb-3 items-center"><span className="text-xs font-bold uppercase tracking-widest opacity-80">{isEn ? "BRIGHTNESS" : "PARLAKLIK"}</span><span className="text-xs font-mono font-bold">{brightness}%</span></div>
                    <div className="flex items-center gap-4"><Moon size={18} className="opacity-50" /><input type="range" min="0" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500" /><Sun size={18} className="opacity-50" /></div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center"><span className="text-xs font-bold opacity-60 flex items-center gap-2"><Music size={14}/> {isEn ? "MUSIC" : "MÜZİK"}</span><span className="text-[10px] font-mono">{Math.round(musicVolume * 100)}%</span></div>
                       <div className="flex items-center gap-2">
                          <button onClick={() => setIsMusicPlaying(!isMusicPlaying)} className={`p-2 rounded-lg ${isMusicPlaying ? 'bg-blue-600 text-white' : 'bg-stone-800 text-stone-500'}`}>
                             {isMusicPlaying ? <PauseCircle size={16}/> : <PlayCircle size={16}/>}
                          </button>
                          <input type="range" min="0" max="1" step="0.1" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="flex-1 h-1.5 bg-stone-700 rounded-lg" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center"><span className="text-xs font-bold opacity-60 flex items-center gap-2"><Volume2 size={14}/> {isEn ? "SFX" : "EFEKT"}</span><span className="text-[10px] font-mono">{Math.round(sfxVolume * 100)}%</span></div>
                       <div className="flex items-center gap-2">
                          <div className="p-2 bg-stone-800 rounded-lg text-stone-500"><Volume2 size={16}/></div>
                          <input type="range" min="0" max="1" step="0.1" value={sfxVolume} onChange={(e) => setSfxVolume(Number(e.target.value))} className="flex-1 h-1.5 bg-stone-700 rounded-lg" />
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-3">{isEn ? "STATION FREQUENCY" : "RADYO FREKANSI"}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {musicTracks?.map(track => (
                          <button 
                            key={track.id} 
                            onClick={() => { onPlayClick(); setCurrentMusicId?.(track.id); setIsMusicPlaying(true); }} 
                            className={`p-3 text-[10px] font-bold rounded-lg border transition-all flex items-center justify-between ${currentMusicId === track.id ? 'bg-amber-600/20 border-amber-500 text-amber-500 shadow-inner' : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'}`}
                          >
                             {track.name}
                             {currentMusicId === track.id && <ChevronRight size={12} className="animate-pulse" />}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">{isEn ? "LANGUAGE" : "DİL"}</span>
                    <div className="flex rounded-xl p-1 bg-black/30 border border-white/5">
                       <button onClick={() => { onPlayClick(); onLanguageChange('tr'); }} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${language === 'tr' ? 'bg-amber-600 text-white' : 'opacity-40 hover:opacity-70'}`}>TR</button>
                       <button onClick={() => { onPlayClick(); onLanguageChange('en'); }} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-amber-600 text-white' : 'opacity-40 hover:opacity-70'}`}>EN</button>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t shrink-0">
                 <button onClick={() => setIsSettingsOpen(false)} className={`w-full py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${theme.button}`}>
                    {isEn ? "CONFIRM" : "ONAYLA"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
});

export default Layout;
