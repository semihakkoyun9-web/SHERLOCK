
import { Scenario, Department, Suspect, Victim, CrimeScene, MapPoint } from '../types';

// --- RICH DATA POOLS (TURKISH) ---
const CITIES_TR = ['İstanbul', 'Ankara', 'İzmir', 'Londra', 'New York', 'Tokyo', 'Berlin', 'Paris', 'Viyana', 'Prag'];
const LOCATIONS_HOMICIDE_TR = [
  'Karaköy Limanı\'nın Terk Edilmiş 4. Hangarı', 
  'Nişantaşı\'ndaki Lüks Rezidansın Çatı Katı', 
  'Belgrad Ormanı\'nın Derinliklerindeki Avcı Kulübesi', 
  'Eski Şehir Kütüphanesi\'nin Tozlu Arşiv Odası', 
  'Sanayi Bölgesindeki Soğuk Hava Deposu', 
  'Tarihi Yarımada\'daki Restorasyon Şantiyesi',
  'Boğaz Manzaralı Yalı\'nın Kayıkhanesi'
];
const LOCATIONS_CYBER_TR = ['Merkez Bankası Veri Merkezi', 'Kripto Borsa Sunucuları', 'Askeri Araştırma Laboratuvarı Ağı', 'Uluslararası Holding Ana Sistemi', 'Yeraltı Veri Merkezi'];
const LOCATIONS_THEFT_TR = ['Kraliyet Müzesi Kasa Dairesi', 'Müzayede Evi', 'Özel Koleksiyonerin Malikanesi', 'Zırhlı Para Nakil Aracı', 'Tarihi Saray Hazinesi'];

const NAMES_MALE_TR = ['Demir', 'Kaya', 'Pars', 'Atlas', 'Kuzey', 'Baran', 'Timur', 'Sarp', 'Victor', 'Hans', 'Kenji', 'Cem', 'Ozan', 'Talat', 'Mahir'];
const NAMES_FEMALE_TR = ['Eva', 'Mia', 'Lara', 'Siren', 'Arya', 'Gece', 'Vera', 'Elena', 'Yuki', 'Isabella', 'Leyla', 'Selin', 'Defne', 'Hande'];
const SURNAMES_TR = ['Vance', 'Korhan', 'Soykan', 'Blackwood', 'Frost', 'Yaman', 'Erk', 'Moretti', 'Kovacs', 'Dubois', 'Yıldırım', 'Demirkan', 'Sancak'];
const JOBS_TR = ['Kıdemli Yazılım Mühendisi', 'Nörocerrah', 'Ünlü Bir Mimar', 'Emekli İstihbarat Subayı', 'Sanat Tarihçisi', 'Borsa Spekülatörü', 'Araştırmacı Gazeteci', 'Yeraltı Dünyası Figürü', 'Kripto Para Milyoneri', 'Biyokimya Profesörü', 'Eski Boksör', 'Kimya Mühendisi'];
const PERSONALITIES_TR = ['Aşırı titiz, kontrolcü ve detaylara takıntılı', 'Paranoyak, sürekli izlendiğini düşünüyor', 'Dışa dönük, karizmatik ama manipülatif', 'Soğukkanlı, hesapçı ve duygusuz', 'Duygusal açıdan dengesiz ve öfke nöbetlerine yatkın', 'Hırslı, acımasız ve başarı odaklı'];
const RELATIONS_TR = ['Eski İş Ortağı', 'Kardeşi', 'Rakip Firmadan Yönetici', 'Özel Asistanı', 'Çocukluk Arkadaşı', 'Avukatı', 'Eski Eşi', 'Alacaklısı'];

// --- RICH DATA POOLS (ENGLISH) ---
const CITIES_EN = ['London', 'New York', 'Tokyo', 'Berlin', 'Paris', 'Istanbul', 'Chicago', 'Los Angeles', 'Seattle', 'Rome'];
const LOCATIONS_HOMICIDE_EN = [
  'Abandoned Harbor Warehouse at the Docks', 
  'Luxury Penthouse Suite overlooking Central Park', 
  'Dark Corner of the City Arboretum', 
  'Dusty Archives of the Old Public Library', 
  'Industrial Cold Storage Facility', 
  'Subway Maintenance Room Sector 7', 
  'Foggy Docks near the old Pier', 
  'Gothic Cathedral Bell Tower', 
  'Underground VIP Casino'
];
const LOCATIONS_CYBER_EN = ['Central Bank Data Center', 'Crypto Exchange Servers', 'Military Research Lab Network', 'Global Corp Mainframe', 'Satellite Uplink Station'];
const LOCATIONS_THEFT_EN = ['Royal Museum Vault', 'High-End Auction House', 'Private Collector\'s Mansion', 'Armored Transport Truck', 'National Gallery', 'Diamond District Safe'];
const NAMES_MALE_EN = ['James', 'Arthur', 'William', 'Henry', 'Leo', 'Jack', 'Thomas', 'Alexander', 'David', 'Michael', 'Robert', 'Richard', 'Charles'];
const NAMES_FEMALE_EN = ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Isabella', 'Mia', 'Harper', 'Evelyn', 'Alice', 'Eleanor', 'Clara'];
const SURNAMES_EN = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Black', 'White', 'Holmes', 'Moriarty', 'Sterling'];
const JOBS_EN = ['Senior Software Engineer', 'Neurosurgeon', 'Famous Architect', 'Retired Intelligence Officer', 'Art Historian', 'Stock Speculator', 'Investigative Journalist', 'Underworld Figure', 'Crypto Millionaire', 'Biochemistry Professor', 'Ex-Military Contractor'];
const PERSONALITIES_EN = ['Obsessively meticulous and controlling', 'Paranoid and secretive about past', 'Extroverted, charming but highly manipulative', 'Cold-blooded, calculating and distant', 'Emotionally unstable with violent outbursts', 'Ambitious, ruthless and power-hungry'];
const RELATIONS_EN = ['Former Business Partner', 'Sibling', 'Rival Company Exec', 'Private Assistant', 'Childhood Friend', 'Lawyer', 'Ex-Spouse', 'Major Creditor'];


// --- NARRATIVE TEMPLATES ---

const INTRO_TEMPLATES_TR = {
  homicide: [
    "Gece yarısını vuran saat kulesinin çanları, {city}'nin karanlık sokaklarında yankılanırken, {location} civarından gelen bir çığlık sessizliği yırttı. Olay yerine intikal eden ekipler, şehrin tanınmış simalarından {victim}'in cansız bedeniyle karşılaştı. Hava barut ve yağmur kokuyordu. Maktulün etrafındaki deliller, bunun basit bir soygun olmadığını, planlı ve soğukkanlı bir infaz olduğunu haykırıyordu.",
    "{city}'nin üzerine çöken yoğun sis, {location} bölgesini adeta bir hayalet kasabaya çevirmişti. Devriye gezen bekçilerin el feneri, {victim}'in kanlar içindeki bedenini aydınlattığında saatler 03:00'ü gösteriyordu. Maktul, son nefesini verirken katiliyle göz göze gelmiş olmalıydı. Olay yerindeki karmaşa, bir boğuşmanın yaşandığını gösterse de, katil arkasında çok az iz bırakacak kadar profesyoneldi.",
    "Fırtınalı bir gecede, {location} ölümcül bir sessizliğe gömülmüştü. Şimşekler gökyüzünü yardığında, {victim}'in yerde yatan bedeni kısa bir anlığına aydınlandı. Polis kordonu çekildiğinde, dedektifler bunun sıradan bir cinayet olmadığını hemen anladı. Maktulün yüzündeki donuk ifade ve olay yerindeki garip semboller, bu vakanın arkasında karanlık bir sırrın yattığına işaret ediyordu."
  ],
  cyber: [
    "{city} Finans Merkezi'nde kaos hakim. {location} sistemlerine yapılan siber saldırı, sadece verileri çalmakla kalmadı, tüm güvenlik protokollerini yerle bir etti. Hedefteki isim {victim}, dijital dünyanın kilit isimlerinden biriydi. Saldırganlar, arkalarında 'Hayalet Protokol' imzalı şifreli bir mesaj bırakarak sistemin kontrolünü ele geçirdi.",
    "Dünya borsaları açılmadan hemen önce, {location} ağlarında tespit edilen anomali kısa sürede felakete dönüştü. 'Phantom' kod adlı, daha önce hiç görülmemiş bir malware, {victim} tarafından yönetilen çok gizli veritabanını saniyeler içinde şifreledi. Saldırının kaynağı belirsiz, ancak içeriden birinin yardım etmiş olma ihtimali çok yüksek.",
  ],
  theft: [
    "{city}'nin en korunaklı kalesi olarak bilinen {location}, bu sabah tarihinin en büyük ve en sessiz soygununa uyandı. Lazer sensörleri, basınç dedektörleri ve retina tarayıcıları... Hiçbiri alarm vermedi. {victim} koleksiyonuna ait paha biçilemez eser, yerinde yeller eserken bulundu.",
  ]
};

const INTRO_TEMPLATES_EN = {
  homicide: [
    "As the clock tower bells struck midnight echoing through the dark streets of {city}, a scream tore through the silence near {location}. Arriving units found the lifeless body of {victim}, a prominent local figure. The air smelled of gunpowder and rain. The evidence surrounding the victim screamed that this was no simple robbery, but a cold-blooded, calculated execution.",
    "The dense fog settling over {city} had turned {location} into a ghost town. When the patrol guards' flashlights illuminated {victim}'s bloodied body, it was 03:00 AM. The victim must have looked their killer in the eye while taking their last breath. The chaos at the scene suggested a struggle, but the killer was professional enough to leave very few traces behind.",
    "On a stormy night, {location} was buried in a deadly silence. When lightning tore through the sky, {victim}'s body lying on the ground was illuminated for a brief second. As the police tape was drawn, detectives immediately realized this was no ordinary murder. The frozen expression on the victim's face and strange symbols at the scene pointed to a dark secret behind this case."
  ],
  cyber: [
    "Chaos reigns in the {city} Financial Center. A massive cyber attack on {location} systems not only stole sensitive data but destroyed all security protocols. The target, {victim}, was a key figure in the digital world. The attackers seized control of the system, leaving behind an encrypted message signed 'Ghost Protocol'.",
    "Just before world markets opened, an anomaly detected in {location} networks turned into a disaster within seconds. A malware codenamed 'Phantom', never seen before, encrypted the top-secret database managed by {victim}. The source of the attack is unclear, but the probability of an insider threat is extremely high.",
  ],
  theft: [
    "Known as the most secure fortress in {city}, {location} woke up this morning to the biggest and quietest heist in its history. Laser sensors, pressure detectors, and retina scanners... None of them triggered an alarm. A priceless artifact from the {victim} collection was gone without a trace.",
  ]
};

const MOTIVE_TEMPLATES_TR = [
  "{victim} ile geçmişte ortak bir şirket kurmuşlardı, ancak maktul sahte evraklarla onu dolandırarak tüm hisselerine el koydu ve onu iflasa sürükledi.",
  "Maktulün kasasında, şüphelinin tüm kariyerini ve itibarını bitirebilecek gizli video kayıtları ve şantaj dosyaları bulunuyordu.",
  "Yasak bir aşk ilişkisi yaşıyorlardı. {victim} bu ilişkiyi eşine ve basına açıklamakla tehdit edince işler kontrolden çıktı.",
  "Miras paylaşımı konusunda {victim} ile yıllardır süren kanlı bıçaklı bir davaları vardı. Kaybeden her şeyini yitirecekti.",
  "Maktul, şüphelinin yasadışı kumar borçlarını ve tefecilerle olan bağlantılarını polise ihbar etmek üzereydi.",
  "Akademik bir çalışma üzerindeki hırsızlık iddiası aralarındaki dostluğu nefrete dönüştürmüştü. Şüpheli, fikrinin çalındığını iddia ediyordu."
];

const MOTIVE_TEMPLATES_EN = [
  "They had founded a company together in the past, but the victim defrauded them with forged documents, seizing all shares and driving them to bankruptcy.",
  "In the victim's safe, there were secret video recordings and blackmail files that could ruin the suspect's entire career and reputation.",
  "They were having a forbidden affair. When {victim} threatened to reveal this relationship to their spouse and the press, things spiraled out of control.",
  "They had a bitter lawsuit with {victim} over inheritance distribution for years. The loser would lose everything.",
  "The victim was about to report the suspect's illegal gambling debts and connections with loan sharks to the police.",
  "An allegation of theft over an academic study turned their friendship into hatred. The suspect claimed their idea was stolen."
];

const CLUE_TEMPLATES_TR = {
  homicide: [
    "Yerde, maktulün avucunda sıkıca tuttuğu kopmuş bir gömlek düğmesi.",
    "Çamurlu zeminde, özellikle sol topuğu aşınmış 43 numara bir ayakkabı izi.",
    "Kırılmış ve bataryası çıkarılmış bir cep telefonu.",
    "Darbe anında durmuş, camı kırık pahalı bir kol saati.",
    "Üzerinde baş harfler kazınmış gümüş bir çakmak.",
    "Maktulün cebinde bulunan, kanla lekelenmiş buruşturulmuş bir not.",
    "Olay yerinin yakınındaki çöp kutusuna atılmış lateks eldivenler."
  ],
  cyber: [
    "Sunucu odasının zeminine düşmüş, yüksek güvenlikli şifreli bir USB bellek.",
    "Güvenlik duvarı loglarında, gece yarısı yapılan yetkisiz giriş denemesi.",
    "Çöp kutusunda bulunan parçalanmış sabit disk parçaları.",
    "Sistem yöneticisinin klavyesinde tespit edilen yabancı parmak izi.",
    "Saldırganın kodu içine gizlediği alaycı bir metin dosyası."
  ],
  theft: [
    "Havalandırma ızgarasına takılmış siyah kumaş parçası.",
    "Güvenlik kamerasının lensine sıkılmış siyah sprey boya.",
    "Kasanın yanına düşmüş, kopyalanmış bir parmak izi kalıbı.",
    "Personel girişinde kullanılan sahte bir kimlik kartı.",
    "Vitrin camını kesmek için kullanılan elmas uçlu alet."
  ]
};

const CLUE_TEMPLATES_EN = {
  homicide: [
    "A torn shirt button tightly clutched in the victim's palm.",
    "A size 43 shoe print in the muddy ground, with a distinctively worn left heel.",
    "A smashed cell phone with its battery removed.",
    "An expensive wristwatch with shattered glass, stopped exactly at the time of impact.",
    "A silver lighter engraved with initials.",
    "A crumpled, blood-stained note found in the victim's pocket.",
    "Latex gloves discarded in a trash bin near the crime scene."
  ],
  cyber: [
    "A high-security encrypted USB drive dropped on the server room floor.",
    "Unauthorized access attempts in firewall logs recorded at midnight.",
    "Shattered hard drive fragments found in the waste bin.",
    "Foreign fingerprint detected on the system administrator's keyboard.",
    "A mocking text file hidden within the attacker's code."
  ],
  theft: [
    "A piece of black fabric snagged on the ventilation grate.",
    "Black spray paint covering the security camera lens.",
    "A cloned fingerprint mold dropped near the safe.",
    "A fake ID card used at the staff entrance.",
    "A diamond-tipped tool used to cut the display glass."
  ]
};

// --- HELPERS ---

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getMultipleRandom = <T>(arr: T[], num: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

// --- GENERATOR LOGIC ---

export const generateOfflineScenario = (dept: Department, language: 'tr' | 'en' = 'tr'): Scenario => {
  const isEn = language === 'en';
  
  // Select Data Pools based on Language
  const CITIES = isEn ? CITIES_EN : CITIES_TR;
  const LOCATIONS_HOMICIDE = isEn ? LOCATIONS_HOMICIDE_EN : LOCATIONS_HOMICIDE_TR;
  const LOCATIONS_CYBER = isEn ? LOCATIONS_CYBER_EN : LOCATIONS_CYBER_TR;
  const LOCATIONS_THEFT = isEn ? LOCATIONS_THEFT_EN : LOCATIONS_THEFT_TR;
  const NAMES_MALE = isEn ? NAMES_MALE_EN : NAMES_MALE_TR;
  const NAMES_FEMALE = isEn ? NAMES_FEMALE_EN : NAMES_FEMALE_TR;
  const SURNAMES = isEn ? SURNAMES_EN : SURNAMES_TR;
  const JOBS = isEn ? JOBS_EN : JOBS_TR;
  const PERSONALITIES = isEn ? PERSONALITIES_EN : PERSONALITIES_TR;
  const RELATIONS = isEn ? RELATIONS_EN : RELATIONS_TR;
  const MOTIVE_TEMPLATES = isEn ? MOTIVE_TEMPLATES_EN : MOTIVE_TEMPLATES_TR;
  const CLUE_TEMPLATES = isEn ? CLUE_TEMPLATES_EN : CLUE_TEMPLATES_TR;
  const INTRO_TEMPLATES = isEn ? INTRO_TEMPLATES_EN : INTRO_TEMPLATES_TR;

  const getName = () => `${getRandom(NAMES_MALE.concat(NAMES_FEMALE))} ${getRandom(SURNAMES)}`;

  const city = getRandom(CITIES);
  const location = getRandom(dept === 'homicide' ? LOCATIONS_HOMICIDE : dept === 'cyber' ? LOCATIONS_CYBER : LOCATIONS_THEFT);
  
  const victimName = getName();
  const victim: Victim = {
    name: victimName,
    age: 25 + Math.floor(Math.random() * 45),
    job: getRandom(JOBS),
    personality: getRandom(PERSONALITIES)
  };

  const suspectNames = Array.from({ length: 4 }).map(() => getName());
  
  // ALIBI POOLS
  const innocentAlibisTR = [
    "Olay saatinde şehir dışındaydım, uçak biletim var.",
    "Evde eşimle film izliyorduk, komşular da gördü.",
    "Ofiste fazla mesai yapıyordum, güvenlik kamerası kayıtları var.",
    "Hastanedeydim, acil serviste nöbetçiydim.",
    "Arkadaşlarımla barda maç izliyorduk, garson şahidim.",
    "Evde uyuyordum, ama telefonumun GPS geçmişi evde olduğumu gösteriyor."
  ];

  const innocentAlibisEN = [
    "I was out of town at the time, I have a plane ticket.",
    "I was watching a movie at home with my spouse, neighbors saw us.",
    "I was working overtime at the office, there are CCTV recordings.",
    "I was at the hospital, on duty in the ER.",
    "I was watching the game at a bar with friends, the waiter is my witness.",
    "I was sleeping at home, but my phone's GPS history shows I was there."
  ];

  const killerAlibisTR = [
    "Bütün gece evde tek başıma kitap okudum. Kimse görmedi ama yemin ederim çıkmadım.",
    "Erkenden yattım, telefonumu da kapatmıştım. Hiçbir şeyden haberim yok.",
    "O saatte sahilde tek başıma yürüyüş yapıyordum, kafamı dağıtmam gerekiyordu.",
    "Arabamla şehir turu atıyordum, durup kimseyle konuşmadım.",
    "Maktulü en son geçen hafta gördüm, olay günü yanına bile yaklaşmadım."
  ];

  const killerAlibisEN = [
    "I was reading a book alone at home all night. No one saw me, but I swear I didn't leave.",
    "I went to bed early and turned off my phone. I know nothing.",
    "I was taking a walk alone on the beach at that hour, needed to clear my head.",
    "I was driving around the city, didn't stop to talk to anyone.",
    "I last saw the victim last week, I didn't even go near them on the day of the incident."
  ];

  const suspects: Suspect[] = suspectNames.map((name, i) => ({
    id: i + 1,
    name: name,
    relation: getRandom(RELATIONS),
    motive: getRandom(MOTIVE_TEMPLATES).replace('{victim}', victimName),
    alibi: isEn ? getRandom(innocentAlibisEN) : getRandom(innocentAlibisTR),
    isKiller: false
  }));

  const killerIndex = Math.floor(Math.random() * 4);
  suspects[killerIndex].isKiller = true;
  suspects[killerIndex].alibi = isEn ? getRandom(killerAlibisEN) : getRandom(killerAlibisTR);
  
  const killerName = suspects[killerIndex].name;
  const killerFirstInitial = killerName.charAt(0);
  const killerLastName = killerName.split(' ')[1];

  // Killer Clues - Logic: Specific item linking to the killer
  const killerClues = isEn ? [
    { type: 'evidence', label: 'Key Ring', description: `A silver key ring found in the mud. It is engraved with the letter '${killerFirstInitial}'.` },
    { type: 'evidence', label: 'Access Card', description: `A visitor card dropped under the table. It reads '${killerLastName.toUpperCase()}'.` },
    { type: 'evidence', label: 'Prescription Bottle', description: `A pill bottle for anxiety medication, prescribed to '${killerName}'.` },
    { type: 'evidence', label: 'Torn Fabric', description: `A piece of distinctive red silk fabric torn from a jacket.` }, // Needs connection
    { type: 'evidence', label: 'Parking Ticket', description: `A parking receipt stamped 02:00 AM, belonging to a car registered to ${killerName}.` },
  ] : [
    { type: 'evidence', label: 'Anahtarlık', description: `Çamurun içine gömülmüş gümüş bir anahtarlık. Üzerinde '${killerFirstInitial}' harfi kazınmış.` },
    { type: 'evidence', label: 'Erişim Kartı', description: `Masanın altına düşmüş bir ziyaretçi kartı. Üzerinde '${killerLastName.toUpperCase()}' yazıyor.` },
    { type: 'evidence', label: 'İlaç Kutusu', description: `Reçeteli bir sakinleştirici kutusu. Hasta adı kısmında '${killerName}' yazıyor.` },
    { type: 'evidence', label: 'Yırtık Kumaş', description: `Yırtılmış, kırmızı ipek bir kumaş parçası. Şüphelinin kıyafetinden kopmuş olabilir.` },
    { type: 'evidence', label: 'Otopark Fişi', description: `Saat 02:00 damgalı bir otopark fişi. Plaka sorgusu ${killerName}'e ait aracı işaret ediyor.` },
  ];
  
  const selectedKillerClue = getRandom(killerClues);

  // If clue is fabric, update description of suspect to match (Simulation)
  // Since we don't have visual avatars, we rely on the name/text match.

  const mapPoints: MapPoint[] = [
    { id: 'mp1', x: 50, y: 50, label: dept === 'cyber' ? (isEn ? 'Main Server' : 'Ana Sunucu') : (isEn ? 'Victim Body' : 'Maktul Bedeni'), type: 'body', description: isEn ? 'The victim was found here. Signs of struggle evident.' : 'Maktul burada bulundu. Boğuşma izleri belirgin.' },
    { id: 'mp2', x: 20, y: 80, label: isEn ? 'Entrance' : 'Giriş Kapısı', type: 'entry', description: isEn ? 'No signs of forced entry. The killer had access.' : 'Zorlama izi yok. Katil anahtara veya şifreye sahipti.' },
    { id: 'mp3', x: 75, y: 35, label: isEn ? 'Hidden Clue' : 'Gizli Kanıt', type: 'evidence', description: selectedKillerClue.description },
    { id: 'mp4', x: 30, y: 20, label: isEn ? 'Blood Spatter' : 'Kan İzi', type: 'blood', description: isEn ? 'High velocity blood spatter on the wall indicating impact direction.' : 'Duvarda darbe yönünü gösteren yüksek hızlı kan sıçraması.' },
  ];

  const introTemplate = getRandom(INTRO_TEMPLATES[dept]);
  const intro = introTemplate
    .replace('{city}', city)
    .replace('{location}', location)
    .replace('{victim}', victimName);

  const clues = getMultipleRandom(CLUE_TEMPLATES[dept], 4);
  const time = `${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`;
  
  let crimeScene: CrimeScene = { description: '', time, deathCause: '' };
  let extraData: any = {};

  if (dept === 'homicide') {
    const causes = isEn ? ['Cyanide Poisoning', 'Gunshot (9mm)', 'Blunt Trauma', 'Stabbing to the heart'] : ['Siyanür Zehirlenmesi', 'Ateşli Silah (9mm)', 'Künt Travma', 'Kalbe Saplanan Bıçak'];
    const cause = getRandom(causes);
    
    crimeScene = {
      description: isEn ? `Victim found in a contorted position. Rigor mortis suggests death occurred hours ago.` : `Maktul doğal olmayan bir pozisyonda bulundu. Ölü katılığının (Rigor Mortis) başlaması, ölümün saatler önce gerçekleştiğini gösteriyor.`,
      time: time,
      deathCause: cause
    };
    extraData.autopsy = {
      timeOfDeath: `${time} (±45 min)`,
      toxicology: isEn ? 'Clean, except for high cortisol levels indicating stress.' : 'Temiz. Ancak yüksek kortizol seviyesi, ölüm anında aşırı stres altında olduğunu gösteriyor.',
      wounds: isEn ? 'Defensive wounds on forearms. Fatal blow was sudden.' : 'Önkollarda savunma yaraları var. Ölümcül darbe ani ve kesinmiş.',
      notes: isEn ? 'Killer was likely right-handed based on wound angle.' : 'Yara açısına göre katilin sağ elini kullandığı tahmin ediliyor.'
    };
  } else if (dept === 'cyber') {
    const cause = isEn ? 'Ransomware Encryption (AES-256)' : 'Fidye Yazılımı Şifrelemesi (AES-256)';
    crimeScene = { description: isEn ? 'Server room temperature elevated. Emergency cooling active. Physical breach confirmed.' : 'Sunucu odası sıcaklığı artmış. Acil durum soğutması devrede. Fiziksel ihlal doğrulandı.', time, deathCause: cause };
    extraData.serverLogs = [
       { timestamp: '23:55:00', ip: 'INTERNAL_NET', action: 'Door Unlock', status: 'SUCCESS' },
       { timestamp: '23:58:12', ip: '192.168.1.X', action: 'Admin Login', status: 'SUCCESS' },
       { timestamp: '00:05:00', ip: 'Unknown_Proxy', action: 'Data Exfiltration', status: 'WARNING' }
    ];
  } else if (dept === 'theft') {
    const item = isEn ? 'The Star of the East Diamond' : 'Doğunun Yıldızı Elması';
    crimeScene = { description: isEn ? 'Vault titanium bars cut with thermal lance. Professional job.' : 'Kasanın titanyum çubukları termal mızrakla kesilmiş. Profesyonel bir iş.', time, deathCause: item };
    extraData.surveillance = [
       { time: '02:14', camera: 'C-14 Hallway', observation: 'Looping footage detected' },
       { time: '02:30', camera: 'Vault Interior', observation: 'Blackout for 3 minutes' }
    ];
  }

  return {
    city,
    locationName: location,
    victim,
    crimeScene,
    suspects,
    clues,
    intro,
    mapPoints,
    ...extraData
  };
};

export const checkOfflineAnswer = (scenario: Scenario, question: string, language: 'tr' | 'en' = 'tr'): string => {
  const isEn = language === 'en';
  const q = question.toLowerCase();
  
  if (q.includes('katil') || q.includes('killer') || q.includes('who')) {
    return isEn ? "ACCESS DENIED (LEVEL 5 SECURITY). Please verify suspects against physical evidence." : "BU BİLGİYE ERİŞİM YETKİNİZ YOK (5. SEVİYE GÜVENLİK). Lütfen şüphelileri fiziksel kanıtlarla karşılaştırın.";
  }
  
  if (q.includes('ceset') || q.includes('body') || q.includes('autopsy') || q.includes('otopsi')) {
     return isEn ? `AUTOPSY REPORT: ${scenario.crimeScene.description} Cause of Death: ${scenario.crimeScene.deathCause}.` : `OTOPSİ RAPORU: ${scenario.crimeScene.description} Ölüm Sebebi: ${scenario.crimeScene.deathCause}.`;
  }
  
  if (q.includes('motif') || q.includes('motive') || q.includes('why')) {
     return isEn ? "DATABASE: All suspects had sufficient motive. Cross-reference alibis with timestamps." : "VERİTABANI: Tüm şüphelilerin yeterli motifi bulunuyor. Alibileri zaman damgalarıyla karşılaştırın.";
  }

  const mentionedSuspect = scenario.suspects.find(s => q.includes(s.name.toLowerCase()));
  if (mentionedSuspect) {
    if (q.includes('alibi') || q.includes('nerede') || q.includes('where')) return isEn ? `STATEMENT (${mentionedSuspect.name}): "${mentionedSuspect.alibi}"` : `İFADE TUTANAĞI (${mentionedSuspect.name}): "${mentionedSuspect.alibi}"`;
    return isEn ? `INTELLIGENCE FILE (${mentionedSuspect.name}): Motive: ${mentionedSuspect.motive}` : `İSTİHBARAT DOSYASI (${mentionedSuspect.name}): Motif: ${mentionedSuspect.motive}`;
  }

  return isEn ? "QUERY UNCLEAR. Use specific keywords: 'Autopsy', 'Alibi', 'Suspect Name', 'Motive'." : "SORGU ANLAŞILAMADI. Anahtar kelimeler kullanın: 'Otopsi', 'Alibi', 'Şüpheli Adı', 'Motif'.";
};
