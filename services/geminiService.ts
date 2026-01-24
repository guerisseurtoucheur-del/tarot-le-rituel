
import { GoogleGenAI } from "@google/genai";
import { TarotCardType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getReading = async (cards: TarotCardType[], previousReading?: string): Promise<string> => {
  const cardNames = cards.map(c => c.name).join(', ');
  
  let prompt: string;

  if (previousReading) {
      const previousCardNames = cards.slice(0, 4).map(c => c.name).join(', ');
      const newCardNames = cards.slice(4).map(c => c.name).join(', ');
      prompt = `Tu es une cartomancienne mystique et sage. Tu t'adresses à un consultant en quête de réponses. La lecture précédente basée sur les cartes ${previousCardNames} était : "${previousReading}". Le consultant a souhaité approfondir son destin et tu as tiré deux arcanes supplémentaires : ${newCardNames}. Poursuis ta lecture en intégrant ces nouvelles cartes au récit. Révèle comment elles éclairent ou modifient la voie qui a été tracée. Ton ton reste mystérieux et inspirant. Ne répète pas la lecture précédente, mais continue l'histoire.`;
  } else {
      prompt = `Tu es une cartomancienne mystique et sage. Tu t'adresses à un consultant en quête de réponses. Tu viens de tirer les quatre arcanes suivants du Tarot de Grimaud : ${cardNames}. Rédige une interprétation poétique et narrative qui lie ces quatre cartes ensemble en un seul récit cohérent. Ne décris pas les cartes individuellement, mais tisse une histoire globale sur le destin du consultant en environ 100 mots.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    if (response.text) {
        return response.text;
    }
    return "Les esprits sont silencieux pour le moment.";

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Une interférence a brouillé la vision. Veuillez réessayer.";
  }
};
