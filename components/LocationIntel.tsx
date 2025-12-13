

import React, { useEffect, useState, useCallback } from 'react';
import { getLocationIntel } from '../services/geminiService';
import { MapPin, Loader, ExternalLink, Navigation, AlertTriangle, Scan, Search, Target, Skull, Fingerprint, DoorOpen, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MapPoint } from '../types';

interface LocationIntelProps {
  city: string;
  locationName: string;
  mapPoints?: MapPoint[];
}

const LocationIntel: React.FC<LocationIntelProps> = ({ city, locationName, mapPoints }) => {
  const [intel, setIntel] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  const fetchIntel = useCallback(async () => {
    // Only fetch AI text if it hasn't been fetched yet
    if (intel) return;

    setLoading(true);
    try {
      const data = await getLocationIntel(city, locationName);
      setIntel(data.text);
      setSources(data.sources || []);
    } catch (err) {
      console.error(err);
      // Fail silently for text, map still works
    } finally {
      setLoading(false);
    }
  }, [city, locationName, intel]);

  useEffect(() => {
    fetchIntel();
  }, [fetchIntel]);

  const getPointIcon = (type: string) => {
    switch(type) {
      case 'body': return <Skull size={16} />;
      case 'evidence': return <Search size={16} />;
      case 'blood': return <Fingerprint size={16} />;
      case 'entry': return <DoorOpen size={16} />;
      default: return <Target size={16} />;
    }
  };

  return (
    <div className="animate-fade-in space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-stone-700 pb-2 shrink-0">
        <h2 className="text-xl md:text-2xl font-typewriter text-amber-500 flex items-center gap-2">
          <Scan className="text-amber-600 animate-pulse" /> 
          <span>Olay Yeri Taktik Krokisi</span>
        </h2>
        <div className="flex gap-2">
            <span className="text-xs bg-stone-900 border border-stone-700 px-2 py-1 rounded text-stone-400 font-mono flex items-center gap-1">
               <Navigation size={10} /> {city.toUpperCase()}
            </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden min-h-[400px]">
         
         {/* LEFT: INTERACTIVE MAP */}
         <div className="flex-1 relative bg-[#0a0a0a] border border-stone-800 rounded-lg overflow-hidden group shadow-inner">
            {/* GRID BACKGROUND */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            ></div>
            
            {/* RADAR SWEEP EFFECT */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent h-full w-full animate-[scan_4s_linear_infinite] pointer-events-none border-b border-green-500/20"></div>

            {/* LOCATION LABEL */}
            <div className="absolute top-4 left-4 text-xs font-mono text-stone-500 bg-black/50 px-2 py-1 rounded">
               SEKTÖR: {locationName.toUpperCase()}
            </div>

            {/* MAP POINTS */}
            {mapPoints && mapPoints.map((point) => (
               <button
                  key={point.id}
                  onClick={() => setActivePoint(point)}
                  className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-125 hover:z-20
                    ${point.type === 'body' ? 'bg-red-900/50 border-red-500 text-red-500' : 
                      point.type === 'evidence' ? 'bg-amber-900/50 border-amber-500 text-amber-500 animate-pulse' : 
                      'bg-blue-900/50 border-blue-500 text-blue-500'}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
               >
                  {getPointIcon(point.type)}
                  <span className="absolute top-full mt-1 text-[9px] font-bold bg-black/80 text-white px-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     {point.label}
                  </span>
               </button>
            ))}

            {!mapPoints && (
               <div className="absolute inset-0 flex items-center justify-center text-stone-600 font-mono text-sm">
                  <AlertTriangle className="mr-2" /> KROKİ VERİSİ YÜKLENEMEDİ
               </div>
            )}
         </div>

         {/* RIGHT: INFO PANEL */}
         <div className="w-full md:w-80 flex flex-col gap-4">
            
            {/* SELECTED POINT DETAIL */}
            <div className={`flex-1 p-4 rounded-lg border flex flex-col relative ${activePoint ? 'bg-stone-900 border-amber-700/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-stone-950 border-stone-800'}`}>
               <div className="text-xs font-bold text-stone-500 mb-2 border-b border-stone-800 pb-1 flex justify-between">
                  <span>ANALİZ TERMİNALİ</span>
                  <span className="text-green-600 font-mono">{activePoint ? 'ONLINE' : 'STANDBY'}</span>
               </div>
               
               {activePoint ? (
                  <div className="animate-fade-in">
                     <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg border ${activePoint.type === 'body' ? 'bg-red-900/20 border-red-500 text-red-500' : 'bg-amber-900/20 border-amber-500 text-amber-500'}`}>
                           {getPointIcon(activePoint.type)}
                        </div>
                        <div>
                           <div className="text-stone-500 text-[10px] uppercase">NESNE TÜRÜ: {activePoint.type.toUpperCase()}</div>
                           <h3 className="text-lg font-bold text-stone-200">{activePoint.label}</h3>
                        </div>
                     </div>
                     <div className="p-3 bg-black/50 rounded border border-stone-800 text-sm font-mono text-stone-300 leading-relaxed">
                        <span className="text-amber-600 font-bold block mb-1">>> BULGU:</span>
                        {activePoint.description}
                     </div>
                     <button onClick={() => setActivePoint(null)} className="absolute top-2 right-2 text-stone-600 hover:text-stone-300"><X size={16}/></button>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-stone-600 gap-2 opacity-50">
                     <Target size={48} strokeWidth={1} />
                     <p className="text-xs text-center">Analiz etmek için<br/>haritadan bir nokta seçin.</p>
                  </div>
               )}
            </div>

            {/* AI INTEL TEXT (Mini) */}
            <div className="h-40 bg-stone-950 p-3 rounded-lg border border-stone-800 overflow-y-auto text-xs font-mono text-stone-400">
               <div className="sticky top-0 bg-stone-950 pb-2 mb-2 border-b border-stone-800 font-bold text-stone-500 flex justify-between items-center">
                  <span>UYDU İSTİHBARATI</span>
                  {loading && <Loader size={10} className="animate-spin text-amber-500" />}
               </div>
               {loading ? (
                  <span className="animate-pulse">Veri akışı sağlanıyor...</span>
               ) : (
                  <ReactMarkdown>{intel || "Bölge taraması tamamlandı. Ek veri yok."}</ReactMarkdown>
               )}
            </div>

         </div>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> CESET</span>
         <span className="flex items-center gap-1 ml-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> KANIT (KRİTİK)</span>
         <span className="flex items-center gap-1 ml-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> DİĞER</span>
      </div>
    </div>
  );
};

export default LocationIntel;