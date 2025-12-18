import React, { useState, useMemo } from 'react';
import { StoreItem, UserProfile } from '../types';
import { ShoppingBag, Zap, Palette, Lock, Check, Package, Coins, Eye, Monitor, FileText, Siren, Code, Sparkles, TrendingUp, Boxes } from 'lucide-react';
import { getThemeColors } from './Layout';

interface StoreSectionProps {
  isDarkMode: boolean;
  userProfile: UserProfile;
  onBuyItem: (item: StoreItem) => void;
  onBuyCoins?: (amount: number) => void;
  onEquipTheme?: (themeId: string) => void;
  onToggleDevMode?: (enabled: boolean) => void;
  language: 'tr' | 'en';
  brightness: number;
}

const StoreSection: React.FC<StoreSectionProps> = ({ isDarkMode, userProfile, onBuyItem, onBuyCoins, onEquipTheme, onToggleDevMode, language, brightness }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'themes' | 'cases' | 'bank'>('items');
  const [redeemCode, setRedeemCode] = useState('');
  const [adLoading, setAdLoading] = useState(false);
  
  const isEn = language === 'en';

  const handleWatchAd = (amount: number) => {
    setAdLoading(true);
    setTimeout(() => {
      onBuyCoins?.(amount);
      setAdLoading(false);
    }, 2000);
  };

  const theme = useMemo(() => getThemeColors(userProfile.activeThemeId, undefined, isDarkMode, brightness), [userProfile.activeThemeId, isDarkMode, brightness]);
  const cardBg = `${theme.modalBg} border-2 ${theme.modalBorder}`;
  
  const items: StoreItem[] = [
    { id: 'item_coffee', name: isEn ? 'Hot Coffee' : 'Sıcak Kahve', type: 'upgrade', description: isEn ? '+5 Energy. Stay awake.' : '+5 Enerji yeniler. Uyanık kal.', price: 150, icon: '☕', purchased: false, energyValue: 5 },
    { id: 'item_donut', name: isEn ? 'Fresh Donut' : 'Taze Donut', type: 'upgrade', description: isEn ? '+2 Energy. Quick snack.' : '+2 Enerji. Hızlı atıştırmalık.', price: 80, icon: '🍩', purchased: false, energyValue: 2 },
    { id: 'item_flashlight', name: isEn ? 'Tactical Flashlight' : 'Taktik Fener', type: 'upgrade', description: isEn ? 'See clues in dark areas.' : 'Karanlık noktalardaki ipuçlarını aydınlatır.', price: 400, icon: '🔦', purchased: false },
    { id: 'item_uv', name: isEn ? 'UV Light' : 'UV Işığı', type: 'upgrade', description: isEn ? 'Reveals hidden blood stains.' : 'Gizli kan lekelerini ortaya çıkarır.', price: 650, icon: '🟣', purchased: false },
  ];

  const themes: StoreItem[] = [
     { id: 'default', name: isEn ? 'Standard' : 'Standart', type: 'theme', description: isEn ? 'Original desk aesthetic.' : 'Orijinal masaüstü.', price: 0, icon: '🖥️', purchased: true },
     { id: 'theme_noir', name: 'Ultra Noir', type: 'theme', description: isEn ? 'Classic Black & White atmosphere.' : 'Klasik siyah-beyaz atmosfer.', price: 800, icon: '🎞️', purchased: false },
     { id: 'theme_matrix', name: 'Matrix Protocols', type: 'theme', description: isEn ? 'Digital green rain interface.' : 'Dijital yeşil yağmur arayüzü.', price: 1200, icon: '💻', purchased: false },
     { id: 'theme_ice', name: 'Deep Frost', type: 'theme', description: isEn ? 'Sub-zero frozen blue aesthetics.' : 'Sıfırın altında donmuş mavi estetik.', price: 900, icon: '❄️', purchased: false },
     { id: 'theme_luxury', name: 'Grand Luxury', type: 'theme', description: isEn ? 'Premium Gold & Midnight Black.' : 'Premium Altın ve Gece Siyahı.', price: 3000, icon: '💎', purchased: false },
     { id: 'theme_sepia', name: 'Vintage Archive', type: 'theme', description: isEn ? 'Aged paper and sepia tones.' : 'Eskimiş kağıt ve sepya tonları.', price: 1000, icon: '📜', purchased: false },
     { id: 'theme_cyberpunk', name: 'Cyberpunk Neon', type: 'theme', description: isEn ? 'Neon purple and futuristic vibes.' : 'Neon mor ve fütüristik hava.', price: 1500, icon: '🌃', purchased: false },
     { id: 'theme_forest', name: 'Forest Mystery', type: 'theme', description: isEn ? 'Emerald green and nature feel.' : 'Zümrüt yeşili ve doğa hissi.', price: 1100, icon: '🌲', purchased: false },
     { id: 'theme_crimson', name: 'Crimson Night', type: 'theme', description: isEn ? 'Blood red and high contrast.' : 'Kan kırmızısı ve yüksek kontrast.', price: 2000, icon: '🧛', purchased: false },
     { id: 'theme_midnight', name: 'Midnight Sky', type: 'theme', description: isEn ? 'Deep indigo and silver stars.' : 'Derin çivit mavisi ve gümüş yıldızlar.', price: 1300, icon: '🌑', purchased: false },
     { id: 'theme_desert', name: 'Golden Sand', type: 'theme', description: isEn ? 'Warm orange and desert sun.' : 'Sıcak turuncu ve çöl güneşi.', price: 1400, icon: '🏜️', purchased: false },
     { id: 'theme_terminal', name: 'Terminal V8', type: 'theme', description: isEn ? 'Pure CRT hacker interface.' : 'Saf CRT hacker arayüzü.', price: 1600, icon: '📟', purchased: false },
     { id: 'theme_ocean', name: 'Ocean Depths', type: 'theme', description: isEn ? 'Deep sea sky-blue aesthetic.' : 'Derin deniz gökyüzü mavisi estetiği.', price: 1250, icon: '🌊', purchased: false },
  ];

  const casePackages: StoreItem[] = [
     { id: 'pkg_random', name: isEn ? 'Random File' : 'Rastgele Dosya', type: 'case_package', description: isEn ? 'One randomly assigned case.' : 'Rastgele atanmış bir vaka.', price: 200, icon: '🎲', purchased: false },
     { id: 'pkg_easy', name: isEn ? 'Rookie Pack' : 'Çaylak Paketi', type: 'case_package', description: isEn ? '3 Easy level cases.' : '3 adet Kolay seviye vaka.', price: 500, icon: '📂', purchased: false, packageDifficulty: 'easy' },
     { id: 'pkg_medium', name: isEn ? 'Agent Pack' : 'Ajan Paketi', type: 'case_package', description: isEn ? '3 Medium level cases.' : '3 adet Orta seviye vaka.', price: 1200, icon: '📁', purchased: false, packageDifficulty: 'medium' },
     { id: 'pkg_hard', name: isEn ? 'Veteran Pack' : 'Kıdemli Paketi', type: 'case_package', description: isEn ? '3 Hard level cases.' : '3 adet Zor seviye vaka.', price: 2500, icon: '📦', purchased: false, packageDifficulty: 'hard' },
  ];

  const coinPackages = [
     { id: 'coins_50', amount: 50, price: isEn ? 'WATCH AD' : 'REKLAM İZLE', icon: '📺' },
     { id: 'coins_500', amount: 500, price: '50 TL', icon: '💰' },
     { id: 'coins_1500', amount: 1500, price: '120 TL', icon: '💎' },
  ];

  const handleRedeem = () => {
    if (redeemCode.trim().toLowerCase() === 'semihbaba') {
      onToggleDevMode?.(true);
      setRedeemCode('');
    }
  };

  const tabClass = (tab: string) => `px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest border-2 flex items-center gap-2
    ${activeTab === tab ? `${theme.button} border-white/20 shadow-lg scale-105` : `bg-white/5 border-transparent ${theme.text} opacity-50 hover:opacity-100`}`;

  const renderGrid = (list: StoreItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {list.map((item, idx) => {
          const isOwned = userProfile.inventory.some(i => i.id === item.id);
          const isActive = userProfile.activeThemeId === item.id || (!userProfile.activeThemeId && item.id === 'default');
          return (
            <div key={item.id} className={`${cardBg} p-5 rounded-2xl flex flex-col relative animate-slide-up stagger-${(idx % 4) + 1} transition-all hover:scale-[1.02]`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-3xl bg-black/20 border border-white/5`}>{item.icon}</div>
                  <div className="min-w-0 flex-1">
                      <h3 className={`font-bold text-sm truncate mb-1 ${theme.text}`}>{item.name}</h3>
                      <p className={`text-[9px] opacity-60 leading-relaxed line-clamp-3 ${theme.muted}`}>{item.description}</p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-[10px] font-bold opacity-40 uppercase">{isEn ? "Cost" : "Bedel"}</span>
                    <span className="text-xs font-bold font-mono text-green-500">{item.price} ₵</span>
                  </div>
                  <button 
                    onClick={() => isActive ? null : (isOwned && item.type === 'theme' ? onEquipTheme?.(item.id) : onBuyItem(item))}
                    className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-green-600 text-white cursor-default' : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg'}`}
                  >
                    {isActive ? (isEn ? "EQUIPPED" : "KUŞANILDI") : (isOwned ? (isEn ? "EQUIP" : "KUŞAN") : (isEn ? "PURCHASE" : "SATIN AL"))}
                  </button>
                </div>
            </div>
          );
      })}
    </div>
  );

  return (
    <div className={`animate-fade-in w-full h-full flex flex-col p-6 space-y-6 ${theme.text}`}>
       <div className="flex flex-col md:flex-row gap-6 items-center justify-between shrink-0">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 custom-scrollbar">
              <button onClick={() => setActiveTab('items')} className={tabClass('items')}><Package size={14}/>{isEn ? 'GEAR' : 'EŞYALAR'}</button>
              <button onClick={() => setActiveTab('themes')} className={tabClass('themes')}><Palette size={14}/>{isEn ? 'THEMES' : 'TEMALAR'}</button>
              <button onClick={() => setActiveTab('cases')} className={tabClass('cases')}><Boxes size={14}/>{isEn ? 'CASES' : 'VAKALAR'}</button>
              <button onClick={() => setActiveTab('bank')} className={tabClass('bank')}><Coins size={14}/>{isEn ? 'BANK' : 'BANKA'}</button>
          </div>
          <div className={`px-5 py-2 rounded-xl border-2 flex items-center gap-4 shadow-xl ${cardBg}`}>
             <div className="p-1.5 bg-amber-600/20 rounded-lg"><Coins size={20} className="text-amber-500" /></div>
             <div className="text-right">
                <div className="opacity-50 text-[8px] font-bold uppercase">{isEn ? "COINS" : "BAKİYE"}</div>
                <div className={`font-mono font-bold text-lg ${theme.accent}`}>{userProfile.coins} ₵</div>
             </div>
          </div>
       </div>

       <div className={`flex gap-3 p-3 rounded-xl border items-center shadow-lg transition-all focus-within:ring-2 focus-within:ring-amber-500/30 shrink-0 ${cardBg}`}>
          <Code size={18} className="text-stone-500 ml-2" />
          <input 
            value={redeemCode} 
            onChange={e=>setRedeemCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRedeem()}
            placeholder={isEn ? "ENTER PROMO CODE..." : "PROMOSYON KODU GİRİN..."} 
            className={`flex-1 bg-transparent text-xs font-mono focus:outline-none ${theme.text}`}
          />
          <button onClick={handleRedeem} className={`text-[9px] ${theme.button} px-5 py-2 rounded-lg font-bold transition-all hover:scale-105`}>{isEn ? "REDEEM" : "ONAYLA"}</button>
       </div>

       <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar pr-2">
           {activeTab === 'items' && renderGrid(items)}
           {activeTab === 'themes' && renderGrid(themes)}
           {activeTab === 'cases' && renderGrid(casePackages)}
           {activeTab === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coinPackages.map((pkg, idx) => (
                  <div key={pkg.id} className={`${cardBg} p-8 rounded-2xl flex flex-col items-center justify-center gap-6 text-center animate-slide-up stagger-${(idx % 4) + 1} transition-all hover:scale-105`}>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl bg-black/20 border border-white/5 shadow-inner`}>{pkg.icon}</div>
                      <div>
                        <div className={`text-3xl font-bold ${theme.accent} font-mono`}>{pkg.amount} ₵</div>
                        <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest">{isEn ? "Credits" : "Kredi"}</p>
                      </div>
                      <button 
                        onClick={() => pkg.price.includes('IZLE') ? handleWatchAd(pkg.amount) : onBuyCoins?.(pkg.amount)} 
                        className={`w-full py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-500 text-white shadow-xl transition-all`}
                      >
                        {adLoading && pkg.price.includes('IZLE') ? (isEn ? "LOADING..." : "YÜKLENİYOR...") : pkg.price}
                      </button>
                  </div>
                ))}
              </div>
           )}
       </div>
    </div>
  );
};

export default StoreSection;