import React, { useState, useEffect, useRef } from 'react';
import { CaseFile, Suspect, ChatMessage, UserProfile } from '../types';
import { FileText, Users, Search, MapPin, MessageSquare, AlertTriangle, Fingerprint, Siren, Skull, FolderOpen, ArrowLeft, Terminal, Shield, Video, Activity, Binary, Mic, MicOff, Send } from 'lucide-react';
import InterrogationRoom from './InterrogationRoom';
import LocationIntel from './LocationIntel';
import { getThemeColors } from './Layout';

interface GameScreenProps {
  caseFile: CaseFile;
  onUpdateCase: (updatedCase: CaseFile) => void;
  onReturnToDesk: () => void;
  isDarkMode: boolean;
  userProfile: UserProfile;
  language?: 'tr' | 'en';
}

type Tab = 'case' | 'suspects' | 'clues' | 'interrogation' | 'location' | 'special';

const GameScreen: React.FC<GameScreenProps> = ({ caseFile, onUpdateCase, onReturnToDesk, isDarkMode, userProfile, language = 'tr' }) => {
  const [activeTab, setActiveTab] = useState<Tab>((caseFile.lastActiveTab as Tab) || 'case');
  const [suspectToAccuse, setSuspectToAccuse] = useState<Suspect | null>(null);
  
  const [isMicActive, setIsMicActive] = useState(false);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [teamMessages, setTeamMessages] = useState<string[]>([]);
  const [teamInput, setTeamInput] = useState('');
  
  const scenario = caseFile.scenario;
  const isSolved = caseFile.status !== 'active';
  const dept = caseFile.department;
  const isRedNotice = caseFile.isRedNotice;
  const isEn = language === 'en';

  const realKiller = scenario.suspects.find(s => s.isKiller);
  const activeDetective = userProfile.detectives.find(d => d.id === userProfile.selectedDetectiveId);
  const bonusQuestions = activeDetective?.bonus.maxQuestions || 0;

  // Theme Integration
  const theme = getThemeColors(userProfile.activeThemeId, dept, isDarkMode, !isDarkMode && false, !isDarkMode);
  
  // Dynamic Styles based on theme
  const cardBase = `${theme.modalBg} border ${theme.modalBorder}`;
  const textMain = theme.text;

  const deptConfig = {
    homicide: {
      labels: {
        victim: isEn ? 'Victim' : 'Kurban',
        cause: isEn ? 'Cause of Death' : 'Ölüm Sebebi',
        specialTab: isEn ? 'Autopsy' : 'Otopsi',
        clues: isEn ? 'Crime Scene Evidence' : 'Olay Yeri Delilleri'
      },
      icons: { special: <Activity size={16} />, victim: <Users size={24} /> },
      colors: { accent: 'text-red-500', border: 'border-red-800', button: 'bg-red-800 hover:bg-red-700' }
    },
    cyber: {
      labels: {
        victim: isEn ? 'Target System' : 'Hedef Sistem',
        cause: isEn ? 'Attack Vector' : 'Saldırı Vektörü',
        specialTab: isEn ? 'Terminal' : 'Terminal',
        clues: isEn ? 'Digital Footprint' : 'Dijital İzi'
      },
      icons: { special: <Terminal size={16} />, victim: <Binary size={24} /> },
      colors: { accent: 'text-green-500', border: 'border-green-800', button: 'bg-green-800 hover:bg-green-700' }
    },
    theft: {
      labels: {
        victim: isEn ? 'Victim Org.' : 'Mağdur Kurum',
        cause: isEn ? 'Stolen Item' : 'Çalınan Nesne',
        specialTab: 'CCTV',
        clues: isEn ? 'Physical Evidence' : 'Fiziksel Kanıtlar'
      },
      icons: { special: <Video size={16} />, victim: <Shield size={24} /> },
      colors: { accent: 'text-amber-500', border: 'border-amber-800', button: 'bg-amber-700 hover:bg-amber-600' }
    }
  };

  const config = deptConfig[dept];

  useEffect(() => {
    if (activeTab !== caseFile.lastActiveTab) {
      onUpdateCase({ ...caseFile, lastActiveTab: activeTab });
    }
  }, [activeTab, caseFile, onUpdateCase]);

  const handleMicToggle = async () => {
    if (!isMicActive) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicActive(true);
      } catch (err) {
        alert(isEn ? "Microphone access denied." : "Mikrofon izni verilmedi.");
      }
    } else {
      setIsMicActive(false);
    }
  };

  const sendTeamMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamInput.trim()) return;
    setTeamMessages(prev => [...prev, `${isEn ? 'Me' : 'Ben'}: ${teamInput}`]);
    setTeamInput('');
    setTimeout(() => {
       setTeamMessages(prev => [...prev, `${caseFile.teammateName || 'Partner'}: ${isEn ? 'Copy that.' : 'Anlaşıldı.'}`]);
    }, 2000);
  };

  const handleAccuseClick = (suspect: Suspect) => {
    if (isSolved) return;
    setSuspectToAccuse(suspect);
  };

  const confirmAccusation = () => {
    if (!suspectToAccuse) return;
    const win = Boolean(suspectToAccuse.isKiller);
    onUpdateCase({
      ...caseFile,
      status: win ? 'solved_win' : 'solved_lose'
    });
    setSuspectToAccuse(null);
  };

  const cancelAccusation = () => setSuspectToAccuse(null);

  const updateInterrogationState = (messages: ChatMessage[], count: number) => {
    if (messages.length !== caseFile.messages.length || count !== caseFile.questionsUsed) {
      onUpdateCase({ ...caseFile, messages, questionsUsed: count });
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'case', label: isEn ? 'Case File' : 'Dosya', icon: <FileText size={16} /> },
    { id: 'special', label: config.labels.specialTab, icon: config.icons.special },
    { id: 'location', label: isEn ? 'Map' : 'Harita', icon: <MapPin size={16} /> },
    { id: 'suspects', label: isEn ? 'Suspects' : 'Şüpheliler', icon: <Users size={16} /> },
    { id: 'clues', label: isEn ? 'Evidence' : 'Deliller', icon: <Search size={16} /> },
    { id: 'interrogation', label: isEn ? 'Interrogation' : 'Sorgu', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className={`flex flex-col h-full gap-4 animate-fade-in pb-10 relative ${isRedNotice ? 'p-2 border-2 border-red-600 rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.2)]' : ''}`}>
      
      {isRedNotice && (
         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 font-bold text-xs tracking-widest z-20 rounded shadow-lg animate-pulse">
            {isEn ? "INTERPOL: RED NOTICE" : "INTERPOL: KIRMIZI BÜLTEN"}
         </div>
      )}

      {caseFile.isMultiplayer && (
        <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2`}>
           {showTeamChat && (
              <div className={`w-64 h-64 rounded-lg shadow-xl border flex flex-col overflow-hidden ${theme.modalBg} ${theme.modalBorder}`}>
                 <div className="p-2 bg-blue-600 text-white font-bold text-xs flex justify-between">
                    <span>{isEn ? "TEAM RADIO" : "EKİP HATTI"} ({caseFile.teammateName})</span>
                    <button onClick={() => setShowTeamChat(false)}>✕</button>
                 </div>
                 <div className="flex-1 p-2 overflow-y-auto space-y-2 text-xs font-mono">
                    {teamMessages.map((m, i) => (
                       <div key={i} className={`p-1 rounded ${m.startsWith(isEn ? 'Me' : 'Ben') ? 'bg-blue-500/20 text-blue-500 ml-4' : 'bg-stone-500/20 text-stone-500 mr-4'}`}>
                          {m}
                       </div>
                    ))}
                 </div>
                 <form onSubmit={sendTeamMessage} className="p-2 border-t border-stone-700 flex gap-1">
                    <input className="w-full bg-transparent text-xs focus:outline-none" value={teamInput} onChange={e=>setTeamInput(e.target.value)} placeholder={isEn ? "Message..." : "Mesaj..."} />
                    <button type="submit"><Send size={12} /></button>
                 </form>
              </div>
           )}
           <div className="flex gap-2">
              <button onClick={handleMicToggle} className={`p-3 rounded-full shadow-lg border-2 transition-all ${isMicActive ? 'bg-red-600 border-red-400 animate-pulse text-white' : 'bg-stone-800 border-stone-600 text-stone-400'}`}>
                 {isMicActive ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button onClick={() => setShowTeamChat(!showTeamChat)} className="p-3 rounded-full shadow-lg border-2 bg-blue-600 border-blue-400 text-white">
                 <MessageSquare size={20} />
              </button>
           </div>
        </div>
      )}

      {suspectToAccuse && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`${theme.modalBg} ${theme.modalBorder} border-2 rounded-lg max-w-md w-full shadow-2xl flex flex-col relative overflow-hidden`}>
             <div className={`p-4 border-b flex items-center gap-3 bg-white/5`}>
                <Siren className={config.colors.accent} size={24} />
                <h2 className={`text-xl font-typewriter font-bold ${config.colors.accent} tracking-wider`}>
                  {dept === 'cyber' ? (isEn ? 'SYSTEM ISOLATION' : 'SİSTEM İZOLASYONU') : (isEn ? 'ARREST WARRANT' : 'TUTUKLAMA EMRİ')}
                </h2>
             </div>
             <div className="p-6 space-y-4">
                <p className={`${textMain} font-mono text-sm leading-relaxed`}>
                  {isEn ? "You are about to identify the following suspect as the" : "Aşağıdaki şüpheliyi"} <span className="font-bold">{isEn ? "PERPETRATOR" : "Asıl Fail"}</span> {isEn ? ":" : "olarak işaretlemek üzeresiniz:"}
                </p>
                <div className={`p-4 rounded border flex items-center gap-4 ${theme.modalBorder} bg-white/5`}>
                   <div className={`w-16 h-16 rounded flex items-center justify-center text-2xl font-bold font-typewriter border ${theme.modalBorder} bg-white/10 ${textMain}`}>
                      {suspectToAccuse.name.charAt(0)}
                   </div>
                   <div>
                      <div className={`text-lg font-bold font-typewriter ${textMain}`}>{suspectToAccuse.name}</div>
                      <div className="text-xs text-stone-500 uppercase">{suspectToAccuse.relation}</div>
                   </div>
                </div>
                <div className={`flex gap-3 p-3 rounded border bg-red-900/20 border-red-900/50`}>
                   <AlertTriangle className="text-red-500" shrink-0 size={20} />
                   <p className="text-xs text-red-300">
                     {isEn ? "This action is irreversible. Wrong decision fails the investigation." : "Bu işlem geri alınamaz. Yanlış karar soruşturmayı başarısız kılar."}
                   </p>
                </div>
             </div>
             <div className={`p-4 border-t flex gap-3 justify-end border-white/10`}>
                <button onClick={cancelAccusation} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors bg-white/10 hover:bg-white/20 ${textMain}`}>{isEn ? "CANCEL" : "İPTAL"}</button>
                <button onClick={confirmAccusation} className={`px-4 py-2 rounded ${config.colors.button} text-white text-xs font-bold uppercase flex items-center gap-2 shadow-lg`}>
                  <Fingerprint size={16} /> {isEn ? "CONFIRM" : "ONAYLA"}
                </button>
             </div>
          </div>
        </div>
      )}

      <div className={`flex items-center justify-between p-3 rounded-lg ${cardBase}`}>
         <div className="flex items-center gap-3">
            <button onClick={onReturnToDesk} className="flex items-center gap-1 text-xs font-mono opacity-60 hover:opacity-100 transition-colors uppercase tracking-wider">
              <ArrowLeft size={14} /> {isEn ? "BACK TO DESK" : "MASAYA DÖN"}
            </button>
            <div className="h-4 w-[1px] bg-stone-500/50"></div>
            <span className={`text-sm font-typewriter truncate max-w-[200px] md:max-w-none ${textMain}`}>
              {caseFile.title}
            </span>
         </div>
         <div className="flex gap-2">
            <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border ${caseFile.status === 'active' ? `${theme.modalBg} ${theme.text} ${theme.modalBorder}` : caseFile.status === 'solved_win' ? 'bg-green-900/20 text-green-500 border-green-900/50' : 'bg-red-900/20 text-red-500 border-red-900/50'}`}>
              {caseFile.status === 'active' ? (isEn ? 'ACTIVE' : 'AKTİF') : caseFile.status === 'solved_win' ? (isEn ? 'SOLVED' : 'BAŞARILI') : (isEn ? 'FAILED' : 'BAŞARISIZ')}
            </div>
         </div>
      </div>

      {isSolved && (
        <div className="space-y-4 animate-fade-in">
           <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-center justify-center gap-4 text-center ${caseFile.status === 'solved_win' ? 'bg-green-950/30 border-green-900 text-green-400' : 'bg-red-950/30 border-red-900 text-red-400'}`}>
             <div className="flex items-center gap-3">
               {caseFile.status === 'solved_win' ? <Siren className="animate-pulse w-8 h-8" /> : <Skull className="w-8 h-8" />}
               <span className="font-typewriter text-xl font-bold">
                 {caseFile.status === 'solved_win' ? (isEn ? 'CASE SOLVED. CONGRATULATIONS.' : 'VAKA ÇÖZÜLDÜ. TEBRİKLER.') : (isEn ? 'WRONG SUSPECT. PERPETRATOR ESCAPED.' : 'YANLIŞ TESPİT. SUÇLU KAÇTI.')}
               </span>
             </div>
           </div>
           
           {caseFile.status === 'solved_lose' && realKiller && (
             <div className={`p-6 rounded border-2 border-dashed border-red-900 bg-red-950/10 flex flex-col md:flex-row items-center gap-6 justify-center`}>
                <div className="flex flex-col items-center">
                   <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2">{isEn ? "REAL PERPETRATOR" : "GERÇEK SUÇLU"}</div>
                   <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center text-4xl font-bold text-red-500 border-4 border-red-900/50">
                      {realKiller.name.charAt(0)}
                   </div>
                </div>
                <div className="text-center md:text-left">
                   <h3 className="text-3xl font-typewriter text-red-500 font-bold">{realKiller.name}</h3>
                   <div className="flex items-center gap-2 justify-center md:justify-start text-red-400 mt-1 mb-2">
                      <span className="text-xs uppercase px-2 py-0.5 border border-red-900 rounded">{realKiller.relation}</span>
                   </div>
                   <div className="bg-black/30 p-3 rounded text-sm font-mono text-red-300 max-w-md">
                      <span className="font-bold block text-xs opacity-50 mb-1">{isEn ? "MOTIVE:" : "MOTİF:"}</span>
                      "{realKiller.motive}"
                   </div>
                </div>
             </div>
           )}
        </div>
      )}

      <div className={`flex overflow-x-auto gap-1 md:gap-2 border-b pb-1 scrollbar-hide ${theme.modalBorder}`}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-300 font-mono text-sm min-w-[100px] justify-center ${activeTab === tab.id ? `${theme.modalBg} ${theme.text} border-t border-x ${theme.modalBorder}` : `text-stone-500 hover:text-stone-300 hover:bg-black/20`}`}>
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={`p-4 md:p-6 rounded-b-lg rounded-tr-lg border shadow-xl min-h-[500px] relative overflow-hidden transition-colors ${cardBase}`}>
        
        {activeTab === 'case' && (
          <div className="space-y-6 animate-fade-in">
            {isRedNotice && (
               <div className="bg-red-900/20 border border-red-700 text-red-200 p-4 rounded mb-4 text-center font-bold tracking-wider animate-pulse border-dashed">
                  ⚠️ {isEn ? "HIGH RISK CLASSIFIED CASE. PROCEED WITH CAUTION." : "BU VAKA ÇOK GİZLİ VE YÜKSEK RİSK İÇERMEKTEDİR. DİKKATLİ OLUN."}
               </div>
            )}
            
            <div className={`flex flex-col md:flex-row md:items-end justify-between border-b-2 pb-4 gap-4 ${theme.modalBorder}`}>
               <div>
                  <h2 className={`text-3xl font-typewriter mb-1 ${textMain}`}>{scenario.city.toUpperCase()}</h2>
                  <p className={`${config.colors.accent} font-bold tracking-widest text-sm flex items-center gap-2`}>
                    <MapPin size={14} /> {scenario.locationName}
                  </p>
               </div>
               <div className="text-right">
                  <div className="text-xs text-stone-500 font-mono">{isEn ? "TIMESTAMP" : "ZAMAN DAMGASI"}</div>
                  <div className={`font-mono ${textMain}`}>{scenario.crimeScene.time}</div>
               </div>
            </div>

            <div className={`p-6 rounded border font-typewriter leading-relaxed shadow-inner relative bg-black/20 ${theme.modalBorder} ${textMain}`}>
              <FolderOpen className="absolute -top-3 -left-3 opacity-5 w-24 h-24 rotate-12" />
              {scenario.intro}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest border-b border-stone-500/20 pb-1">{config.labels.victim}</h3>
                <div className={`p-4 rounded border flex items-start gap-4 ${theme.modalBorder} bg-black/10`}>
                  <div className={`p-3 rounded-full bg-black/20`}>{config.icons.victim}</div>
                  <div>
                    <div className={`text-xl font-bold ${textMain}`}>{scenario.victim.name}</div>
                    <div className="text-stone-500 text-sm mb-2">{scenario.victim.age ? `${scenario.victim.age} ${isEn ? 'Years old,' : 'Yaşında,'} ` : ''}{scenario.victim.job}</div>
                    <div className="text-stone-500 text-xs italic">"{scenario.victim.personality}"</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                 <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest border-b border-stone-500/20 pb-1">{isEn ? "Details" : "Vaka Detayları"}</h3>
                 <div className={`p-4 rounded border space-y-2 ${theme.modalBorder} bg-black/10`}>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">{config.labels.cause}:</span>
                      <span className={`${config.colors.accent} font-bold font-mono`}>{scenario.crimeScene.deathCause}</span>
                    </div>
                    <div className={`text-sm border-t pt-2 mt-2 ${theme.modalBorder} ${textMain}`}>
                       {scenario.crimeScene.description}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'special' && (
          <div className="animate-fade-in h-full">
            {dept === 'homicide' && scenario.autopsy && (
               <div className="bg-[#f0f0f0] text-stone-900 p-6 rounded-sm shadow-md rotate-1 max-w-2xl mx-auto font-typewriter relative border border-stone-300">
                  <div className="absolute top-4 right-4 text-red-900 border-2 border-red-900 px-2 py-1 font-bold -rotate-12 opacity-50 text-xl">CONFIDENTIAL</div>
                  <h2 className="text-2xl font-bold border-b-2 border-stone-900 pb-2 mb-4 text-center">{isEn ? "AUTOPSY REPORT" : "OTOPSİ RAPORU"}</h2>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div><strong className="block text-xs uppercase text-stone-500">{isEn ? "Case No" : "Vaka No"}</strong><span>#{caseFile.id.substring(8,12)}</span></div>
                        <div><strong className="block text-xs uppercase text-stone-500">{isEn ? "Time of Death" : "Ölüm Saati"}</strong><span>{scenario.autopsy.timeOfDeath}</span></div>
                     </div>
                     <div className="bg-red-50 p-3 border border-red-100">
                        <strong className="block text-xs uppercase text-red-900 mb-1">{isEn ? "Toxicology" : "Toksikoloji"}</strong>
                        <p className="text-sm">{scenario.autopsy.toxicology}</p>
                     </div>
                     <div>
                        <strong className="block text-xs uppercase text-stone-500">{isEn ? "Wounds / Trauma" : "Yara / Travma"}</strong>
                        <p className="text-sm">{scenario.autopsy.wounds}</p>
                     </div>
                  </div>
               </div>
            )}
            {/* Cyber & Theft similar translation logic... */}
            {(dept === 'cyber' || dept === 'theft') && (
               <div className="flex items-center justify-center h-full opacity-50">{isEn ? "Evidence Log Loaded." : "Kanıt Günlüğü Yüklendi."}</div>
            )}
          </div>
        )}

        {activeTab === 'suspects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pb-4">
            {scenario.suspects.map((suspect) => (
              <div key={suspect.id} className={`group border transition-all duration-300 rounded flex flex-col hover:shadow-xl relative overflow-hidden bg-black/10 hover:bg-black/20 ${theme.modalBorder}`}>
                <div className={`p-3 border-b flex items-center gap-3 bg-white/5 ${theme.modalBorder}`}>
                  <div className={`w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-xl transition-colors font-typewriter bg-white/10 ${theme.modalBorder} ${textMain}`}>{suspect.name.charAt(0)}</div>
                  <div className="flex-1"><h3 className={`font-bold font-typewriter text-lg ${textMain}`}>{suspect.name}</h3><span className={`text-[10px] uppercase px-2 py-0.5 rounded border bg-black/20 ${theme.modalBorder}`}>{suspect.relation}</span></div>
                </div>
                <div className="p-4 space-y-3 flex-1 text-sm">
                   <div><span className={`${config.colors.accent} font-bold text-xs uppercase block mb-1`}>{isEn ? "Motive" : "Motif"}</span><p className={`${textMain} leading-snug font-mono`}>{suspect.motive}</p></div>
                   <div className={`pt-2 border-t border-white/10`}><span className="text-blue-500 font-bold text-xs uppercase block mb-1">Alibi</span><p className={`${textMain} leading-snug font-mono`}>{suspect.alibi}</p></div>
                </div>
                {!isSolved && (
                  <button onClick={() => handleAccuseClick(suspect)} className={`mx-4 mb-4 py-2 rounded transition-colors uppercase font-bold text-xs tracking-widest flex items-center justify-center gap-2 border shadow-sm bg-white/10 hover:bg-white/20 ${theme.text} ${theme.modalBorder}`}>
                    <Shield size={14} /> {dept === 'cyber' ? (isEn ? 'ISOLATE' : 'BAĞLANTIYI KES') : (isEn ? 'ARREST' : 'TUTUKLA')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'clues' && (
          <div className="space-y-4 animate-fade-in max-w-3xl mx-auto">
             <div className="flex items-center gap-4 mb-6 opacity-70"><div className="h-px bg-stone-500 flex-1"></div><Search className="text-stone-500" /><div className="h-px bg-stone-500 flex-1"></div></div>
             {scenario.clues.map((clue, idx) => (
               <div key={idx} className={`flex gap-4 p-5 border rounded-sm items-start shadow-sm transition-colors bg-black/20 hover:bg-black/30 ${theme.modalBorder}`}>
                  <div className={`mt-1 ${config.colors.accent}`}><AlertTriangle size={18} /></div>
                  <div><span className="text-[10px] font-mono text-stone-500 block mb-1 tracking-widest">{dept === 'cyber' ? `DATA_FRAGMENT_0${idx+1}` : (isEn ? `EVIDENCE #${idx + 400}` : `KANIT #${idx + 400}`)}</span><p className={`${textMain} ${dept === 'cyber' ? 'font-mono text-sm' : 'font-typewriter text-lg'} leading-relaxed`}>{clue}</p></div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'location' && (
          <div className="h-full animate-fade-in">
            <LocationIntel city={scenario.city} locationName={scenario.locationName} mapPoints={scenario.mapPoints} />
          </div>
        )}

        {activeTab === 'interrogation' && (
          <div className="h-full animate-fade-in">
            <InterrogationRoom 
              scenario={scenario} 
              initialMessages={caseFile.messages}
              initialQuestionCount={caseFile.questionsUsed}
              onStateUpdate={updateInterrogationState}
              isCaseSolved={isSolved}
              bonusQuestions={bonusQuestions}
              isDarkMode={isDarkMode}
              isAiGenerated={!!caseFile.isAiGenerated}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;