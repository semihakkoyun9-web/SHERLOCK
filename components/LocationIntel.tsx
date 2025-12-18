import React, { useEffect, useState, memo } from 'react';
import { getLocationIntel } from '../services/geminiService';
import { MapPin, Loader, Navigation, AlertTriangle, Scan, Search, Target, Skull, Fingerprint, DoorOpen, X, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MapPoint } from '../types';

interface LocationIntelProps {
  city: string;
  locationName: string;
  mapPoints?: MapPoint[];
}

const LocationIntel: React.FC<LocationIntelProps> = memo(({ city, locationName, mapPoints }) => {
  const [intel, setIntel] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  // Reset and fetch when location changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setIntel(null); // Clear old data immediately
      setSources([]);
      
      try {
        const data = await getLocationIntel(city, locationName);
        if (isMounted) {
          setIntel(data.text);
          setSources(data.sources || []);
        }
      } catch (err) {
        console.error("Intel fetch failed:", err);
        if (isMounted) {
            setIntel("Bağlantı hatası. Uydu verilerine ulaşılamıyor.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [city, locationName]);

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
       {/* Inject Keyframes for Radar Animation */}
       <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-radar-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>

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
         <div className="flex-1 relative bg-[#0a0a0a] border border-stone-800 rounded-lg overflow-hidden group shadow-inner min-h-[300px]">
            {/* GRID BACKGROUND */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            ></div>
            
            {/* RADAR SWEEP EFFECT */}
            <div className="absolute left-0 w-full h-[20%] bg-gradient-to-b from-green-500/20 to-transparent animate-radar-scan pointer-events-none border-t border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]"></div>

            {/* LOCATION LABEL */}
            <div className="absolute top-4 left-4 text-xs font-mono text-stone-500 bg-black/50 px-2 py-1 rounded border border-stone-800 backdrop-blur-sm z-10">
               SEKTÖR: {locationName.toUpperCase()}
            </div>

            {/* MAP POINTS */}
            {mapPoints && mapPoints.map((point) => (
               <button
                  key={point.id}
                  onClick={() => setActivePoint(point)}
                  className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-125 hover:z-20 z-10
                    ${point.type === 'body' ? 'bg-red-900/50 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                      point.type === 'evidence' ? 'bg-amber-900/50 border-amber-500 text-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                      'bg-blue-900/50 border-blue-500 text-blue-500'}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
               >
                  {getPointIcon(point.type)}
                  <span className="absolute top-full mt-1 text-[9px] font-bold bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-stone-700">
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
            <div className={`flex-1 p-4 rounded-lg border flex flex-col relative transition-colors duration-300 ${activePoint ? 'bg-stone-900 border-amber-700/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-stone-950 border-stone-800'}`}>
               <div className="text-xs font-bold text-stone-500 mb-2 border-b border-stone-800 pb-1 flex justify-between">
                  <span>ANALİZ TERMİNALİ</span>
                  <span className={`font-mono ${activePoint ? 'text-green-500 animate-pulse' : 'text-stone-700'}`}>{activePoint ? 'ONLINE' : 'STANDBY'}</span>
               </div>
               
               {activePoint ? (
                  <div className="animate-fade-in">
                     <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg border ${activePoint.type === 'body' ? 'bg-red-900/20 border-red-500 text-red-500' : 'bg-amber-900/20 border-amber-500 text-amber-500'}`}>
                           {getPointIcon(activePoint.type)}
                        </div>
                        <div>
                           <div className="text-stone-500 text-[10px] uppercase">NESNE TÜRÜ: {activePoint.type.toUpperCase()}</div>
                           <h3 className="text-lg font-bold text-stone-200 leading-tight">{activePoint.label}</h3>
                        </div>
                     </div>
                     <div className="p-3 bg-black/50 rounded border border-stone-800 text-sm font-mono text-stone-300 leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">
                        <span className="text-amber-600 font-bold block mb-1"> BULGU:</span>
                        {activePoint.description}
                     </div>
                     <button onClick={() => setActivePoint(null)} className="absolute top-2 right-2 text-stone-600 hover:text-stone-300 p-1"><X size={16}/></button>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-stone-600 gap-2 opacity-50 min-h-[150px]">
                     <Target size={48} strokeWidth={1} />
                     <p className="text-xs text-center font-mono">Analiz etmek için<br/>haritadan bir nokta seçin.</p>
                  </div>
               )}
            </div>

            {/* AI INTEL TEXT (Mini) */}
            <div className="h-48 bg-stone-950 p-3 rounded-lg border border-stone-800 flex flex-col">
               <div className="pb-2 mb-2 border-b border-stone-800 font-bold text-stone-500 flex justify-between items-center text-xs">
                  <span>UYDU İSTİHBARATI</span>
                  {loading && <Loader size={10} className="animate-spin text-amber-500" />}
               </div>
               
               <div className="overflow-y-auto text-xs font-mono text-stone-400 flex-1 custom-scrollbar space-y-2">
                  {loading ? (
                     <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                        <Loader className="animate-spin" size={20} />
                        <span>Veri akışı sağlanıyor...</span>
                     </div>
                  ) : (
                     <>
                        <div className="prose prose-invert prose-xs max-w-none">
                           <ReactMarkdown>
                              {intel || "Bölge taraması tamamlandı. Ek veri yok."}
                           </ReactMarkdown>
                        </div>
                        
                        {/* Display Sources/Links if available */}
                        {sources.length > 0 && (
                           <div className="mt-2 pt-2 border-t border-stone-800/50">
                              <span className="text-[10px] font-bold text-stone-500 block mb-1">KAYNAKLAR:</span>
                              <div className="flex flex-wrap gap-2">
                                 {sources.map((source, idx) => {
                                    const uri = source.web?.uri || source.maps?.uri;
                                    const title = source.web?.title || source.maps?.title || "Google Maps";
                                    if (!uri) return null;
                                    return (
                                       <a key={idx} href={uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-stone-900 border border-stone-700 px-2 py-1 rounded text-blue-400 hover:text-blue-300 hover:border-blue-500 flex items-center gap-1 transition-colors">
                                          <ExternalLink size={8} /> {title.substring(0, 15)}...
                                       </a>
                                    )
                                 })}
                              </div>
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>

         </div>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono border-t border-stone-800 pt-2">
         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div> CESET</span>
         <span className="flex items-center gap-1 ml-3"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_orange]"></div> KANIT (KRİTİK)</span>
         <span className="flex items-center gap-1 ml-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_blue]"></div> DİĞER</span>
      </div>
    </div>
  );
});

export default LocationIntel;