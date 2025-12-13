import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import GameScreen from './components/GameScreen';
import ProfileSection from './components/ProfileSection';
import StoreSection from './components/StoreSection';
import CaseSelection from './components/CaseSelection';
import { generateOfflineScenario } from './services/offlineCaseService';
import { CaseFile, Department, UserProfile, StoreItem } from './types';
import { Loader, Fingerprint, ShieldAlert, Briefcase, Info, X, Coins, Trophy } from 'lucide-react';

// --- AUDIO ASSETS (Updated to Stable Pixabay CDN) ---
const MUSIC_TRACKS = [
  { id: 'noir', name: 'Noir Jazz (Default)', url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b35520556.mp3?filename=detective-background-music-22194.mp3" },
  { id: 'suspense', name: 'Crime Scene Tension', url: "https://cdn.pixabay.com/download/audio/2021/11/01/audio_00fa5593f3.mp3?filename=suspense-11604.mp3" },
  { id: 'cyber', name: 'Cyber Pulse', url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cyberpunk-city-11020.mp3" },
  { id: 'rain', name: 'Heavy Rain Ambience', url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_8ed590b106.mp3?filename=rain-and-thunder-16705.mp3" }
];

const AUDIO_CLICK = "https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3?filename=mouse-click-153941.mp3"; 

export default function App() {
  // Theme State
  const [brightness, setBrightness] = useState(0); 
  
  const [showGameInfo, setShowGameInfo] = useState(false);

  // Settings State
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusicId, setCurrentMusicId] = useState('noir');

  // Audio Refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxClickRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Logic
  useEffect(() => {
    // SFX Init
    sfxClickRef.current = new Audio(AUDIO_CLICK);
    
    // Music Init
    const track = MUSIC_TRACKS.find(t => t.id === currentMusicId) || MUSIC_TRACKS[0];
    bgMusicRef.current = new Audio(track.url);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = musicVolume;

    // Cleanup
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Watch for Music Track Changes
  useEffect(() => {
    if (bgMusicRef.current) {
       const track = MUSIC_TRACKS.find(t => t.id === currentMusicId) || MUSIC_TRACKS[0];
       
       // Compare URLs to avoid reloading same track, but normalize if needed
       if (bgMusicRef.current.src !== track.url) {
          bgMusicRef.current.src = track.url;
          bgMusicRef.current.load(); // Ensure new source loads
          bgMusicRef.current.volume = musicVolume;
          
          if (isMusicPlaying) {
             const playPromise = bgMusicRef.current.play();
             if (playPromise !== undefined) {
                 playPromise.catch(e => {
                     console.error("Audio Play Error:", e);
                     setIsMusicPlaying(false); // Stop if blocked
                 });
             }
          }
       }
    }
  }, [currentMusicId]);

  // Volume & Play/Pause State Sync
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
      
      if (isMusicPlaying) {
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log("Autoplay blocked, waiting for interaction");
            });
        }
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicVolume, isMusicPlaying]);

  useEffect(() => {
    if (sfxClickRef.current) {
      sfxClickRef.current.volume = sfxVolume;
    }
  }, [sfxVolume]);

  const playClickSound = () => {
    if (sfxClickRef.current && sfxVolume > 0) {
      // Clone node to allow overlapping sounds (rapid clicks)
      const sound = sfxClickRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = sfxVolume;
      sound.play().catch(e => {});
    }
  };

  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [activeCase, setActiveCase] = useState<CaseFile | null>(null);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  // Store Sidebar State
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Profile Data - INITIALIZED WITH DETECTIVES
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
      // NEW DETECTIVES
      { id: 'det_4', name: 'Murat Yılmaz', title: 'Emekli Komiser', description: 'Sokakları avucunun içi gibi bilir.', avatar: '🚬', specialAbility: 'Daha az enerji harcar (-1)', bonus: {}, price: 1500, isOwned: false },
      { id: 'det_5', name: 'Aslı Kaya', title: 'Adli Tıp Uzmanı', description: 'Kanıtlar asla yalan söylemez.', avatar: '🥼', specialAbility: 'Otopsi raporunda ekstra detay', bonus: {}, price: 1800, isOwned: false },
      { id: 'det_6', name: 'Kerem Sancak', title: 'Saha Ajanı', description: 'Gizli görevlerin aranan ismi.', avatar: '🕶️', specialAbility: 'Şüphelileri daha hızlı sorgular', bonus: {}, price: 2200, isOwned: false },
      { id: 'det_7', name: 'Elif Doğan', title: 'Kriminal Psikolog', description: 'Yalanları gözünden anlar.', avatar: '🧠', specialAbility: 'Yalan tespitinde %50 şans', bonus: {}, price: 2500, isOwned: false },
      { id: 'det_8', name: 'Viktor Petrov', title: 'Eski İstihbaratçı', description: 'Soğuk savaş taktikleri.', avatar: '💂', specialAbility: 'Kırmızı Bülten vakalarında bonus ödül', bonus: {}, price: 3000, isOwned: false },
    ],
    inventory: []
  });

  const isEn = language === 'en';
  const isDarkMode = brightness <= 33; 

  const handleNavigate = (section: string) => {
    playClickSound();
    setActiveSection(section);
    if (section === 'dashboard') {
      setSelectedDepartment(null);
      setActiveCase(null);
    }
  };

  const handleUpdateName = (newName: string) => {
    setUserProfile(prev => ({ ...prev, name: newName }));
  };

  const handleUpdateProfileColor = (color: string) => {
    setUserProfile(prev => ({ ...prev, profileColor: color }));
  };

  const handleUpdateAvatarColor = (color: string) => {
    setUserProfile(prev => ({ ...prev, avatarColor: color }));
  };

  const handleUpdateAvatar = (newAvatar: string) => {
     setUserProfile(prev => ({ ...prev, avatar: newAvatar }));
  };

  const handleSelectDepartment = (dept: Department) => {
    playClickSound();
    setSelectedDepartment(dept);
    setActiveSection('case_selection');
  };

  const handleCreateNewCase = async () => {
    playClickSound();
    if (!selectedDepartment) return;

    // Check Energy (Bypass if Developer Mode is ON)
    // CHANGED: Cost is now 1 Energy
    if (userProfile.energy < 1 && !userProfile.isDeveloperMode) { 
      setError(isEn ? "Not enough energy! Drink coffee." : "Yetersiz Enerji! Kahve içmelisin.");
      setIsStoreOpen(true);
      return;
    }

    // Check Case Limit (Max 4 per dept)
    const deptCases = cases.filter(c => c.department === selectedDepartment);
    if (deptCases.length >= 4) {
      setError(isEn ? "Case files full. Delete old cases." : "Dosya dolabı dolu. Eski vakaları silin.");
      return;
    }

    setIsLoading(true);
    // Deduct Energy (Only if NOT dev mode)
    // CHANGED: Deduct 1 Energy
    if (!userProfile.isDeveloperMode) {
      setUserProfile(prev => ({ ...prev, energy: prev.energy - 1 }));
    }

    try {
      // Offline Engine
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
        isRedNotice: false
      };

      setCases([newCase, ...cases]);
      setNotification(isEn ? "New Case File Created" : "Yeni Vaka Dosyası Oluşturuldu");
    } catch (err) {
      setError(isEn ? "Failed to generate case." : "Vaka oluşturulamadı.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCase = (caseFile: CaseFile) => {
    playClickSound();
    setActiveCase(caseFile);
    setActiveSection('game');
  };

  const handleDeleteCase = (caseId: string) => {
    playClickSound();
    setCases(prev => prev.filter(c => c.id !== caseId));
    setNotification(isEn ? "Case File Deleted" : "Vaka Dosyası Silindi");
  };

  const handleCaseUpdate = (updatedCase: CaseFile) => {
    if (activeCase?.status === 'active' && updatedCase.status !== 'active') {
       if (updatedCase.status === 'solved_win') {
          const activeDet = userProfile.detectives.find(d => d.id === userProfile.selectedDetectiveId);
          const xpMult = activeDet?.bonus.xpMultiplier || 1;
          const baseReward = updatedCase.isRedNotice ? 1000 : (updatedCase.difficulty === 'hard' ? 500 : updatedCase.difficulty === 'medium' ? 300 : 150);
          
          const xpGain = Math.floor(250 * xpMult);
          const coinGain = baseReward;
          
          setUserProfile(prev => ({
             ...prev,
             xp: prev.xp + xpGain,
             coins: prev.coins + coinGain,
             score: prev.score + (xpGain * 2),
             casesSolved: prev.casesSolved + 1,
             correctAccusations: prev.correctAccusations + 1
          }));
          setNotification(isEn ? `CASE SOLVED! +${xpGain} XP, +${coinGain} Coins` : `VAKA ÇÖZÜLDÜ! +${xpGain} XP, +${coinGain} Jeton`);
          playClickSound(); 
       } else {
          setUserProfile(prev => ({
             ...prev,
             xp: prev.xp + 50, 
             casesSolved: prev.casesSolved + 1
          }));
          setError(isEn ? "WRONG ACCUSATION. SUSPECT RELEASED." : "YANLIŞ SUÇLAMA. ŞÜPHELİ SERBEST.");
       }
    }
    
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
    setActiveCase(updatedCase);
  };

  const handleBuyItem = (item: StoreItem) => {
    playClickSound();
    if (userProfile.coins >= item.price) {
       setUserProfile(prev => {
         let newEnergy = prev.energy;
         if (item.energyValue) newEnergy = Math.min(prev.maxEnergy, prev.energy + item.energyValue);
         
         // If creating a special case package
         if (item.type === 'case_package') {
            setIsStoreOpen(false); 
            // We need to route this through create logic, but simplified for now
            // Just notify user to open specific desk
            setNotification("Package Unlocked. Check your files.");
         }

         return {
           ...prev,
           coins: prev.coins - item.price,
           energy: newEnergy,
           inventory: item.type === 'upgrade' || item.type === 'theme' ? [...prev.inventory, { ...item, purchased: true }] : prev.inventory
         }
       });
       if(item.type !== 'case_package') setNotification(isEn ? `Purchased: ${item.name}` : `${item.name} satın alındı.`);
    } else {
       setError(isEn ? "Insufficient Funds" : "Yetersiz Bakiye");
    }
  };

  const handleEquipTheme = (themeId: string) => {
     playClickSound();
     setUserProfile(prev => ({ ...prev, activeThemeId: themeId }));
     setNotification(isEn ? "Theme Updated" : "Tema Güncellendi");
  };

  const handleToggleDevMode = (enabled: boolean) => {
    setUserProfile(prev => ({
       ...prev,
       isDeveloperMode: enabled,
       // If enabling, grant energy boost
       energy: enabled ? 999 : (prev.energy > prev.maxEnergy ? prev.maxEnergy : prev.energy),
       maxEnergy: enabled ? 999 : 12
    }));
  };

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
      onToggleStore={() => { setIsStoreOpen(!isStoreOpen); playClickSound(); }}
      storeContent={
        <StoreSection 
            isDarkMode={isDarkMode} 
            userProfile={userProfile} 
            onBuyItem={handleBuyItem} 
            onBuyCoins={(amount) => {
                setUserProfile(p => ({
                    ...p, 
                    coins: p.coins + amount
                }))
            }} 
            onEquipTheme={handleEquipTheme} 
            onToggleDevMode={handleToggleDevMode}
            language={language} 
        />
      }
      onShowGameInfo={() => { setShowGameInfo(true); playClickSound(); }}
      showGameInfo={showGameInfo}
      onCloseGameInfo={() => setShowGameInfo(false)}
      language={language}
      onLanguageChange={(l) => { setLanguage(l); playClickSound(); }}
      
      // AUDIO PROPS
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
    >
      
      {/* DASHBOARD - DESK SELECTION */}
      {activeSection === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
           {/* HOMICIDE CARD */}
           <div 
             onClick={() => handleSelectDepartment('homicide')}
             className={`group relative h-64 rounded-xl border-2 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-6 ${isDarkMode ? 'bg-red-950/20 border-red-900 hover:border-red-500 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:border-red-500 hover:shadow-xl'}`}
           >
              <div className="mb-4 p-4 rounded-full border-2 border-red-500/50 bg-red-500/10 group-hover:scale-110 transition-transform duration-500">
                <Fingerprint className="text-red-500 w-12 h-12" />
              </div>
              <h2 className={`text-2xl font-bold font-typewriter ${isDarkMode ? 'text-red-100' : 'text-red-900'}`}>{isEn ? "HOMICIDE" : "CİNAYET"}</h2>
              <p className={`text-xs mt-2 max-w-[200px] ${isDarkMode ? 'text-red-300/70' : 'text-red-800/70'}`}>
                {isEn ? "Investigate crime scenes, autopsy reports and alibis." : "Olay yeri, otopsi raporları ve şüpheli ifadelerini incele."}
              </p>
           </div>

           {/* CYBER CARD */}
           <div 
             onClick={() => handleSelectDepartment('cyber')}
             className={`group relative h-64 rounded-xl border-2 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-6 ${isDarkMode ? 'bg-green-950/20 border-green-900 hover:border-green-500 hover:bg-green-900/30' : 'bg-green-50 border-green-200 hover:border-green-500 hover:shadow-xl'}`}
           >
              <div className="mb-4 p-4 rounded-full border-2 border-green-500/50 bg-green-500/10 group-hover:scale-110 transition-transform duration-500">
                <ShieldAlert className="text-green-500 w-12 h-12" />
              </div>
              <h2 className={`text-2xl font-bold font-typewriter ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>{isEn ? "CYBER CRIMES" : "SİBER SUÇLAR"}</h2>
              <p className={`text-xs mt-2 max-w-[200px] ${isDarkMode ? 'text-green-300/70' : 'text-green-800/70'}`}>
                {isEn ? "Analyze server logs, hack attempts and digital footprints." : "Sunucu loglarını, hack girişimlerini ve dijital izleri takip et."}
              </p>
           </div>

           {/* THEFT CARD */}
           <div 
             onClick={() => handleSelectDepartment('theft')}
             className={`group relative h-64 rounded-xl border-2 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-6 ${isDarkMode ? 'bg-amber-950/20 border-amber-900 hover:border-amber-500 hover:bg-amber-900/30' : 'bg-amber-50 border-amber-200 hover:border-amber-500 hover:shadow-xl'}`}
           >
              <div className="mb-4 p-4 rounded-full border-2 border-amber-500/50 bg-amber-500/10 group-hover:scale-110 transition-transform duration-500">
                <Briefcase className="text-amber-500 w-12 h-12" />
              </div>
              <h2 className={`text-2xl font-bold font-typewriter ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}>{isEn ? "THEFT" : "HIRSIZLIK"}</h2>
              <p className={`text-xs mt-2 max-w-[200px] ${isDarkMode ? 'text-amber-300/70' : 'text-amber-800/70'}`}>
                {isEn ? "Solve high-stakes heists, museum robberies and grand theft." : "Büyük soygunları, müze hırsızlıklarını ve kasa işlerini çöz."}
              </p>
           </div>
        </div>
      )}

      {/* NEW CASE SELECTION SCREEN */}
      {activeSection === 'case_selection' && selectedDepartment && (
         <CaseSelection 
            department={selectedDepartment}
            cases={cases.filter(c => c.department === selectedDepartment)}
            onNewCase={handleCreateNewCase}
            onOpenCase={handleOpenCase}
            onDeleteCase={handleDeleteCase}
            isDarkMode={isDarkMode}
            language={language}
            userEnergy={userProfile.energy}
         />
      )}

      {/* ACTIVE GAME */}
      {activeSection === 'game' && activeCase && (
        <GameScreen 
          caseFile={activeCase} 
          onUpdateCase={handleCaseUpdate}
          onReturnToDesk={() => handleNavigate('case_selection')}
          isDarkMode={isDarkMode}
          userProfile={userProfile}
          language={language}
        />
      )}

      {/* PROFILE */}
      {activeSection === 'profile' && (
        <ProfileSection 
          profile={userProfile} 
          isDarkMode={isDarkMode}
          onSelectDetective={(id) => setUserProfile(prev => ({...prev, selectedDetectiveId: id}))}
          onUpdateAvatar={handleUpdateAvatar}
          onUpdateName={handleUpdateName}
          onUpdateProfileColor={handleUpdateProfileColor}
          onUpdateAvatarColor={handleUpdateAvatarColor}
          language={language}
        />
      )}
      
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center gap-4 animate-fade-in cursor-wait">
          <Loader size={48} className="text-amber-600 animate-spin" />
          <div className="text-stone-400 font-typewriter animate-pulse">{isEn ? "RETRIEVING CASE FILE..." : "DOSYA ARŞİVDEN ÇIKARILIYOR..."}</div>
        </div>
      )}

    </Layout>
  );
}