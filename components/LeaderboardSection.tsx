import React from 'react';
import { LeaderboardEntry, UserProfile } from '../types';
import { Trophy, Medal, Star, User, Shield } from 'lucide-react';

interface LeaderboardSectionProps {
  isDarkMode: boolean;
  userProfile: UserProfile;
  language?: 'tr' | 'en';
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ isDarkMode, userProfile, language = 'tr' }) => {
  const isEn = language === 'en';

  const userEntry: LeaderboardEntry = {
    rank: 1, 
    name: userProfile.name,
    title: userProfile.title,
    score: userProfile.score,
    casesSolved: userProfile.correctAccusations, 
    avatar: userProfile.detectives.find(d => d.id === userProfile.selectedDetectiveId)?.avatar || "👤",
    isMe: true
  };

  const allEntries = [userEntry];
  const cardBg = isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-md';
  const rowHover = isDarkMode ? 'hover:bg-stone-800' : 'hover:bg-stone-50';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className={`p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 ${isDarkMode ? 'bg-gradient-to-r from-amber-900/20 to-stone-900 border border-amber-900/30' : 'bg-gradient-to-r from-amber-50 to-white border border-amber-200 shadow-lg'}`}>
         <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full border-4 border-amber-500 flex items-center justify-center bg-stone-800 text-3xl"><Trophy className="text-amber-500" size={32} /></div>
             <div><h2 className={`text-2xl font-typewriter font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{isEn ? "RANK INFO" : "RÜTBE BİLGİSİ"}</h2><p className="text-stone-500 text-sm">{userProfile.title}</p></div>
         </div>
         <div className="flex gap-4 md:gap-8 text-center">
             <div><div className="text-xs font-bold text-stone-500 uppercase tracking-widest">{isEn ? "Score" : "Puan"}</div><div className={`text-xl font-mono font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{userProfile.score.toLocaleString()}</div></div>
             <div><div className="text-xs font-bold text-stone-500 uppercase tracking-widest">{isEn ? "Level" : "Seviye"}</div><div className={`text-xl font-mono font-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{userProfile.level}</div></div>
             <div><div className="text-xs font-bold text-stone-500 uppercase tracking-widest">{isEn ? "Rank" : "Sıralama"}</div><div className={`text-xl font-mono font-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>#1</div></div>
         </div>
      </div>

      <div className={`${cardBg} rounded-xl overflow-hidden border`}>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className={`text-xs uppercase tracking-widest ${isDarkMode ? 'bg-stone-950 text-stone-500 border-b border-stone-800' : 'bg-stone-100 text-stone-600 border-b border-stone-200'}`}>
                     <th className="p-4 w-20 text-center">#</th>
                     <th className="p-4">{isEn ? "Detective" : "Dedektif"}</th>
                     <th className="p-4 hidden sm:table-cell">{isEn ? "Rank" : "Rütbe"}</th>
                     <th className="p-4 text-center">{isEn ? "Solved" : "Çözülen Vaka"}</th>
                     <th className="p-4 text-right">{isEn ? "Total Score" : "Toplam Puan"}</th>
                  </tr>
               </thead>
               <tbody className="font-mono text-sm">
                  {allEntries.map((entry) => (
                    <tr key={entry.rank} className={`border-b last:border-0 transition-colors cursor-default ${rowHover} ${entry.isMe ? (isDarkMode ? 'bg-amber-900/10 border-amber-900/30' : 'bg-amber-50 border-amber-200') : (isDarkMode ? 'border-stone-800' : 'border-stone-200')}`}>
                       <td className="p-4 text-center font-bold text-lg"><span className="text-yellow-500 flex justify-center"><Medal /></span></td>
                       <td className="p-4">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200 shadow-sm'}`}>{entry.avatar}</div>
                             <div>
                                <div className={`font-bold ${entry.isMe ? (isDarkMode ? 'text-amber-500' : 'text-stone-200') : (isDarkMode ? 'text-stone-300' : 'text-stone-800')}`}>{entry.name} {entry.isMe && <span className="text-[10px] bg-amber-600 text-white px-1 rounded ml-1">{isEn ? "YOU" : "SEN"}</span>}</div>
                                <div className="text-xs text-stone-500">{entry.title}</div>
                             </div>
                          </div>
                       </td>
                       <td className="p-4 hidden sm:table-cell text-stone-500">{entry.title}</td>
                       <td className="p-4 text-center text-stone-400">{entry.casesSolved}</td>
                       <td className={`p-4 text-right font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{entry.score.toLocaleString()}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;