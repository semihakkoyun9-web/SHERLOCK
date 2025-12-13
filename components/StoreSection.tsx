import React, { useState } from 'react';
import { StoreItem, UserProfile } from '../types';
import { ShoppingBag, Zap, Palette, Lock, Check, Package, Coins, Eye, Monitor, FileText, Siren, Code } from 'lucide-react';
import { getThemeColors } from './Layout'; // Import helper

interface StoreSectionProps {
  isDarkMode: boolean;
  userProfile: UserProfile;
  onBuyItem: (item: StoreItem) => void;
  onBuyCoins?: (amount: number) => void;
  onEquipTheme?: (themeId: string) => void;
  onToggleDevMode?: (enabled: boolean) => void; // New prop
  language: 'tr' | 'en';
}

const StoreSection: React.FC<StoreSectionProps> = ({ isDarkMode, userProfile, onBuyItem, onBuyCoins, onEquipTheme, onToggleDevMode, language }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'themes' | 'cases' | 'bank'>('items');
  const [redeemCode, setRedeemCode] = useState('');
  const [adLoading, setAdLoading] = useState(false);
  
  const isEn = language === 'en';

  // Retrieve theme colors for inner components
  // We use dummy values for mode since we want to follow the active theme strictly if present
  const theme = getThemeColors(userProfile.activeThemeId, undefined, isDarkMode, !isDarkMode && false, !isDarkMode);

  // Card Background based on theme
  const cardBg = `${theme.modalBg} border-2 ${theme.modalBorder}`;
  const cardText = theme.text;
  
  const items: StoreItem[] = [
    { id: 'item_coffee', name: isEn ? 'Hot Coffee' : 'Sıcak Kahve', type: 'upgrade', description: isEn ? '+5 Energy. Stay awake.' : '+5 Enerji yeniler. Uyanık kal.', price: 150, icon: '☕', purchased: false, energyValue: 5 },
    { id: 'item_donut', name: isEn ? 'Fresh Donut' : 'Taze Donut', type: 'upgrade', description: isEn ? '+2 Energy. Quick snack.' : '+2 Enerji. Hızlı atıştırmalık.', price: 80, icon: '🍩', purchased: false, energyValue: 2 },
    { id: 'item_flashlight', name: isEn ? 'Tactical Flashlight' : 'Taktik Fener', type: 'upgrade', description: isEn ? 'See clues in dark areas.' : 'Karanlık noktalardaki ipuçlarını aydınlatır.', price: 400, icon: '🔦', purchased: false },
    { id: 'item_uv', name: isEn ? 'UV Light' : 'UV Işığı', type: 'upgrade', description: isEn ? 'Reveals hidden blood stains.' : 'Gizli kan lekelerini ortaya çıkarır.', price: 650, icon: '🟣', purchased: false },
    { id: 'item_magnifier', name: isEn ? 'Golden Magnifier' : 'Altın Büyüteç', type: 'cosmetic', description: isEn ? 'Gold badge on profile.' : 'Profilinde altın büyüteç rozeti.', price: 500, icon: '🔍', purchased: false },
    { id: 'item_badge_vet', name: isEn ? 'Veteran Badge' : 'Gazi Rozeti', type: 'cosmetic', description: isEn ? 'For retired detectives.' : 'Emekli dedektifler için.', price: 2000, icon: '🎖️', purchased: false },
    { id: 'item_notebook', name: isEn ? 'Leather Notebook' : 'Deri Defter', type: 'upgrade', description: isEn ? 'Increases note capacity.' : 'Not alma kapasitesini artırır (Dekoratif).', price: 300, icon: '📔', purchased: false },
  ];

  const themes: StoreItem[] = [
     { id: 'default', name: isEn ? 'Standard Theme' : 'Standart Tema', type: 'theme', description: isEn ? 'Original look.' : 'Orijinal renkli masaüstü görünümü.', price: 0, icon: '🖥️', purchased: true },
     { id: 'theme_noir', name: 'Ultra Noir', type: 'theme', description: 'Black & White Film.', price: 800, icon: '🎞️', purchased: false },
     { id: 'theme_matrix', name: isEn ? 'Matrix Protocol' : 'Matrix Protokolü', type: 'theme', description: 'Cyber crimes UI.', price: 1000, icon: '💻', purchased: false },
     { id: 'theme_cyber', name: 'Cyberpunk Neon', type: 'theme', description: 'Neon & Purple.', price: 1500, icon: '🌆', purchased: false },
     { id: 'theme_synth', name: 'Retro Synth', type: 'theme', description: '80s Retro Style.', price: 1400, icon: '🎹', purchased: false },
     { id: 'theme_sepia', name: isEn ? 'Old Notebook' : 'Deri Defter', type: 'theme', description: 'Ancient leather style.', price: 500, icon: '📜', purchased: false },
     { id: 'theme_ocean', name: isEn ? 'Ocean Blue' : 'Okyanus Mavisi', type: 'theme', description: 'Fresh blue.', price: 600, icon: '🌊', purchased: false },
     { id: 'theme_vaporwave', name: 'Vaporwave', type: 'theme', description: 'Aesthetic.', price: 1200, icon: '🌅', purchased: false },
     { id: 'theme_crimson', name: isEn ? 'Red Alert' : 'Kızıl Alarm', type: 'theme', description: 'Dangerous red.', price: 900, icon: '🚨', purchased: false },
     { id: 'theme_midnight', name: isEn ? 'Midnight' : 'Gece Yarısı', type: 'theme', description: 'Dark navy.', price: 750, icon: '🌙', purchased: false },
     { id: 'theme_solar', name: 'Solar Punk', type: 'theme', description: 'Nature & Tech.', price: 1100, icon: '🍃', purchased: false },
     { id: 'theme_blueprint', name: isEn ? 'Blueprint' : 'Mavi Kopya', type: 'theme', description: 'Technical drawing.', price: 900, icon: '📐', purchased: false },
     { id: 'theme_forest', name: isEn ? 'Deep Forest' : 'Derin Orman', type: 'theme', description: 'Green & Emerald.', price: 850, icon: '🌲', purchased: false },
     { id: 'theme_volcano', name: isEn ? 'Volcano' : 'Volkanik', type: 'theme', description: 'Magma Orange.', price: 950, icon: '🌋', purchased: false },
     { id: 'theme_royal', name: isEn ? 'Royal Gold' : 'Kraliyet Altını', type: 'theme', description: 'Purple & Gold.', price: 2000, icon: '👑', purchased: false },
     { id: 'theme_ice', name: isEn ? 'Ice Age' : 'Buz Devri', type: 'theme', description: 'Frozen Blue.', price: 800, icon: '❄️', purchased: false },
     { id: 'theme_terminal', name: isEn ? 'DOS Terminal' : 'DOS Terminali', type: 'theme', description: 'Old PC Green.', price: 1100, icon: '📟', purchased: false },
     { id: 'theme_candy', name: isEn ? 'Candy Pop' : 'Şeker Pop', type: 'theme', description: 'Pink & Sweet.', price: 700, icon: '🍭', purchased: false },
     { id: 'theme_steampunk', name: 'Steampunk', type: 'theme', description: 'Bronze & Gears.', price: 1300, icon: '⚙️', purchased: false },
     { id: 'theme_luxury', name: isEn ? 'Luxury Dark' : 'Lüks Karanlık', type: 'theme', description: 'Gold & Black.', price: 2500, icon: '💎', purchased: false },
  ];

  const casePackages: StoreItem[] = [
    { id: 'pkg_intern', name: isEn ? 'Intern File' : 'Stajyer Dosyası', type: 'case_package', description: isEn ? 'Simple crimes. Easy.' : 'Basit suçlar. Hızlı çözüm ve pratik yapmak için ideal.', price: 25, icon: '📋', purchased: false, packageDifficulty: 'easy' },
    { id: 'pkg_easy', name: isEn ? 'Street Crimes' : 'Sokak Suçları', type: 'case_package', description: isEn ? 'Local incidents.' : 'Yerel asayiş olayları. Başlangıç seviyesi.', price: 50, icon: '📂', purchased: false, packageDifficulty: 'easy' },
    { id: 'pkg_mafia', name: isEn ? 'Mafia Hit' : 'Mafya Hesaplaşması', type: 'case_package', description: isEn ? 'Underworld execution.' : 'Yeraltı dünyasında sessiz bir infaz. Tanık yok.', price: 120, icon: '🕶️', purchased: false, packageDifficulty: 'medium' },
    { id: 'pkg_med', name: isEn ? 'Secret Protocol' : 'Gizli Protokol', type: 'case_package', description: isEn ? 'Standard mystery.' : 'Standart zorlukta, detaylı ve gizemli vakalar.', price: 150, icon: '🗂️', purchased: false, packageDifficulty: 'medium' },
    { id: 'pkg_political', name: isEn ? 'Political Scandal' : 'Siyasi Skandal', type: 'case_package', description: isEn ? 'Corruption and lies.' : 'Yolsuzluk ve yalanlar. Dikkatli ol.', price: 300, icon: '🏛️', purchased: false, packageDifficulty: 'medium' },
    { id: 'pkg_spy', name: isEn ? 'Spy Network' : 'Casusluk Ağı', type: 'case_package', description: isEn ? 'State secrets.' : 'Devlet sırları ve uluslararası entrikalar.', price: 250, icon: '🛰️', purchased: false, packageDifficulty: 'medium' },
    { id: 'pkg_cold', name: isEn ? 'Cold Case (1999)' : 'Faili Meçhul (1999)', type: 'case_package', description: isEn ? 'Dusty old files.' : 'Tozlu raflardan inen, yıllardır çözülememiş lanetli dosya.', price: 400, icon: '🕸️', purchased: false, packageDifficulty: 'hard' },
    { id: 'pkg_serial', name: isEn ? 'Serial Killer' : 'Seri Katil', type: 'case_package', description: isEn ? 'City in panic.' : 'Şehirde panik yaratan bir psikopat. Profilleme yeteneği ister.', price: 600, icon: '🎭', purchased: false, packageDifficulty: 'hard' },
    { id: 'pkg_hard', name: isEn ? 'RED NOTICE' : 'KIRMIZI BÜLTEN', type: 'case_package', description: isEn ? 'Most Wanted. LEGENDARY.' : 'En çok aranan suçlular. ÇOK ZOR. Efsanevi Ödüller.', price: 1000, icon: '🚨', purchased: false, packageDifficulty: 'hard' },
  ];

  const coinPackages = [
     { id: 'coins_50', amount: 50, price: isEn ? 'WATCH AD' : 'REKLAM İZLE', icon: '📺' },
     { id: 'coins_500', amount: 500, price: '50 TL', icon: '💰' },
     { id: 'coins_1000', amount: 1000, price: '150 TL', icon: '💎' },
     { id: 'coins_5000', amount: 5000, price: '350 TL', icon: '🏆' },
  ];

  let displayItems = items;
  if (activeTab === 'themes') displayItems = themes;
  if (activeTab === 'cases') displayItems = casePackages;

  const handleRedeem = () => {
     if (redeemCode.toLowerCase() === 'semihbaba') {
        if (userProfile.isDeveloperMode) {
          // Turn OFF
          if (onToggleDevMode) onToggleDevMode(false);
          alert(isEn ? 'Developer Mode DEACTIVATED' : 'Geliştirici Modu KAPATILDI');
        } else {
          // Turn ON
          if (onBuyCoins) onBuyCoins(99999);
          if (onToggleDevMode) onToggleDevMode(true);
          alert(isEn ? 'Developer Mode ACTIVATED: +99,999 Coins & Full Energy' : 'Geliştirici Modu AÇILDI: +99,999 Jeton & Sınırsız Enerji');
        }
        setRedeemCode('');
     } else {
        alert(isEn ? 'Invalid Code' : 'Geçersiz Kod');
     }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeem();
    }
  };

  const handleWatchAd = (amount: number) => {
     setAdLoading(true);
     setTimeout(() => {
        setAdLoading(false);
        onBuyCoins && onBuyCoins(amount);
     }, 3000);
  };

  const tabClass = (tab: string) => `px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap 
    ${activeTab === tab 
       ? `${theme.button}` 
       : `bg-white/10 ${theme.text} hover:bg-white/20 opacity-70`
    }`;

  return (
    <div className={`animate-fade-in w-full h-full flex flex-col p-6 space-y-6 ${theme.text}`}>
       
       {/* HEADER & TABS */}
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              <button onClick={() => setActiveTab('items')} className={tabClass('items')}>{isEn ? 'ITEMS' : 'EŞYA'}</button>
              <button onClick={() => setActiveTab('themes')} className={tabClass('themes')}>{isEn ? 'THEMES' : 'TEMA'}</button>
              <button onClick={() => setActiveTab('cases')} className={tabClass('cases')}>{isEn ? 'CASES' : 'VAKA'}</button>
              <button onClick={() => setActiveTab('bank')} className={tabClass('bank')}>{isEn ? 'BANK' : 'KASA'}</button>
          </div>
          
          <div className={`px-4 py-2 rounded border flex items-center gap-2 ${cardBg}`}>
             <span className="opacity-70 text-xs font-bold">{isEn ? "BALANCE:" : "BAKİYE:"}</span>
             <span className={`font-mono font-bold text-lg ${theme.accent}`}>{userProfile.coins} ₵</span>
          </div>
       </div>

       {/* PROMO CODE */}
       <div className={`flex gap-2 p-2 rounded border items-center shrink-0 max-w-md ${cardBg}`}>
          <input 
             value={redeemCode} 
             onChange={e=>setRedeemCode(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder={isEn ? "Promo Code" : "Promosyon Kodu"} 
             className={`flex-1 bg-transparent text-xs focus:outline-none font-mono ${theme.text} placeholder:opacity-50`}
          />
          <button onClick={handleRedeem} className={`text-[10px] ${theme.button} px-2 py-1 rounded`}>{isEn ? "ENTER" : "GİR"}</button>
       </div>

       {/* CONTENT GRID - MODAL VIEW */}
       <div className="flex-1 overflow-y-auto pb-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === 'bank' ? (
                 coinPackages.map((pkg, idx) => (
                   <div key={idx} className={`${cardBg} p-6 rounded-xl border flex flex-col items-center justify-center gap-4 text-center hover:scale-105 transition-transform`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/10`}>
                          {pkg.icon}
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${theme.accent}`}>{pkg.amount} ₵</div>
                        </div>
                        
                       {pkg.price === (isEn ? 'WATCH AD' : 'REKLAM İZLE') ? (
                         <button 
                            onClick={() => handleWatchAd(pkg.amount)}
                            disabled={adLoading}
                            className={`w-full py-2 rounded font-bold transition-colors bg-blue-600 hover:bg-blue-500 text-white`}
                         >
                            {adLoading ? '...' : pkg.price}
                         </button>
                       ) : (
                         <button 
                            onClick={() => onBuyCoins && onBuyCoins(pkg.amount)}
                            className={`w-full py-2 rounded font-bold transition-colors bg-green-600 hover:bg-green-500 text-white`}
                         >
                            {pkg.price}
                         </button>
                       )}
                   </div>
                 ))
              ) : (
                 displayItems.map(item => {
                   const isAffordable = userProfile.coins >= item.price;
                   const isCasePackage = item.type === 'case_package';
                   const isConsumable = item.energyValue !== undefined || isCasePackage;
                   
                   const ownedInInventory = !isCasePackage && userProfile.inventory.some(i => i.id === item.id);
                   const isOwned = item.id === 'default' || (!isConsumable && ownedInInventory);
                   const isActiveTheme = item.type === 'theme' && (userProfile.activeThemeId === item.id || (!userProfile.activeThemeId && item.id === 'default'));
                   const isRedNotice = item.id === 'pkg_hard';

                   return (
                      <div key={item.id} className={`${cardBg} p-4 rounded-xl border flex flex-col relative overflow-hidden group hover:shadow-xl transition-shadow min-h-[180px] ${isRedNotice ? 'border-red-600 bg-red-950/20' : ''}`}>
                         {isRedNotice && <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1">HARDCORE</div>}
                         
                         <div className="flex items-start gap-4 mb-4">
                            <div className={`w-14 h-14 shrink-0 rounded-lg flex items-center justify-center text-3xl ${isRedNotice ? 'bg-red-900/30 text-red-500' : 'bg-white/10'}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                                <h3 className={`font-bold text-lg truncate ${isRedNotice ? 'text-red-500 font-typewriter' : theme.text}`}>{item.name}</h3>
                                <p className={`text-xs opacity-70 leading-snug mt-1`}>{item.description}</p>
                            </div>
                         </div>
                         
                         <div className="mt-auto">
                           {item.type === 'theme' ? (
                              <button 
                                 onClick={() => {
                                    if (isActiveTheme) return;
                                    if (isOwned && onEquipTheme) { onEquipTheme(item.id); } else if (!isOwned && isAffordable) { onBuyItem(item); }
                                 }}
                                 disabled={isActiveTheme || (!isOwned && !isAffordable)}
                                 className={`w-full py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2
                                    ${isActiveTheme ? 'bg-green-600 text-white cursor-default' : isOwned ? 'bg-blue-600 hover:bg-blue-500 text-white' : isAffordable ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-stone-700 text-stone-500 cursor-not-allowed'}`}
                              >
                                 {isActiveTheme ? (isEn ? "ACTIVE" : "AKTİF") : isOwned ? (isEn ? "EQUIP" : "KULLAN") : <>{item.price} ₵ {isEn ? "BUY" : "AL"}</>}
                              </button>
                           ) : (
                              <button 
                                 onClick={() => !isOwned && isAffordable && onBuyItem(item)}
                                 disabled={(isOwned && !isConsumable) || !isAffordable}
                                 className={`w-full py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2
                                    ${isOwned && !isConsumable ? 'bg-green-600/20 text-green-500 cursor-default' : isAffordable ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-stone-700 text-stone-500 cursor-not-allowed'}`}
                              >
                                 {isOwned && !isConsumable ? (isEn ? "OWNED" : "SAHİPSİN") : <>{item.price} ₵ {isEn ? "BUY" : "AL"}</>}
                              </button>
                           )}
                         </div>
                      </div>
                   );
                })
              )}
           </div>
       </div>
    </div>
  );
};

export default StoreSection;