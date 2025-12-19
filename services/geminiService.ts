
import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Department } from '../types';

// Select models according to guidelines
const COMPLEX_MODEL = 'gemini-3-pro-preview';
const BASIC_MODEL = 'gemini-3-flash-preview';
const MAPS_MODEL = 'gemini-2.5-flash-preview'; // Maps grounding supported in 2.5 series

export const generateScenario = async (department: Department, language: 'tr' | 'en' = 'tr'): Promise<Scenario> => {
  // Initialize inside function to avoid top-level crash
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEn = language === 'en';

  let deptPrompt = "";
  let deptSchemaProps: any = {};

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
          timeOfDeath: { type: Type.STRING },
          toxicology: { type: Type.STRING },
          wounds: { type: Type.STRING },
          notes: { type: Type.STRING }
        }
      }
    };
  } else if (department === 'cyber') {
    deptPrompt = isEn ? `
      CYBER CRIMES CASE:
      Theme: Matrix / Hacker / Mr. Robot. Technical, cold, digital.
      SPECIAL: Create 'serverLogs' list.
    ` : `
      SİBER SUÇLAR VAKASI:
      Tema: Matrix / Hacker / Mr. Robot. Teknik, soğuk, dijital.
      ÖZEL İSTEK: 'serverLogs' listesi oluştur.
    `;
    deptSchemaProps = {
      serverLogs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.STRING },
            ip: { type: Type.STRING },
            action: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["SUCCESS", "FAILED", "WARNING"] }
          }
        }
      }
    };
  } else if (department === 'theft') {
    deptPrompt = isEn ? `
      THEFT / BURGLARY CASE:
      Theme: Ocean's 11 / Heist.
      SPECIAL: Create 'surveillance' timeline logs.
    ` : `
      HIRSIZLIK MASASI VAKASI:
      Tema: Ocean's 11 / Büyük Soygun.
      ÖZEL İSTEK: 'surveillance' zaman çizelgesi oluştur.
    `;
    deptSchemaProps = {
      surveillance: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            camera: { type: Type.STRING },
            observation: { type: Type.STRING }
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
    Output JSON.
  ` : `
    Sen usta bir interaktif gizem oyunusun. Benzersiz bir vaka oluştur.
    DİL: TÜRKÇE
    DEPARTMAN: ${department.toUpperCase()}
    ${deptPrompt}
    JSON formatında çıktı ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: COMPLEX_MODEL,
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
                   x: { type: Type.NUMBER },
                   y: { type: Type.NUMBER },
                   label: { type: Type.STRING },
                   type: { type: Type.STRING, enum: ['body', 'evidence', 'blood', 'entry', 'other'] },
                   description: { type: Type.STRING }
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEn = language === 'en';
  const prompt = isEn ? `
    Detective game database assistant.
    SCENARIO: ${JSON.stringify(scenario)}
    QUESTION: "${question}"
    Roleplay: Answer only with available data. Short, professional.
  ` : `
    Dedektiflik oyunu veritabanı asistanısın.
    SENARYO: ${JSON.stringify(scenario)}
    SORU: "${question}"
    Sadece verilerle cevap ver. Kısa ve net ol.
  `;

  try {
    const response = await ai.models.generateContent({
      model: BASIC_MODEL,
      contents: prompt,
    });
    return response.text?.trim() || (isEn ? "Data Error." : "Veri hatası.");
  } catch (error) {
    return isEn ? "Connection Error." : "Bağlantı hatası.";
  }
};

export const getLocationIntel = async (city: string, locationName: string, language: 'tr' | 'en' = 'tr'): Promise<{ text: string, sources?: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEn = language === 'en';
  const prompt = isEn ? `Location Intelligence: ${locationName}, ${city}. Tactics and security.` : `Konum İstihbaratı: ${locationName}, ${city}. Güvenlik ve taktik raporu.`;

  try {
    const response = await ai.models.generateContent({
      model: MAPS_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return { 
      text: response.text || (isEn ? "Intel failed." : "İstihbarat hatası."), 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    throw error;
  }
};
