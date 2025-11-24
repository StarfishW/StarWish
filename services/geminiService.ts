import { GoogleGenAI, Type } from "@google/genai";
import { AiResponseSchema, Language } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBlessing = async (wish: string, language: Language): Promise<string> => {
  if (!apiKey) {
    return language === 'zh' 
      ? "星空此刻静默（缺少 API Key）。但你的愿望已被听见。" 
      : "The stars are silent today (Missing API Key). But your wish is heard.";
  }

  try {
    const languageInstruction = language === 'zh' 
      ? "Reply in Chinese (Simplified). The tone should be ancient Chinese poetic, warm, and philosophical (Chengyu or poetic style)."
      : "Reply in English. The tone should be ethereal, warm, and hopeful.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User wish: "${wish}". 
      
      Act as a mystical, benevolent spirit of the stars. 
      Provide a short, poetic, and encouraging blessing or interpretation of this wish. 
      ${languageInstruction}
      Keep it under 40 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blessing: {
              type: Type.STRING,
              description: "The poetic blessing response."
            },
            mood: {
                type: Type.STRING,
                description: "The emotional tone of the wish."
            }
          },
          required: ["blessing"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return language === 'zh' ? "群星闪烁，以此致意。" : "The stars twinkle in acknowledgement.";
    
    const parsed = JSON.parse(jsonText) as AiResponseSchema;
    return parsed.blessing;

  } catch (error) {
    console.error("Error generating blessing:", error);
    return language === 'zh' 
      ? "你的愿望已融入星河，带着希望远航。" 
      : "Your wish has been released into the galaxy, carrying your hopes with it.";
  }
};
