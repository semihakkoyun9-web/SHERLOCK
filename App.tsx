
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Layout, { getThemeColors } from './components/Layout';
import GameScreen from './components/GameScreen';
import ProfileSection from './components/ProfileSection';
import StoreSection from './components/StoreSection';
import CaseSelection from './components/CaseSelection';
import { generateOfflineScenario } from './services/offlineCaseService';
import { CaseFile, Department, UserProfile, StoreItem } from './types';
import { Loader, Fingerprint, ShieldAlert, Briefcase, Info, Bell, Activity, Globe, Database, Radio, HelpCircle, X, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';

const MUSIC_TRACKS = [
  { id: 'noir', name: 'Noir Jazz (Default)', url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b35520556.mp3?filename=detective-background-music-22194.mp3" },
  { id: 'suspense', name: 'Crime Scene Tension', url: "https://cdn.pixabay.com/download/audio/2021/11/01/audio_00fa5593f3.mp3?filename=suspense-11604.mp3" },
  { id: 'cyber', name: 'Cyber Pulse', url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cyberpunk-city-11020.mp3" },
  { id: 'rain', name: 'Heavy Rain Ambience', url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_8ed590b106.mp3?filename=rain-and-thunder-16705.mp3" }
];

const AUDIO_CLICK = "https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3?filename=mouse-click-153941.mp3"; 

export default function App() {
  const [brightness, setBrightness] = useState(0); 
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusicId, setCurrentMusicId] = useState('noir');
  
  const [preDevStats, setPreDevStats] = useState<{ coins: number; energy: number } | null>(null);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxClickRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    sfxClickRef.current = new Audio(AUDIO_CLICK);
    const track = MUSIC_TRACKS.find(t => t.id === currentMusicId) || MUSIC_TRACKS[0];
    bgMusicRef.current = new Audio(track.url);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = musicVolume;
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
       const track = MUSIC_TRACKS.find(t => t.id === currentMusicId) || MUSIC_TRACKS[0];
       if (bgMusicRef.current.src !== track.url) {
          bgMusicRef.current.src = track.url;
          bgMusicRef.current.load();
          bgMusicRef.current.volume = musicVolume;
          if (isMusicPlaying) {
             bgMusicRef.current.play().catch(() => setIsMusicPlaying(false));
          }
       }
    }
  }, [currentMusicId]);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
      if (isMusicPlaying) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicVolume, isMusicPlaying]);

  const playClickSound = useCallback(() => {
    if (sfxClickRef.current && sfxVolume > 0) {
      const sound = sfxClickRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = sfxVolume;
      sound.play().catch(() => {});
    }
  }, [sfxVolume]);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [activeCase, setActiveCase] = useState<CaseFile | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    userId: '#TR-8821',
    name: 'Dedektif',
    title: 'Çaylak',
    level: 1,
    xp: 0,
    score: 0,
    coins: 100,
    energy: 12, 
    maxEnergy: 12, 
    isDeveloperMode: false,
    casesSolved: 0,
    correctAccusations: 0,
    selectedDetectiveId: 'det_1',
    activeThemeId: 'default',
    avatar: '🕵️',
    detectives: [
      { id: 'det_1', name: 'Rıza Soylu', title: 'Cinayet Büro Amiri', description: 'Eski toprak. Sezgileri kuvvetli.', avatar: '🕵️‍♂️', specialAbility: '+2 Soru Hakkı', bonus: { maxQuestions: 2 }, price: 0, isOwned: true },
      { id: 'det_2', name: 'Canan Keskin', title: 'Profil Uzmanı', description: 'Davranış analizi konusunda dahi.', avatar: '👩‍💼', specialAbility: '%20 Daha Fazla XP', bonus: { xpMultiplier: 1.2 }, price: 1000, isOwned: false },
      { id: 'det_3', name: 'Barış Tekin', title: 'Siber Güvenlik', description: 'Dijital izleri takip eder.', avatar: '👨‍💻', specialAbility: 'Siber Suçlarda Avantaj', bonus: {}, price: 2000, isOwned: false },
      { id: 'det_4', name: 'Murat Yılmaz', title: 'Emekli Komiser', description: 'Sokakları avucunun içi gibi bilir.', avatar: '🚬', specialAbility: 'Daha az enerji harcar (-1)', bonus: {}, price: 1500, isOwned: false },
    ],
    inventory: []
  });

  const isEn = language === 'en';
  const isDarkMode = brightness <= 33; 

  const theme = useMemo(() => getThemeColors(userProfile.activeThemeId, undefined, isDarkMode, brightness), [userProfile.activeThemeId, isDarkMode, brightness]);

  const handleToggleDevMode = useCallback((enabled: boolean) => {
    playClickSound();
    if (enabled) {
      setPreDevStats({ coins: userProfile.coins, energy: userProfile.energy });
      setUserProfile(prev => ({
        ...prev,
        isDeveloperMode: true,
        coins: 99999,
        energy: 999,
        maxEnergy: 999
      }));
      setNotification(isEn ? "DEVELOPER OVERRIDE: ACTIVE" : "GELİŞTİRİCİ YETKİSİ: AKTİF");
    } else {
      if (preDevStats) {
        setUserProfile(prev => ({
          ...prev,
          isDeveloperMode: false,
          coins: preDevStats.coins,
          energy: preDevStats.energy,
          maxEnergy: 12
        }));
        setPreDevStats(null);
      }
    }
  }, [userProfile.coins, userProfile.energy, preDevStats, isEn, playClickSound]);

  const handleNavigate = useCallback((section: string) => {
    playClickSound();
    setActiveSection(section);
    if (section === 'dashboard') {
      setSelectedDepartment(null);
      setActiveCase(null);
    }
  }, [playClickSound]);

  const handleSelectDepartment = useCallback((dept: Department) => {
    playClickSound();
    setSelectedDepartment(dept);
    setActiveSection('case_selection');
  }, [playClickSound]);

  const handleCreateNewCase = useCallback(async () => {
    playClickSound();
    if (!selectedDepartment) return;
    if (userProfile.energy < 1 && !userProfile.isDeveloperMode) { 
      setError(isEn ? "Not enough energy! Drink coffee." : "Yetersiz Enerji! Kahve içmelisin.");
      setIsStoreOpen(true);
      return;
    }
    const deptCases = cases.filter(c => c.department === selectedDepartment);
    if (deptCases.length >= 4) {
      setError(isEn ? "Cabinet full. Archive old cases." : "Dolap dolu. Eski vakaları silin.");
      return;
    }
    setIsLoading(true);
    if (!userProfile.isDeveloperMode) {
      setUserProfile(prev => ({ ...prev, energy: prev.energy - 1 }));
    }
    try {
      const scenario = generateOfflineScenario(selectedDepartment, language); 
      const newCase: CaseFile = {
        id: `case_${Date.now()}`,
        department: selectedDepartment,
        title: scenario.intro.substring(0, 45) + "...",
        scenario: scenario,
        status: 'active',
        createdAt: new Date().toLocaleDateString(),
        messages: [],
        questionsUsed: 0,
        isAiGenerated: false, 
        difficulty: 'medium',
        isRedNotice: Math.random() > 0.8
      };
      setCases(prev => [newCase, ...prev]);
      setNotification(isEn ? "New Case Logged" : "Yeni Vaka Kaydedildi");
    } catch (err) {
      setError(isEn ? "Generation failed." : "Vaka oluşturulamadı.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepartment, userProfile.energy, userProfile.isDeveloperMode, cases, isEn, language, playClickSound]);

  const handleCaseUpdate = useCallback((updatedCase: CaseFile) => {
    if (activeCase?.status === 'active' && updatedCase.status !== 'active') {
       if (updatedCase.status === 'solved_win') {
          const coinGain = 5; 
          const xpGain = 200;
          setUserProfile(prev => ({
             ...prev,
             xp: prev.xp + xpGain,
             coins: prev.coins + coinGain,
             score: prev.score + (xpGain * 2),
             casesSolved: prev.casesSolved + 1,
             correctAccusations: prev.correctAccusations + 1
          }));
          setNotification(isEn ? `CASE SOLVED! +${coinGain} Coins` : `VAKA ÇÖZÜLDÜ! +${coinGain} Jeton`);
          playClickSound(); 
       } else {
          setError(isEn ? "Wrong suspect! Killer escaped." : "Yanlış zanlı! Katil kaçtı.");
       }
    }
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    setActiveCase(updatedCase);
  }, [activeCase, isEn, playClickSound]);

  return (
    <Layout 
      onReturnToDesk={() => handleNavigate('dashboard')}
      showBackButton={activeSection !== 'dashboard'}
      department={activeSection === 'game' || activeSection === 'case_selection' ? (selectedDepartment || activeCase?.department) : undefined}
      currentSection={activeSection}
      onNavigate={handleNavigate}
      brightness={brightness}
      setBrightness={setBrightness}
      userProfile={userProfile}
      notification={notification}
      error={error}
      onErrorClear={() => setError(undefined)}
      onNotificationClear={() => setNotification(undefined)}
      isStoreOpen={isStoreOpen}
      onToggleStore={() => setIsStoreOpen(!isStoreOpen)}
      storeContent={<StoreSection isDarkMode={isDarkMode} userProfile={userProfile} onBuyItem={(item) => {
           playClickSound();
           if (userProfile.coins >= item.price) {
              setUserProfile(prev => ({
                ...prev,
                coins: prev.coins - item.price,
                energy: item.energyValue ? Math.min(prev.maxEnergy, prev.energy + item.energyValue) : prev.energy,
                inventory: item.type === 'theme' || item.type === 'upgrade' ? [...prev.inventory, { ...item, purchased: true }] : prev.inventory
              }));
              setNotification(isEn ? `Bought: ${item.name}` : `${item.name} satın alındı.`);
           } else {
              setError(isEn ? "Insufficient coins!" : "Yetersiz bakiye!");
           }
      }} onEquipTheme={(id) => { setUserProfile(p => ({...p, activeThemeId: id})); setNotification("Tema Değişti."); }} onToggleDevMode={handleToggleDevMode} language={language} brightness={brightness} />}
      language={language}
      onLanguageChange={setLanguage}
      musicVolume={musicVolume}
      setMusicVolume={setMusicVolume}
      sfxVolume={sfxVolume}
      setSfxVolume={setSfxVolume}
      isMusicPlaying={isMusicPlaying}
      setIsMusicPlaying={setIsMusicPlaying}
      onPlayClick={playClickSound}
      currentMusicId={currentMusicId}
      setCurrentMusicId={setCurrentMusicId}
      musicTracks={MUSIC_TRACKS}
      onExitDevMode={() => handleToggleDevMode(false)}
      onShowHowToPlay={() => setIsHowToPlayOpen(true)}
    >
      
      {/* HOW TO PLAY MODAL */}
      {isHowToPlayOpen && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
           <div className={`w-full max-w-2xl rounded-3xl border-2 shadow-2xl flex flex-col overflow-hidden animate-scale-in ${theme.modalBg} ${theme.modalBorder} ${theme.text}`}>
              <div className="p-6 border-b flex justify-between items-center bg-white/5">
                 <h2 className="text-2xl font-bold font-typewriter flex items-center gap-3"><HelpCircle className="text-amber-500" /> {isEn ? "INVESTIGATION GUIDE" : "SORUŞTURMA REHBERİ"}</h2>
                 <button onClick={() => setIsHowToPlayOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={28} /></button>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <h3 className="text-amber-500 font-bold flex items-center gap-2"><Briefcase size={18}/> 1. {isEn ? "SELECT DEPT" : "DEPARTMAN SEÇ"}</h3>
                       <p className="text-xs opacity-70 leading-relaxed">{isEn ? "Choose from Homicide, Cyber or Theft. Each case costs 1 Energy." : "Cinayet, Siber veya Hırsızlık bürolarından birini seç. Her vaka 1 Enerji tüketir."}</p>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-amber-500 font-bold flex items-center gap-2"><Fingerprint size={18}/> 2. {isEn ? "FIND CLUES" : "DELİL TOPLA"}</h3>
                       <p className="text-xs opacity-70 leading-relaxed">{isEn ? "Scan the crime scene map. Critical evidence links the killer to the crime." : "Olay yeri haritasını tara. Kritik deliller katili suça doğrudan bağlar."}</p>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-amber-500 font-bold flex items-center gap-2"><Radio size={18}/> 3. {isEn ? "INTERROGATE" : "SORGUYA ÇEK"}</h3>
                       <p className="text-xs opacity-70 leading-relaxed">{isEn ? "Ask smart questions. Your questions are limited by your energy and rank." : "Zekice sorular sor. Sorgu hakkın rütbene ve dedektifine göre sınırlıdır."}</p>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-amber-500 font-bold flex items-center gap-2"><CheckCircle2 size={18}/> 4. {isEn ? "WIN REWARDS" : "ÖDÜL KAZAN"}</h3>
                       <p className="text-xs opacity-70 leading-relaxed">{isEn ? "Identify the right killer and win 5 Coins per case!" : "Doğru katili tespit et ve her vaka için 5 Jeton kazan!"}</p>
                    </div>
                 </div>
                 <div className="p-4 bg-amber-600/10 border border-amber-600/20 rounded-xl text-xs italic">
                    {isEn ? "Pro Tip: If you run out of energy, visit the Store for Coffee!" : "İpucu: Enerjin biterse Mağaza'dan Kahve alarak tazelenebilirsin!"}
                 </div>
              </div>
              <div className="p-6 border-t bg-white/5">
                 <button onClick={() => setIsHowToPlayOpen(false)} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${theme.button}`}>
                    {isEn ? "UNDERSTOOD" : "ANLAŞILDI, AMİRİM"}
                 </button>
              </div>
           </div>
        </div>
      )}

      <div key={activeSection} className="animate-slide-up flex flex-col h-full w-full">
         {activeSection === 'dashboard' && (
           <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full pb-10">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className={`p-4 rounded-xl border-2 flex items-center gap-4 ${theme.modalBg} ${theme.modalBorder}`}>
                    <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-amber-500 flex items-center justify-center text-3xl shrink-0">{userProfile.avatar}</div>
                    <div>
                       <h3 className={`font-bold text-lg ${theme.text}`}>{userProfile.name}</h3>
                       <p className="text-xs text-amber-500 font-mono">LVL {userProfile.level} | {userProfile.title}</p>
                    </div>
                 </div>
                 <div className={`lg:col-span-3 p-4 rounded-xl border-2 flex items-center gap-4 overflow-hidden ${theme.modalBg} ${theme.modalBorder}`}>
                    <Globe size={20} className="text-blue-500 animate-spin-slow shrink-0" />
                    <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] font-mono text-sm opacity-60">
                       {isEn ? ">>> ALERT: High profile target Victor K. spotted | Database sync complete | New cases available | " : ">>> UYARI: Hedef Victor K. görüldü | Veritabanı senkronize | Yeni vakalar yüklendi | "}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['homicide', 'cyber', 'theft'].map((dept) => (
                    <div key={dept} onClick={() => handleSelectDepartment(dept as Department)} className={`group relative h-72 rounded-xl border-2 transition-all hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center p-6 ${dept === 'homicide' ? 'bg-red-950/20 border-red-900 hover:border-red-500' : dept === 'cyber' ? 'bg-green-950/20 border-green-900 hover:border-green-500' : 'bg-amber-950/20 border-amber-900 hover:border-amber-500'}`}>
                       <div className="mb-4 p-5 rounded-full border-2 bg-black/20 group-hover:scale-110 transition-transform">
                          {dept === 'homicide' ? <Fingerprint className="text-red-500 w-12 h-12" /> : dept === 'cyber' ? <ShieldAlert className="text-green-500 w-12 h-12" /> : <Briefcase className="text-amber-500 w-12 h-12" />}
                       </div>
                       <h2 className={`text-2xl font-bold font-typewriter uppercase ${dept === 'homicide' ? 'text-red-500' : dept === 'cyber' ? 'text-green-500' : 'text-amber-500'}`}>
                          {isEn ? dept.toUpperCase() : (dept === 'homicide' ? 'CİNAYET' : dept === 'cyber' ? 'SİBER' : 'HIRSIZLIK')}
                       </h2>
                    </div>
                 ))}
              </div>

              <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                 {/* BOMB DISPOSAL GUIDE BUTTON - LINK UPDATED */}
                 <div onClick={() => window.open('https://bomba-imha.vercel.app/', '_blank')} className={`p-6 rounded-xl border-2 flex items-center justify-between cursor-pointer group transition-all hover:scale-[1.02] bg-blue-950/20 border-blue-900 hover:border-blue-500`}>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-600 rounded-lg text-white group-hover:animate-pulse">
                          <Activity size={32} />
                       </div>
                       <div>
                          <h4 className="font-bold">{isEn ? "Bomb Disposal" : "Bomba İmha"}</h4>
                          <p className="text-xs opacity-60">{isEn ? "Interactive Guide" : "İnteraktif Rehber"}</p>
                       </div>
                    </div>
                    <ChevronRight size={24} className="text-blue-500" />
                 </div>

                 <div className={`p-6 rounded-xl border-2 flex items-center justify-between bg-amber-600/10 border-amber-600/30`}>
                    <div className="flex items-center gap-4">
                       <TrendingUp size={32} className="text-amber-500" />
                       <div>
                          <h4 className="font-bold">{isEn ? "Bounty Bonus" : "Ödül Avcısı"}</h4>
                          <p className="text-xs opacity-60">{isEn ? "Win 5 Coins for every case." : "Her vaka için 5 Jeton kazan."}</p>
                       </div>
                    </div>
                    <div className="text-2xl font-bold font-mono text-amber-500">5 ₵</div>
                 </div>
              </div>
           </div>
         )}

         {activeSection === 'case_selection' && selectedDepartment && (
            <CaseSelection department={selectedDepartment} cases={cases.filter(c => c.department === selectedDepartment)} onNewCase={handleCreateNewCase} onOpenCase={(c) => { playClickSound(); setActiveCase(c); setActiveSection('game'); }} onDeleteCase={(id) => setCases(prev => prev.filter(c => c.id !== id))} isDarkMode={isDarkMode} language={language} userEnergy={userProfile.energy} brightness={brightness} />
         )}

         {activeSection === 'game' && activeCase && (
           <GameScreen caseFile={activeCase} onUpdateCase={handleCaseUpdate} onReturnToDesk={() => setActiveSection('case_selection')} isDarkMode={isDarkMode} userProfile={userProfile} language={language} brightness={brightness} />
         )}

         {activeSection === 'profile' && (
           <ProfileSection profile={userProfile} isDarkMode={isDarkMode} onSelectDetective={(id) => setUserProfile(p => ({...p, selectedDetectiveId: id}))} onUpdateAvatar={(av) => setUserProfile(p => ({...p, avatar: av}))} language={language} brightness={brightness} />
         )}
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 z-[500] bg-black/90 flex flex-col items-center justify-center gap-4 animate-fade-in">
          <Loader size={48} className="text-amber-600 animate-spin" />
          <div className="text-stone-400 font-typewriter animate-pulse">{isEn ? "ACCESSING ARCHIVES..." : "ARŞİVE ERİŞİLİYOR..."}</div>
        </div>
      )}
    </Layout>
  );
}
