import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Sun, Moon, User, ShoppingBag, LayoutGrid, Zap, AlertTriangle, CheckCircle, X, Settings, Volume2, VolumeX, Music, HelpCircle, Code, ChevronDown, ChevronUp, PlayCircle, PauseCircle, Bomb } from 'lucide-react';
import { Department, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onReturnToDesk?: () => void;
  showBackButton?: boolean;
  department?: Department;
  currentSection: string;
  onNavigate: (section: string) => void;
  
  // Brightness Control
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
  
  onShowGameInfo?: () => void;
  showGameInfo?: boolean;
  onCloseGameInfo?: () => void;

  language: 'tr' | 'en';
  onLanguageChange: (lang: 'tr' | 'en') => void;
  
  // Audio Props
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
}

// Exporting this helper to use in other components
export const getThemeColors = (activeTheme: string | undefined, department: string | undefined, isDarkMode: boolean, isGrayMode: boolean, isLightMode: boolean) => {
    // 1. Theme Overrides take precedence
    if (activeTheme === 'theme_matrix') return { text: 'text-green-500', bg: 'bg-green-600', border: 'border-green-900', accent: 'text-green-400', button: 'bg-green-700 text-green-100', modalBg: 'bg-black', modalBorder: 'border-green-500' };
    if (activeTheme === 'theme_cyber') return { text: 'text-pink-500', bg: 'bg-purple-600', border: 'border-pink-900', accent: 'text-cyan-400', button: 'bg-pink-600 text-white', modalBg: 'bg-[#0f0b1e]', modalBorder: 'border-pink-500' };
    if (activeTheme === 'theme_synth') return { text: 'text-yellow-400', bg: 'bg-fuchsia-700', border: 'border-yellow-500', accent: 'text-fuchsia-400', button: 'bg-yellow-600 text-black', modalBg: 'bg-[#240046]', modalBorder: 'border-yellow-400' };
    if (activeTheme === 'theme_noir') return { text: 'text-white', bg: 'bg-stone-800', border: 'border-stone-600', accent: 'text-white', button: 'bg-stone-700 text-stone-200', modalBg: 'bg-[#111]', modalBorder: 'border-stone-700' };
    if (activeTheme === 'theme_sepia') return { text: 'text-[#eecfa1]', bg: 'bg-[#3e2723]', border: 'border-[#5d4037]', accent: 'text-[#d7ccc8]', button: 'bg-[#5d4037] text-[#eecfa1]', modalBg: 'bg-[#2b1d16]', modalBorder: 'border-[#5d4037]' };
    if (activeTheme === 'theme_ocean') return { text: 'text-cyan-400', bg: 'bg-cyan-900', border: 'border-cyan-700', accent: 'text-blue-300', button: 'bg-cyan-700 text-white', modalBg: 'bg-[#0c1821]', modalBorder: 'border-cyan-600' };
    if (activeTheme === 'theme_vaporwave') return { text: 'text-[#ff71ce]', bg: 'bg-[#01cdfe]', border: 'border-[#fffb96]', accent: 'text-[#05ffa1]', button: 'bg-[#b967ff] text-white', modalBg: 'bg-[#181818]', modalBorder: 'border-[#ff71ce]' };
    if (activeTheme === 'theme_crimson') return { text: 'text-red-500', bg: 'bg-red-900', border: 'border-red-900', accent: 'text-red-400', button: 'bg-red-700 text-white', modalBg: 'bg-[#1a0505]', modalBorder: 'border-red-800' };
    if (activeTheme === 'theme_midnight') return { text: 'text-indigo-300', bg: 'bg-indigo-900', border: 'border-indigo-800', accent: 'text-indigo-200', button: 'bg-indigo-700 text-white', modalBg: 'bg-[#0b0c15]', modalBorder: 'border-indigo-800' };
    if (activeTheme === 'theme_solar') return { text: 'text-[#e8fccf]', bg: 'bg-[#78a153]', border: 'border-[#78a153]', accent: 'text-[#c0d470]', button: 'bg-[#5c7c32] text-white', modalBg: 'bg-[#131a10]', modalBorder: 'border-[#78a153]' };
    if (activeTheme === 'theme_blueprint') return { text: 'text-white', bg: 'bg-blue-600', border: 'border-white/40', accent: 'text-blue-200', button: 'bg-blue-700 text-white', modalBg: 'bg-[#003366]', modalBorder: 'border-white/50' };
    
    // New Themes
    if (activeTheme === 'theme_forest') return { text: 'text-emerald-300', bg: 'bg-emerald-800', border: 'border-emerald-900', accent: 'text-emerald-200', button: 'bg-emerald-700 text-white', modalBg: 'bg-[#052e16]', modalBorder: 'border-emerald-700' };
    if (activeTheme === 'theme_volcano') return { text: 'text-orange-300', bg: 'bg-orange-800', border: 'border-red-900', accent: 'text-yellow-400', button: 'bg-orange-700 text-white', modalBg: 'bg-[#431407]', modalBorder: 'border-orange-600' };
    if (activeTheme === 'theme_royal') return { text: 'text-yellow-200', bg: 'bg-indigo-950', border: 'border-yellow-600', accent: 'text-yellow-400', button: 'bg-indigo-800 text-yellow-100', modalBg: 'bg-[#170e2e]', modalBorder: 'border-yellow-600' };
    if (activeTheme === 'theme_ice') return { text: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-300', accent: 'text-cyan-500', button: 'bg-cyan-600 text-white', modalBg: 'bg-[#ecfeff]', modalBorder: 'border-cyan-300' };
    if (activeTheme === 'theme_terminal') return { text: 'text-green-500', bg: 'bg-black', border: 'border-green-700', accent: 'text-green-400', button: 'bg-green-800 text-green-100', modalBg: 'bg-black', modalBorder: 'border-green-700' };
    if (activeTheme === 'theme_candy') return { text: 'text-pink-500', bg: 'bg-pink-100', border: 'border-pink-300', accent: 'text-pink-400', button: 'bg-pink-400 text-white', modalBg: 'bg-[#fdf2f8]', modalBorder: 'border-pink-300' };
    if (activeTheme === 'theme_steampunk') return { text: 'text-amber-700', bg: 'bg-stone-800', border: 'border-amber-800', accent: 'text-amber-600', button: 'bg-amber-900 text-amber-100', modalBg: 'bg-[#292524]', modalBorder: 'border-[#78350f]' };
    if (activeTheme === 'theme_luxury') return { text: 'text-yellow-600', bg: 'bg-stone-900', border: 'border-yellow-600', accent: 'text-yellow-500', button: 'bg-yellow-700 text-white', modalBg: 'bg-[#0f0f0f]', modalBorder: 'border-yellow-600' };

    // Default Fallbacks
    const modalBg = isDarkMode ? 'bg-stone-900' : 'bg-white';
    const modalBorder = isDarkMode ? 'border-stone-700' : 'border-stone-200';

    switch(department) {
      case 'cyber': return { text: 'text-green-500', bg: 'bg-green-600', border: 'border-green-900', accent: 'text-green-400', button: 'bg-green-700 text-white', modalBg, modalBorder };
      case 'theft': return { text: 'text-amber-500', bg: 'bg-amber-600', border: 'border-amber-900', accent: 'text-amber-400', button: 'bg-amber-700 text-white', modalBg, modalBorder };
      case 'homicide': return { text: 'text-red-600', bg: 'bg-red-600', border: 'border-red-900', accent: 'text-red-500', button: 'bg-red-700 text-white', modalBg, modalBorder };
      default: 
        if (isGrayMode) return { text: 'text-stone-700', bg: 'bg-stone-500', border: 'border-stone-500', accent: 'text-stone-600', button: 'bg-stone-600 text-white', modalBg, modalBorder };
        if (isLightMode) return { text: 'text-stone-600', bg: 'bg-stone-400', border: 'border-stone-300', accent: 'text-stone-500', button: 'bg-blue-600 text-white', modalBg, modalBorder };
        return { text: 'text-stone-400', bg: 'bg-stone-600', border: 'border-stone-700', accent: 'text-stone-500', button: 'bg-blue-700 text-white', modalBg, modalBorder };
    }
  };

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onReturnToDesk, 
  showBackButton, 
  department,
  currentSection,
  onNavigate,
  brightness,
  setBrightness,
  userProfile,
  notification,
  error,
  onErrorClear,
  onNotificationClear,
  isStoreOpen,
  onToggleStore,
  storeContent,
  onShowGameInfo,
  showGameInfo,
  onCloseGameInfo,
  language,
  onLanguageChange,
  musicVolume,
  setMusicVolume,
  sfxVolume,
  setSfxVolume,
  isMusicPlaying,
  setIsMusicPlaying,
  onPlayClick,
  currentMusicId,
  setCurrentMusicId,
  musicTracks
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicListOpen, setIsMusicListOpen] = useState(false);
  
  const isDarkMode = brightness <= 33;
  const isGrayMode = brightness > 33 && brightness <= 66;
  const isLightMode = brightness > 66;

  const activeTheme = userProfile.activeThemeId;
  const isEn = language === 'en';

  const theme = getThemeColors(activeTheme, department, isDarkMode, isGrayMode, isLightMode);

  // Dynamic Base Styles
  let baseBg = 'bg-[#1a1a1a]';
  let headerBg = 'bg-stone-950/95 border-stone-800';
  let navBg = 'bg-stone-900 border-stone-800';
  let globalFilter = '';

  if (isGrayMode) {
     baseBg = 'bg-[#78716c] text-[#1c1917]';
     headerBg = 'bg-[#57534e] border-[#44403c] text-white';
     navBg = 'bg-[#57534e] border-[#44403c] text-white';
  } else if (isLightMode) {
     baseBg = 'bg-[#f5f5f4]';
     headerBg = 'bg-white border-stone-200';
     navBg = 'bg-white border-stone-200';
  }
  
  // Theme Overrides for Base Layout
  // ... (Same theme logic as before) ...
  if (activeTheme === 'theme_matrix') {
     baseBg = 'bg-black text-green-500 font-mono';
     headerBg = 'bg-black border-green-900';
     navBg = 'bg-black border-green-900';
  } else if (activeTheme === 'theme_noir') {
     globalFilter = 'grayscale(100%) contrast(120%)';
     baseBg = 'bg-[#111] text-stone-300';
     headerBg = 'bg-black border-stone-700';
     navBg = 'bg-[#0a0a0a] border-stone-700';
  } else if (activeTheme === 'theme_cyber') {
     baseBg = 'bg-[#0f0b1e] text-pink-500 font-sans';
     headerBg = 'bg-[#1a103c] border-pink-900/50';
     navBg = 'bg-[#151030] border-pink-900/50';
  } else if (activeTheme === 'theme_sepia') {
     baseBg = 'bg-[#2b1d16] text-[#eecfa1] font-serif';
     headerBg = 'bg-[#3e2723] border-[#5d4037] shadow-lg';
     navBg = 'bg-[#3e2723] border-[#5d4037]';
  } else if (activeTheme === 'theme_synth') {
     baseBg = 'bg-[#240046] text-[#ff9e00] font-sans';
     headerBg = 'bg-[#10002b] border-[#e0aaff] shadow-[0_0_15px_#e0aaff]';
     navBg = 'bg-[#10002b] border-[#e0aaff]';
  } else if (activeTheme === 'theme_ocean') {
     baseBg = 'bg-[#0c1821] text-[#b4d2e7]';
     headerBg = 'bg-[#000] border-[#324a5f]';
     navBg = 'bg-[#000] border-[#324a5f]';
  } else if (activeTheme === 'theme_vaporwave') {
     baseBg = 'bg-[#181818] text-[#ff71ce]';
     headerBg = 'bg-[#000] border-[#01cdfe]';
     navBg = 'bg-[#000] border-[#fffb96]';
  } else if (activeTheme === 'theme_crimson') {
     baseBg = 'bg-[#1a0505] text-[#ffadad]';
     headerBg = 'bg-[#000] border-[#8a1c1c]';
     navBg = 'bg-[#000] border-[#8a1c1c]';
  } else if (activeTheme === 'theme_midnight') {
     baseBg = 'bg-[#0b0c15] text-[#aeb3c9]';
     headerBg = 'bg-[#050508] border-[#2d3142]';
     navBg = 'bg-[#050508] border-[#2d3142]';
  } else if (activeTheme === 'theme_solar') {
     baseBg = 'bg-[#131a10] text-[#e8fccf]';
     headerBg = 'bg-[#070a05] border-[#78a153]';
     navBg = 'bg-[#070a05] border-[#78a153]';
  } else if (activeTheme === 'theme_blueprint') {
     baseBg = 'bg-[#003366] text-white font-mono bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]'; 
     headerBg = 'bg-[#002244] border-white/30';
     navBg = 'bg-[#002244] border-white/30';
  } else if (activeTheme === 'theme_forest') {
     baseBg = 'bg-[#052e16] text-emerald-100';
     headerBg = 'bg-[#022c22] border-emerald-900';
     navBg = 'bg-[#022c22] border-emerald-900';
  } else if (activeTheme === 'theme_volcano') {
     baseBg = 'bg-[#431407] text-orange-100';
     headerBg = 'bg-[#2a0a04] border-orange-900';
     navBg = 'bg-[#2a0a04] border-orange-900';
  } else if (activeTheme === 'theme_royal') {
     baseBg = 'bg-[#170e2e] text-yellow-100';
     headerBg = 'bg-[#1e1b4b] border-yellow-700';
     navBg = 'bg-[#1e1b4b] border-yellow-700';
  } else if (activeTheme === 'theme_ice') {
     baseBg = 'bg-[#ecfeff] text-cyan-900';
     headerBg = 'bg-white border-cyan-200';
     navBg = 'bg-white border-cyan-200';
  } else if (activeTheme === 'theme_terminal') {
     baseBg = 'bg-black text-green-500 font-mono';
     headerBg = 'bg-black border-green-800 border-b-2';
     navBg = 'bg-black border-green-800 border-b';
  } else if (activeTheme === 'theme_candy') {
     baseBg = 'bg-[#fdf2f8] text-pink-700';
     headerBg = 'bg-white border-pink-200';
     navBg = 'bg-white border-pink-200';
  } else if (activeTheme === 'theme_steampunk') {
     baseBg = 'bg-[#292524] text-[#d6d3d1]';
     headerBg = 'bg-[#1c1917] border-[#78350f] border-b-2';
     navBg = 'bg-[#1c1917] border-[#78350f]';
  } else if (activeTheme === 'theme_luxury') {
     baseBg = 'bg-[#0f0f0f] text-yellow-500';
     headerBg = 'bg-black border-yellow-700';
     navBg = 'bg-black border-yellow-700';
  }

  const getTitle = () => {
    switch(department) {
      case 'cyber': return isEn ? <>CYBER<span className="text-green-500">CRIMES</span></> : <>SİBER<span className="text-green-500">SUÇLAR</span></>;
      case 'theft': return isEn ? <>THEFT<span className="text-amber-500">UNIT</span></> : <>HIRSIZLIK<span className="text-amber-500">MASASI</span></>;
      case 'homicide': return isEn ? <>HOMICIDE<span className="text-red-600">UNIT</span></> : <>CİNAYET<span className="text-red-600">MASASI</span></>;
      default: return isEn ? <>DETECTIVE<span className={isDarkMode ? "text-stone-400" : (isGrayMode ? "text-stone-300" : "text-stone-600")}>AGENCY</span></> : <>DEDEKTİF<span className={activeTheme === 'theme_sepia' ? 'text-[#a1887f]' : (isDarkMode ? "text-stone-400" : (isGrayMode ? "text-stone-300" : "text-stone-600"))}>MASASI</span></>;
    }
  };

  const navButtonClass = (section: string) => `
    flex flex-row items-center justify-center gap-2 flex-1 py-3 text-sm font-bold transition-colors uppercase
    ${currentSection === section 
      ? (activeTheme === 'theme_matrix' ? 'text-green-500 bg-green-900/10 border-b-2 border-green-500' : 
         activeTheme === 'theme_cyber' ? 'text-cyan-400 bg-cyan-900/10 border-b-2 border-cyan-400' :
         activeTheme === 'theme_synth' ? 'text-yellow-400 bg-fuchsia-900/50 border-b-2 border-yellow-400' :
         activeTheme === 'theme_sepia' ? 'text-[#ffcc80] bg-[#4e342e] border-b-2 border-[#8d6e63]' :
         activeTheme === 'theme_ocean' ? 'text-cyan-400 bg-cyan-900/30 border-b-2 border-cyan-500' :
         activeTheme === 'theme_vaporwave' ? 'text-[#ff71ce] bg-[#01cdfe]/20 border-b-2 border-[#ff71ce]' :
         activeTheme === 'theme_crimson' ? 'text-red-500 bg-red-900/30 border-b-2 border-red-500' :
         activeTheme === 'theme_blueprint' ? 'text-white bg-blue-900/50 border-b-2 border-white' :
         activeTheme === 'theme_forest' ? 'text-emerald-300 bg-emerald-900/50 border-b-2 border-emerald-400' :
         activeTheme === 'theme_volcano' ? 'text-orange-300 bg-orange-900/50 border-b-2 border-orange-500' :
         activeTheme === 'theme_royal' ? 'text-yellow-300 bg-indigo-900/50 border-b-2 border-yellow-500' :
         activeTheme === 'theme_ice' ? 'text-cyan-700 bg-cyan-100 border-b-2 border-cyan-500' :
         activeTheme === 'theme_terminal' ? 'text-green-500 bg-green-900/20 border-b-2 border-green-500' :
         activeTheme === 'theme_candy' ? 'text-pink-600 bg-pink-100 border-b-2 border-pink-400' :
         activeTheme === 'theme_steampunk' ? 'text-amber-500 bg-stone-800 border-b-2 border-amber-600' :
         activeTheme === 'theme_luxury' ? 'text-yellow-400 bg-stone-900 border-b-2 border-yellow-600' :
         (isDarkMode ? 'text-amber-500 bg-stone-800 border-b-2 border-amber-500' : (isGrayMode ? 'text-white bg-stone-600 border-b-2 border-stone-800' : 'text-blue-600 bg-stone-100 border-b-2 border-blue-600'))) 
      : 'opacity-60 hover:opacity-100 hover:bg-black/5'
    }
  `;

  const isDefaultTheme = !activeTheme || activeTheme === 'default';
  const infoButtonClass = isDefaultTheme 
     ? `ml-1 p-1 rounded-full transition-transform hover:scale-110 bg-stone-300 text-stone-600 hover:bg-stone-400`
     : `ml-1 p-1 rounded-full transition-transform hover:scale-110 ${theme.button}`;

  const handleOpenBombGame = () => {
     window.open('https://bomba-imha.vercel.app/', '_blank');
  };

  // Translation Helper
  const t = (key: string) => {
    const dict: any = {
      'settings': { tr: 'AYARLAR', en: 'SETTINGS' },
      'language': { tr: 'DİL SEÇENEĞİ', en: 'LANGUAGE' },
      'brightness': { tr: 'PARLAKLIK', en: 'BRIGHTNESS' },
      'music': { tr: 'MÜZİK', en: 'MUSIC' },
      'sfx': { tr: 'EFEKT', en: 'SFX' },
      'desk': { tr: 'MASA', en: 'DESK' },
      'profile': { tr: 'PROFİL', en: 'PROFILE' },
      'store': { tr: 'MAĞAZA', en: 'STORE' },
      'energy': { tr: 'ENERJİ', en: 'ENERGY' },
      'balance': { tr: 'BAKİYE', en: 'BALANCE' }
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-stone-700 selection:text-white transition-colors duration-700 overflow-hidden ${baseBg}`} style={{ filter: globalFilter }}>
      
      {/* ERROR TOAST */}
      {error && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded shadow-xl animate-fade-in flex items-center gap-3">
          <AlertTriangle className="animate-pulse" size={20} />
          {error}
          <button onClick={onErrorClear} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {notification && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded shadow-xl animate-fade-in flex items-center gap-3">
          <CheckCircle size={20} />
          {notification}
          <button onClick={onNotificationClear} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}
      
      {/* FIXED TOP CONTAINER (Header + Nav) */}
      <div className={`fixed top-0 left-0 w-full z-[60] shadow-md transition-colors duration-500 flex flex-col`}>
        {/* HEADER BAR */}
        <header className={`${headerBg} p-2 flex items-center justify-between gap-y-2`}>
            <div className="flex items-center gap-2 md:gap-3">
              {showBackButton && onReturnToDesk && (
                <button 
                  onClick={() => { onPlayClick(); onReturnToDesk(); }}
                  className={`p-2 rounded-full transition-colors border border-transparent group ${isDarkMode ? 'hover:bg-stone-800 hover:border-stone-700' : 'hover:bg-stone-200 hover:border-stone-300'}`}
                  title={isEn ? "Back" : "Geri"}
                >
                  <ArrowLeft size={20} className={theme.text} />
                </button>
              )}
              <div className="flex items-center">
                 <ShieldCheck className={`mr-2 ${theme.text}`} size={24} />
                 <h1 className={`text-lg md:text-xl font-typewriter font-bold tracking-wider hidden md:block ${theme.text}`}>
                    {getTitle()}
                 </h1>
                 {onShowGameInfo && (
                   <button onClick={() => { onPlayClick(); onShowGameInfo && onShowGameInfo(); }} className={infoButtonClass} title="Info">
                      <HelpCircle size={14} />
                   </button>
                 )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
               {userProfile.isDeveloperMode && (
                 <div className="text-red-500 font-mono text-[10px] animate-pulse font-bold border border-red-500 px-1 rounded flex items-center gap-1">
                    <Code size={10} /> DEV
                 </div>
               )}

               {/* ENERGY */}
               <div className="flex items-center gap-1" title={t('energy')}>
                  <Zap size={16} className={userProfile.energy < 2 && !userProfile.isDeveloperMode ? 'text-red-500 animate-pulse' : 'text-blue-500'} fill={userProfile.energy < 2 && !userProfile.isDeveloperMode ? 'currentColor' : 'none'} />
                  <span className={`text-sm font-bold font-mono ${theme.text}`}>
                    {userProfile.isDeveloperMode ? '∞' : `${userProfile.energy}/${userProfile.maxEnergy}`}
                  </span>
               </div>
               
               {/* COINS */}
               <div className="flex items-center gap-1" title={t('balance')}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'border-amber-500 text-amber-500' : 'border-amber-600 text-amber-600'}`}>₵</div>
                  <span className={`text-sm font-bold font-mono ${theme.text}`}>{userProfile.coins}</span>
               </div>

               {/* External Game Link */}
               <button
                  onClick={() => { onPlayClick(); handleOpenBombGame(); }}
                  className={`p-2 rounded hover:bg-black/10 transition-colors ${theme.text} hover:text-red-500`}
                  title={isEn ? "Bomb Disposal Protocol" : "Bomba İmha Protokolü"}
               >
                  <Bomb size={20} />
               </button>

               {/* SETTINGS */}
               <button onClick={() => { onPlayClick(); setIsSettingsOpen(true); }} className={`p-2 rounded hover:bg-black/10 transition-colors ${theme.text}`}>
                  <Settings size={20} />
               </button>
            </div>
        </header>
        
        {/* TOP NAVIGATION BAR */}
        <nav className={`flex ${navBg} shadow-sm z-50`}>
          <button 
            onClick={() => { onNavigate('dashboard'); onPlayClick(); }}
            className={navButtonClass('dashboard')}
          >
            <LayoutGrid size={18} />
            <span className="hidden md:inline">{t('desk')}</span>
          </button>
          
          <button 
            onClick={() => { onToggleStore(); onPlayClick(); }}
            className={`flex flex-row items-center justify-center gap-2 flex-1 py-3 text-sm font-bold transition-colors uppercase ${isStoreOpen ? (isDarkMode ? 'text-green-500 bg-stone-800' : 'text-green-600 bg-stone-100') : 'opacity-70 hover:opacity-100'}`}
          >
            <ShoppingBag size={18} />
            <span className="hidden md:inline">{t('store')}</span>
          </button>
          
          <button 
            onClick={() => { onNavigate('profile'); onPlayClick(); }}
            className={navButtonClass('profile')}
          >
            <User size={18} />
            <span className="hidden md:inline">{t('profile')}</span>
          </button>
        </nav>
      </div>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           {/* APPLIED THEME TO MODAL */}
           <div className={`w-full max-w-md rounded-xl border-2 shadow-2xl animate-fade-in flex flex-col max-h-[85vh] ${theme.modalBg} ${theme.modalBorder} ${theme.text}`}>
              <div className="flex justify-between items-center p-6 pb-2 shrink-0">
                 <h2 className={`text-xl font-bold font-typewriter flex items-center gap-2 ${theme.text}`}>
                    <Settings size={24} /> {t('settings')}
                 </h2>
                 <button onClick={() => { onPlayClick(); setIsSettingsOpen(false); }} className="p-1 hover:bg-white/10 rounded"><X className={theme.text} /></button>
              </div>
              
              <div className="space-y-6 p-6 pt-2 overflow-y-auto custom-scrollbar flex-1">
                 {/* Brightness Slider */}
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className={`text-sm font-bold opacity-80`}>{t('brightness')}</span>
                       <span className="text-xs font-mono opacity-60">{brightness}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Moon size={16} className="opacity-60" />
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={brightness} 
                         onChange={(e) => setBrightness(Number(e.target.value))}
                         className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                       />
                       <Sun size={16} className="opacity-60" />
                    </div>
                 </div>

                 {/* MUSIC SECTION */}
                 <div>
                    <div className="flex justify-between mb-2 items-center">
                       <span className={`text-sm font-bold opacity-80 flex items-center gap-2`}><Music size={14}/> {t('music')}</span>
                       <span className="text-xs font-mono opacity-60">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                       <button onClick={() => { setIsMusicPlaying(!isMusicPlaying); onPlayClick(); }} className={isMusicPlaying ? 'text-green-500' : 'opacity-60'}>
                          {isMusicPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                       </button>
                       <input 
                         type="range" 
                         min="0" 
                         max="1" 
                         step="0.05"
                         value={musicVolume} 
                         onChange={(e) => setMusicVolume(Number(e.target.value))}
                         className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                       />
                    </div>

                    {/* Accordion for Music Selection */}
                    <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${isMusicListOpen ? 'max-h-60' : 'max-h-10'} ${isDarkMode ? 'border-stone-700 bg-black/20' : 'border-stone-300 bg-stone-100'}`}>
                       <button 
                          onClick={() => { setIsMusicListOpen(!isMusicListOpen); onPlayClick(); }}
                          className="w-full flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/10"
                       >
                          <span className="flex items-center gap-2">
                             {isMusicPlaying ? <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-stone-500" />}
                             {musicTracks?.find(t => t.id === currentMusicId)?.name || 'Select Track'}
                          </span>
                          {isMusicListOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                       </button>
                       
                       <div className="flex flex-col border-t border-white/10">
                          {musicTracks?.map(track => (
                             <button
                                key={track.id}
                                onClick={() => { 
                                   setCurrentMusicId && setCurrentMusicId(track.id); 
                                   setIsMusicPlaying(true);
                                   onPlayClick();
                                }}
                                className={`text-left px-4 py-2 text-xs font-mono hover:bg-white/5 flex items-center justify-between ${currentMusicId === track.id ? (isDarkMode ? 'bg-stone-800 text-amber-500' : 'bg-stone-200 text-blue-600') : 'opacity-70'}`}
                             >
                                {track.name}
                                {currentMusicId === track.id && <Music size={10} />}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* SFX Section */}
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className={`text-sm font-bold opacity-80`}>{t('sfx')}</span>
                       <span className="text-xs font-mono opacity-60">{Math.round(sfxVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={onPlayClick} title="Test Sound" className="text-amber-500 hover:text-amber-400">
                          {sfxVolume > 0 ? <Volume2 size={20}/> : <VolumeX size={20} className="text-red-500"/>}
                       </button>
                       <input 
                         type="range" 
                         min="0" 
                         max="1" 
                         step="0.05"
                         value={sfxVolume} 
                         onChange={(e) => { setSfxVolume(Number(e.target.value)); onPlayClick(); }}
                         className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                       />
                    </div>
                 </div>

                 {/* Language Toggle */}
                 <div className={`flex items-center justify-between border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'} pt-4`}>
                    <span className={`text-sm font-bold opacity-80`}>{t('language')}</span>
                    <div className={`flex rounded p-1 ${isDarkMode ? 'bg-black/30' : 'bg-black/10'}`}>
                       <button onClick={() => onLanguageChange('tr')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${language === 'tr' ? 'bg-amber-600 text-white' : 'opacity-60 hover:opacity-100'}`}>TR</button>
                       <button onClick={() => onLanguageChange('en')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${language === 'en' ? 'bg-amber-600 text-white' : 'opacity-60 hover:opacity-100'}`}>EN</button>
                    </div>
                 </div>

                 <div className={`border-t pt-4 mt-4 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                    <h3 className="text-xs font-bold opacity-50 uppercase mb-2">{isEn ? "Legal & Support" : "Yasal & Destek"}</h3>
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs opacity-60 cursor-pointer hover:text-amber-500">
                          <span>{isEn ? "Privacy Policy" : "Gizlilik Politikası"}</span>
                          <ExternalLinkIcon />
                       </div>
                       <div className="flex justify-between text-xs opacity-60 cursor-pointer hover:text-amber-500">
                          <span>{isEn ? "Terms of Service" : "Kullanım Koşulları"}</span>
                          <ExternalLinkIcon />
                       </div>
                       <div className="flex justify-between text-xs opacity-40 mt-2">
                          <span>Version</span>
                          <span>9.12.2025 (Build 403)</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* STORE MODAL (CENTERED) */}
      {isStoreOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           {/* APPLIED THEME TO STORE MODAL */}
           <div className={`w-full max-w-5xl h-[85vh] rounded-xl border-2 shadow-2xl flex flex-col overflow-hidden animate-fade-in ${theme.modalBg} ${theme.modalBorder}`}>
              <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                 <h2 className={`text-xl font-bold font-typewriter flex items-center gap-2 ${theme.text}`}><ShoppingBag size={24}/> {t('store')}</h2>
                 <button onClick={() => { onPlayClick(); onToggleStore(); }} className={`hover:text-red-500 transition-colors ${theme.text}`}><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-hidden">
                 {storeContent}
              </div>
           </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {/* Added pt-32 to account for fixed header+nav, pb-4 for bottom spacing */}
      <main className={`flex-grow flex flex-col relative z-0 overflow-y-auto overflow-x-hidden pt-32 pb-4 px-2 md:px-4`}>
        {children}
      </main>
      
      {/* DETECTIVE HANDBOOK MODAL - Centered, dynamic height */}
       {showGameInfo && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 md:pt-24">
           <div className={`w-full max-w-3xl max-h-[80vh] rounded-lg border flex flex-col shadow-2xl overflow-hidden animate-fade-in ${theme.modalBg} ${theme.modalBorder}`}>
              <div className={`p-4 border-b shrink-0 flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                 <h2 className={`text-xl font-bold font-typewriter flex items-center gap-2 ${theme.text}`}><HelpCircle size={20}/> {isEn ? "DETECTIVE HANDBOOK & RULES" : "DEDEKTİF EL KİTABI & KURALLAR"}</h2>
                 <button onClick={() => { onPlayClick(); onCloseGameInfo && onCloseGameInfo(); }} className={`hover:text-red-500 transition-colors ${theme.text}`}><X size={24}/></button>
              </div>
              <div className={`flex-1 overflow-y-auto p-6 space-y-8 ${theme.text} custom-scrollbar`}>
                 
                 <section>
                    <h3 className="font-bold uppercase border-b pb-2 mb-3 flex items-center gap-2 text-amber-500 tracking-wider">
                       <Zap size={18}/> {isEn ? "Game Basics" : "Temel Mekanikler"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
                       <div className="bg-black/20 p-3 rounded border border-white/10">
                          <strong className="block mb-1 text-blue-400">{isEn ? "ENERGY" : "ENERJİ"}</strong>
                          {isEn ? "Each new case costs 1 Energy. Energy refills with coffee/donuts or waits." : "Her yeni vaka açmak 1 Enerjiye mal olur. Enerji zamanla dolmaz, kahve/donut satın alarak yenilenir."}
                       </div>
                       <div className="bg-black/20 p-3 rounded border border-white/10">
                          <strong className="block mb-1 text-yellow-400">{isEn ? "COINS" : "JETON (PARA)"}</strong>
                          {isEn ? "Earn coins by solving cases. Harder cases give more rewards." : "Vakaları çözerek para kazanın. Zor vakalar ve Kırmızı Bülten daha çok kazandırır."}
                       </div>
                    </div>
                 </section>

                 <section>
                    <h3 className="font-bold uppercase border-b pb-2 mb-3 flex items-center gap-2 text-green-500 tracking-wider">
                       <ShieldCheck size={18}/> {isEn ? "How to Solve a Case" : "Vaka Nasıl Çözülür?"}
                    </h3>
                    <ul className="space-y-3 text-sm opacity-80 list-disc list-inside">
                       <li>
                          <strong className="text-stone-300">{isEn ? "Step 1: Read the File" : "Adım 1: Dosyayı Oku"}</strong> - 
                          {isEn ? " Check the intro, victim details and crime scene report." : " Giriş hikayesini, kurban detaylarını ve olay yeri raporunu dikkatlice incele."}
                       </li>
                       <li>
                          <strong className="text-stone-300">{isEn ? "Step 2: Examine Evidence" : "Adım 2: Kanıtları İncele"}</strong> - 
                          {isEn ? " Look at the 'Evidence' tab. Some items belong to specific suspects." : " 'Deliller' sekmesine bak. Bazı eşyalar (anahtarlık, kartvizit vb.) doğrudan bir şüpheliyi işaret eder."}
                       </li>
                       <li>
                          <strong className="text-stone-300">{isEn ? "Step 3: Analyze Map" : "Adım 3: Harita Analizi"}</strong> - 
                          {isEn ? " Check the map for hidden clues. Click on points marked with yellow or red." : " Haritada gizli ipuçları olabilir. Sarı veya kırmızı noktaları mutlaka kontrol et."}
                       </li>
                       <li>
                          <strong className="text-stone-300">{isEn ? "Step 4: Interrogate" : "Adım 4: Sorgulama"}</strong> - 
                          {isEn ? " Ask specific questions like 'Motive', 'Alibi', 'Weapon'. You have limited questions!" : " 'Motif', 'Alibi', 'Silah' gibi anahtar kelimelerle sorgu yap. Soru hakkın sınırlıdır!"}
                       </li>
                       <li>
                          <strong className="text-stone-300">{isEn ? "Step 5: Accuse" : "Adım 5: Suçlama"}</strong> - 
                          {isEn ? " Go to Suspects tab and arrest the killer. Be careful, wrong arrest fails the case." : " Şüpheliler sekmesine git ve katili tutukla. Dikkatli ol, yanlış tutuklama vakayı başarısız kılar."}
                       </li>
                    </ul>
                 </section>

                 <section>
                    <h3 className="font-bold uppercase border-b pb-2 mb-3 flex items-center gap-2 text-red-500 tracking-wider">
                       <AlertTriangle size={18}/> {isEn ? "Department Specifics" : "Departman Özellikleri"}
                    </h3>
                    <div className="space-y-4 text-sm">
                       <div>
                          <strong className="text-red-400 block mb-1">{isEn ? "HOMICIDE" : "CİNAYET MASASI"}</strong>
                          <p className="opacity-70">{isEn ? "Focus on Autopsy Reports. Cause of death and time of death are crucial to break alibis." : "Otopsi raporlarına odaklanın. Ölüm saati ve sebebi, şüphelilerin yalanlarını (alibi) çürütmek için kritiktir."}</p>
                       </div>
                       <div>
                          <strong className="text-green-400 block mb-1">{isEn ? "CYBER CRIMES" : "SİBER SUÇLAR"}</strong>
                          <p className="opacity-70">{isEn ? "Check Server Logs. Look for IP addresses and timestamps matching suspect activity." : "Sunucu Loglarını kontrol edin. IP adresleri ve giriş saatleri ile şüphelilerin aktivitelerini eşleştirin."}</p>
                       </div>
                       <div>
                          <strong className="text-amber-400 block mb-1">{isEn ? "THEFT" : "HIRSIZLIK MASASI"}</strong>
                          <p className="opacity-70">{isEn ? "Review CCTV Footage logs. Look for gaps in time or specific clothing details." : "Güvenlik Kamerası (CCTV) kayıtlarını inceleyin. Zaman boşluklarına veya kıyafet detaylarına dikkat edin."}</p>
                       </div>
                    </div>
                 </section>

              </div>
           </div>
        </div>
       )}
    </div>
  );
};

// Simple Icon helper
const ExternalLinkIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

export default Layout;