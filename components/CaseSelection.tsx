
import React from 'react';
import { CaseFile, Department } from '../types';
// Fixed: Added missing icon imports (Database, Radio, Activity)
import { FolderPlus, FolderOpen, Trash2, FileText, Lock, Database, Radio, Activity } from 'lucide-react';

interface CaseSelectionProps {
  department: Department;
  cases: CaseFile[];
  onNewCase: () => void;
  onOpenCase: (caseFile: CaseFile) => void;
  onDeleteCase: (id: string) => void;
  isDarkMode: boolean;
  language: 'tr' | 'en';
  userEnergy: number;
}

const CaseSelection: React.FC<CaseSelectionProps> = ({ 
  department, 
  cases, 
  onNewCase, 
  onOpenCase, 
  onDeleteCase, 
  isDarkMode, 
  language,
}) => {
  const isEn = language === 'en';
  
  const getDeptColor = () => {
    switch(department) {
      case 'homicide': return 'red';
      case 'cyber': return 'green';
      case 'theft': return 'amber';
      default: return 'stone';
    }
  };
  
  const color = getDeptColor();
  const maxCases = 4;
  const canCreate = cases.length < maxCases;

  return (
    <div className="animate-slide-up w-full flex flex-col gap-6 max-w-7xl mx-auto h-full">
       {/* HEADER */}
       <div className={`p-6 rounded-xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 ${isDarkMode ? `bg-${color}-950/20 border-${color}-900` : `bg-${color}-50 border-${color}-200`}`}>
          <div>
             <h2 className={`text-3xl font-bold font-typewriter uppercase ${isDarkMode ? `text-${color}-400` : `text-${color}-900`}`}>
                {department === 'homicide' ? (isEn ? "HOMICIDE ARCHIVES" : "CİNAYET ARŞİVİ") : 
                 department === 'cyber' ? (isEn ? "CYBER LOGS" : "SİBER KAYITLAR") : 
                 (isEn ? "THEFT FILES" : "HIRSIZLIK DOSYALARI")}
             </h2>
             <p className={`text-sm ${isDarkMode ? `text-${color}-300/70` : `text-${color}-800/70`}`}>
                {isEn ? "Select a case file to investigate or open a new one." : "İncelemek için bir dosya seçin veya yeni bir vaka açın."}
             </p>
          </div>
          <div className="text-right">
             <div className="text-xs font-mono opacity-50">{isEn ? "CAPACITY" : "KAPASİTE"}</div>
             <div className="text-2xl font-bold font-mono">{cases.length} / {maxCases}</div>
          </div>
       </div>

       {/* GRID */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          
          {/* NEW CASE BUTTON */}
          <button 
             onClick={onNewCase}
             disabled={!canCreate}
             className={`h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all animate-slide-up stagger-1
                ${!canCreate 
                   ? 'opacity-50 cursor-not-allowed border-stone-700 bg-stone-900/50' 
                   : (isDarkMode 
                      ? `border-${color}-700/50 hover:border-${color}-500 hover:bg-${color}-900/20 cursor-pointer` 
                      : `border-${color}-300 hover:border-${color}-500 hover:bg-${color}-50 cursor-pointer`)
                }
             `}
          >
             {canCreate ? (
                <>
                   <div className={`p-5 rounded-full ${isDarkMode ? `bg-${color}-900/30 text-${color}-400` : `bg-${color}-100 text-${color}-600`}`}>
                      <FolderPlus size={36} />
                   </div>
                   <span className={`font-bold font-typewriter uppercase ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      {isEn ? "NEW CASE FILE" : "YENİ VAKA DOSYASI"}
                   </span>
                   <span className="text-xs font-mono text-stone-500">
                      {isEn ? "Cost: 1 Energy" : "Bedel: 1 Enerji"}
                   </span>
                </>
             ) : (
                <>
                   <Lock size={36} className="text-stone-600" />
                   <span className="text-stone-500 font-bold">{isEn ? "CABINET FULL" : "DOLAP DOLU"}</span>
                </>
             )}
          </button>

          {/* EXISTING CASES */}
          {cases.map((caseFile, idx) => (
             <div key={caseFile.id} className={`h-56 relative rounded-xl border-2 flex flex-col p-6 transition-all hover:shadow-xl group animate-slide-up stagger-${(idx % 4) + 1} ${isDarkMode ? 'bg-stone-900 border-stone-800 hover:border-stone-500' : 'bg-white border-stone-200 hover:border-stone-400 shadow-lg'}`}>
                {/* STATUS BADGE */}
                <div className="absolute top-4 right-4">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                      caseFile.status === 'active' ? 'bg-blue-900/20 text-blue-500 border-blue-800' : 
                      caseFile.status === 'solved_win' ? 'bg-green-900/20 text-green-500 border-green-800' : 
                      'bg-red-900/20 text-red-500 border-red-800'
                   }`}>
                      {caseFile.status === 'active' ? (isEn ? "ACTIVE" : "AKTİF") : caseFile.status === 'solved_win' ? (isEn ? "SOLVED" : "ÇÖZÜLDÜ") : (isEn ? "CLOSED" : "KAPANDI")}
                   </span>
                </div>

                <div className={`mb-4 ${isDarkMode ? `text-${color}-400` : `text-${color}-600`}`}>
                   <FileText size={32} />
                </div>
                
                <h3 className={`font-bold font-typewriter text-xl leading-tight mb-2 line-clamp-2 ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                   {caseFile.title}
                </h3>
                <p className="text-xs text-stone-500 font-mono mb-auto opacity-60">
                   {caseFile.createdAt} • ID: {caseFile.id.slice(-4)}
                </p>

                <div className="flex gap-3 mt-6 pt-6 border-t border-dashed border-stone-700/50">
                   <button 
                      onClick={() => onOpenCase(caseFile)}
                      className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'}`}
                   >
                      <FolderOpen size={16} /> {isEn ? "OPEN" : "AÇ"}
                   </button>
                   <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteCase(caseFile.id); }}
                      className={`p-3 rounded-lg hover:bg-red-900/30 text-stone-600 hover:text-red-500 transition-colors border border-transparent hover:border-red-900/50`}
                      title={isEn ? "Destroy File" : "Dosyayı İmha Et"}
                   >
                      <Trash2 size={20} />
                   </button>
                </div>
             </div>
          ))}
       </div>

       {/* Visual Filler for bottom */}
       <div className="mt-auto pt-10 border-t border-stone-800 opacity-20 flex justify-center gap-10 grayscale">
          <div className="flex flex-col items-center gap-1"><Database size={20}/><span className="text-[8px] font-mono tracking-widest">ARCHIVE_V9</span></div>
          <div className="flex flex-col items-center gap-1"><Radio size={20}/><span className="text-[8px] font-mono tracking-widest">ENCRYPTED_SIG</span></div>
          <div className="flex flex-col items-center gap-1"><Activity size={20}/><span className="text-[8px] font-mono tracking-widest">CPU_OPTIMIZED</span></div>
       </div>
    </div>
  );
};

export default CaseSelection;
