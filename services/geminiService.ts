
import { TarotCardType } from '../types';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

let ai: any = null;

async function getAI() {
  if (!API_KEY) {
    return null;
  }
  if (!ai) {
    const { GoogleGenAI } = await import("@google/genai");
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

const FALLBACK_READINGS: Record<string, string[]> = {
  default: [
    "Les arcanes tissent un recit fascinant pour vous. Le chemin que vous empruntez est jalonné de transformations profondes. Les forces du passe vous poussent vers un renouveau inattendu. Faites confiance a votre intuition, car elle est votre meilleur guide dans cette période de changement. L'univers conspire en votre faveur, meme si le voile du mystere ne se leve que lentement. Patience et courage seront vos allies les plus precieux.",
    "Les cartes parlent d'un voyage interieur qui s'annonce revelateur. Des energies puissantes se croisent dans votre destinee, creant des opportunites la ou vous ne voyez que des obstacles. Votre passe recele la cle de votre avenir. Les astres veillent sur votre chemin et vous guidant vers une comprehension plus profonde de vous-meme. N'ayez crainte, les arcanes vous protegent.",
    "Je vois dans ce tirage une danse entre ombre et lumiere. Votre question touche a l'essence meme de votre transformation personnelle. Les arcanes revelent que vous etes a un carrefour decisif. Le courage de faire face a vos verites cachees vous menera vers une liberation attendue depuis longtemps. Les etoiles s'alignent en votre faveur.",
  ],
  deep: [
    "Les deux arcanes supplementaires eclairent d'une lumiere nouvelle votre lecture. Ce qui semblait obscur trouve maintenant sa signification. La voie se dessine plus clairement devant vous. Les forces cosmiques confirment que votre instinct premier etait le bon. Avancez avec confiance sur ce chemin que les cartes ont trace pour vous.",
    "Ces nouvelles cartes approfondissent considerablement la vision precedente. Elles revelent des couches cachees de votre destinee que les premiers arcanes ne faisaient qu'effleurer. Un message clair emerge : le moment d'agir approche. Les energies se concentrent et le changement que vous esperez se concretisera bientot.",
  ],
};

function getFallbackReading(isDeep: boolean): string {
  const pool = isDeep ? FALLBACK_READINGS.deep : FALLBACK_READINGS.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const getReading = async (cards: TarotCardType[], question: string, previousReading?: string): Promise<string> => {
  const cardNames = cards.map(c => c.name).join(', ');

  const aiInstance = await getAI();

  if (!aiInstance) {
    // No API key: return a contextual fallback reading
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    return getFallbackReading(!!previousReading);
  }
  
  let prompt: string;

  if (previousReading) {
      const previousCardNames = cards.slice(0, 4).map(c => c.name).join(', ');
      const newCardNames = cards.slice(4).map(c => c.name).join(', ');
      prompt = `Tu es une cartomancienne mystique et sage. Tu t'adresses à un consultant qui a posé la question : "${question}". La lecture précédente basée sur les cartes ${previousCardNames} était : "${previousReading}". Pour approfondir, tu as tiré deux arcanes supplémentaires : ${newCardNames}. Poursuis ta lecture en intégrant ces nouvelles cartes au récit. Révèle comment elles éclairent ou modifient la voie tracée par la question initiale. Ton ton reste mystérieux et inspirant. Ne répète pas la lecture précédente, mais continue l'histoire.`;
  } else {
      prompt = `Tu es une cartomancienne mystique et sage. Tu t'adresses à un consultant qui a posé la question suivante : "${question}". Tu viens de tirer les quatre arcanes du Tarot de Grimaud : ${cardNames}. Rédige une interprétation poétique et narrative qui lie ces quatre cartes pour répondre à sa question. Tisse une histoire globale et cohérente sur son destin en environ 100 mots. Ne décris pas les cartes individuellement.`;
  }

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: prompt,
    });
    
    if (response.text) {
        return response.text;
    }
    return getFallbackReading(!!previousReading);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return getFallbackReading(!!previousReading);
  }
};
