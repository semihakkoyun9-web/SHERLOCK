import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Department } from '../types';

// REMOVED GLOBAL INITIALIZATION TO PREVENT CRASH ON LOAD
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// Helper to safely get AI instance
// This prevents the "API Key must be set" error from crashing the whole app on Vercel startup
const getAI = () => {
  const apiKey = process.env.API_KEY || "MISSING_KEY_PLACEHOLDER"; 
  return new GoogleGenAI({ apiKey });
};

export const generateScenario = async (department: Department, language: 'tr' | 'en' = 'tr'): Promise<Scenario> => {
  
  const isEn = language === 'en';

  let deptPrompt = "";
  let deptSchemaProps: any = {};

  // Define unique data requirements based on department
  if (department === 'homicide') {
    deptPrompt = isEn ? `
      HOMICIDE CASE:
      Theme: Noir / Dark. Serious, bloody.
      SPECIAL: Create a detailed 'autopsy' report.
      Victim: Name, age, job.
      Cause of Death: Physical trauma, poison, or weapon.
    ` : `
      CİNAYET MASASI VAKASI:
      Tema: Kara Film / Noir. Ciddi, karanlık, kanlı.
      ÖZEL İSTEK: Detaylı bir 'autopsy' (otopsi) raporu oluştur.
      Kurban: İsim, yaş, meslek.
      Ölüm Sebebi: Fiziksel travma, zehir veya silah.
    `;
    deptSchemaProps = {
      autopsy: {
        type: Type.OBJECT,
        properties: {
          timeOfDeath: { type: Type.STRING, description: isEn ? "Time of death est." : "Ölüm saati tahmini" },
          toxicology: { type: Type.STRING, description: isEn ? "Blood analysis" : "Kan değerleri ve madde analizi" },
          wounds: { type: Type.STRING, description: isEn ? "Wound analysis" : "Yara analizi" },
          notes: { type: Type.STRING, description: isEn ? "Medical examiner notes" : "Adli tabip özel notu" }
        }
      }
    };
  } else if (department === 'cyber') {
    deptPrompt = isEn ? `
      CYBER CRIMES CASE:
      Theme: Matrix / Hacker / Mr. Robot. Technical, cold, digital.
      SPECIAL: Create 'serverLogs' list.
      Victim: A "Company", "Server", or "Developer".
      Cause: Hack method (DDoS, Ransomware, Phishing).
    ` : `
      SİBER SUÇLAR VAKASI:
      Tema: Matrix / Hacker / Mr. Robot. Teknik, soğuk, dijital.
      ÖZEL İSTEK: 'serverLogs' (sunucu kayıtları) listesi oluştur. Bu loglar saldırının hikayesini anlatmalı.
      Kurban: Bir "Şirket", "Sunucu" veya "Yazılımcı".
      Ölüm Sebebi: Hack yöntemi (DDoS, Ransomware, Phishing).
    `;
    deptSchemaProps = {
      serverLogs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.STRING, description: "YYYY-MM-DD HH:MM:SS" },
            ip: { type: Type.STRING, description: "Masked IP" },
            action: { type: Type.STRING, description: "Action taken" },
            status: { type: Type.STRING, enum: ["SUCCESS", "FAILED", "WARNING"] }
          }
        }
      }
    };
  } else if (department === 'theft') {
    deptPrompt = isEn ? `
      THEFT / BURGLARY CASE:
      Theme: Ocean's 11 / Heist. Planned, time-focused.
      SPECIAL: Create 'surveillance' timeline logs.
      Victim: Museum, Bank, or Collector.
      Cause: Stolen Item.
    ` : `
      HIRSIZLIK MASASI VAKASI:
      Tema: Ocean's 11 / Büyük Soygun. Planlı, zaman odaklı.
      ÖZEL İSTEK: 'surveillance' (güvenlik kamerası) zaman çizelgesi oluştur. Hırsızın veya şüphelilerin hareketlerini parça parça göster.
      Kurban: Müze, Banka veya Koleksiyoner.
      Ölüm Sebebi: Çalınan Değerli Eser.
    `;
    deptSchemaProps = {
      surveillance: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "Time (02:15 AM)" },
            camera: { type: Type.STRING, description: "Camera Location" },
            observation: { type: Type.STRING, description: "What was seen" }
          }
        }
      }
    };
  }

  const prompt = isEn ? `
    You are a master interactive mystery game engine. Create a unique case.
    LANGUAGE: ENGLISH
    DEPARTMENT: ${department.toUpperCase()}
    ${deptPrompt}

    GENERAL RULES:
    Location: A real city and specific place.
    SUSPECTS (4 people): All have motive and alibi. One is lying (Killer).
    IMPORTANT: Fill department specific data (autopsy/serverLogs/surveillance).
    MAP: Create 'mapPoints'. One MUST be type='evidence' containing the critical clue revealing the killer.
    
    Output JSON.
  ` : `
    Sen usta bir interaktif gizem oyunusun. Aşağıdaki departman için benzersiz bir vaka oluştur.
    DİL: TÜRKÇE
    DEPARTMAN: ${department.toUpperCase()}
    ${deptPrompt}

    GENEL KURALLAR:
    Mekan: Gerçek bir şehir ve spesifik bir yer.
    ŞÜPHELİLER (4 kişi): Hepsinin güçlü motifi ve alibisi olsun. Biri yalan söylüyor (Katil/Suçlu).
    
    ÖNEMLİ: Departmana özel verileri (autopsy/serverLogs/surveillance) doldur.
    AYRICA: Olay yeri krokisi için 'mapPoints' oluştur. Bu noktalardan BİRİ (type='evidence') katilin kimliğini ele veren kritik ama gizli bir ipucu içermeli (Örn: Katilin isminin baş harfi olan bir eşya, ona ait bir aksesuar vb.).
    
    JSON formatında çıktı ver.
  `;

  try {
    // Initialize AI here (Lazy Load)
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            locationName: { type: Type.STRING },
            intro: { type: Type.STRING },
            victim: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                age: { type: Type.NUMBER },
                job: { type: Type.STRING },
                personality: { type: Type.STRING },
              }
            },
            crimeScene: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                time: { type: Type.STRING },
                deathCause: { type: Type.STRING },
              }
            },
            suspects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  name: { type: Type.STRING },
                  relation: { type: Type.STRING },
                  motive: { type: Type.STRING },
                  alibi: { type: Type.STRING },
                  isKiller: { type: Type.BOOLEAN },
                }
              }
            },
            clues: { type: Type.ARRAY, items: { type: Type.STRING } },
            mapPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                   id: { type: Type.STRING },
                   x: { type: Type.NUMBER, description: "0-100 X coord" },
                   y: { type: Type.NUMBER, description: "0-100 Y coord" },
                   label: { type: Type.STRING },
                   type: { type: Type.STRING, enum: ['body', 'evidence', 'blood', 'entry', 'other'] },
                   description: { type: Type.STRING, description: "Detail when clicked." }
                }
              }
            },
            ...deptSchemaProps
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Scenario generation failed.");
    
    return JSON.parse(text) as Scenario;
  } catch (error) {
    console.error("Scenario Error:", error);
    throw error;
  }
};

export const checkAnswerWithAI = async (scenario: Scenario, question: string, language: 'tr' | 'en' = 'tr'): Promise<string> => {
  const isEn = language === 'en';
  const prompt = isEn ? `
    You are a database assistant in a detective game.
    SCENARIO: ${JSON.stringify(scenario)}
    QUESTION: "${question}"
    
    Roleplay: Answer only with available data. No opinions.
    If asked "Who is the killer?", say "Access Denied".
    Short, professional answers.
    Use terms like "Affirmative", "Negative", "Unknown", "Not in file", "Access Denied".
  ` : `
    Sen bir dedektiflik oyununda veritabanı asistanısın.
    SENARYO: ${JSON.stringify(scenario)}
    SORU: "${question}"
    
    Rolün gereği, sadece elindeki verilerle cevap ver. Yorum yapma.
    "Katil kim?" gibi sorulara "Bu bilgiye erişiminiz yok" de.
    Kısa, net ve profesyonel cevaplar ver.
    Cevaplarında "Evet", "Hayır", "Bilinmiyor", "Dosyada yok" veya "Erişim Reddedildi" kalıplarını kullanmaya çalış.
  `;

  try {
    // Initialize AI here (Lazy Load)
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || (isEn ? "Data Error." : "Veri hatası.");
  } catch (error) {
    return isEn ? "Connection Error." : "Bağlantı hatası.";
  }
};

export const getLocationIntel = async (city: string, locationName: string, language: 'tr' | 'en' = 'tr'): Promise<{ text: string, sources?: any[] }> => {
  const isEn = language === 'en';
  const prompt = isEn ? `
    Location Intelligence: ${locationName}, ${city}.
    Provide a short, tactical report about security, entrances, and atmosphere.
    For a Detective or SWAT team.
  ` : `
    Konum İstihbaratı: ${locationName}, ${city}.
    Bu konumun güvenlik durumu, giriş-çıkış noktaları ve atmosferi hakkında kısa, taktiksel bir rapor ver.
    Dedektif veya Operasyon timi için hazırla.
  `;

  try {
    // Initialize AI here (Lazy Load)
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || (isEn ? "Intel report failed." : "İstihbarat raporu oluşturulamadı.");

    return { text, sources: groundingChunks };
  } catch (error) {
    throw error;
  }
};