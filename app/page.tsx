"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Types ─── */
interface TarotCard {
  name: string;
  imageUrl: string;
}

const DECK: TarotCard[] = [
  { name: "Le Bateleur", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jean_Dodali_I_Le_Bateleur.jpg/400px-Jean_Dodali_I_Le_Bateleur.jpg" },
  { name: "La Papesse", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Jean_Dodali_II_La_Papesse.jpg/400px-Jean_Dodali_II_La_Papesse.jpg" },
  { name: "L'Imperatrice", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Jean_Dodali_III_L%27Imp%C3%A9ratrice.jpg/400px-Jean_Dodali_III_L%27Imp%C3%A9ratrice.jpg" },
  { name: "L'Empereur", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jean_Dodali_IIII_L%27Empereur.jpg/400px-Jean_Dodali_IIII_L%27Empereur.jpg" },
  { name: "Le Pape", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Jean_Dodali_V_Le_Pape.jpg/400px-Jean_Dodali_V_Le_Pape.jpg" },
  { name: "L'Amoureux", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jean_Dodali_VI_L%27Amoureux.jpg/400px-Jean_Dodali_VI_L%27Amoureux.jpg" },
  { name: "Le Chariot", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Jean_Dodali_VII_Le_Chariot.jpg/400px-Jean_Dodali_VII_Le_Chariot.jpg" },
  { name: "La Justice", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Jean_Dodali_VIII_La_Justice.jpg/400px-Jean_Dodali_VIII_La_Justice.jpg" },
  { name: "L'Hermite", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Jean_Dodali_VIIII_L%27Hermite.jpg/400px-Jean_Dodali_VIIII_L%27Hermite.jpg" },
  { name: "La Roue de Fortune", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Jean_Dodali_X_La_Roue_de_Fortune.jpg/400px-Jean_Dodali_X_La_Roue_de_Fortune.jpg" },
  { name: "La Force", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Jean_Dodali_XI_La_Force.jpg/400px-Jean_Dodali_XI_La_Force.jpg" },
  { name: "Le Pendu", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Jean_Dodali_XII_Le_Pendu.jpg/400px-Jean_Dodali_XII_Le_Pendu.jpg" },
  { name: "L'Arcane sans nom", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Jean_Dodali_XIII.jpg/400px-Jean_Dodali_XIII.jpg" },
  { name: "Temperance", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Jean_Dodali_XIIII_Temp%C3%A9rance.jpg/400px-Jean_Dodali_XIIII_Temp%C3%A9rance.jpg" },
  { name: "Le Diable", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jean_Dodali_XV_Le_Diable.jpg/400px-Jean_Dodali_XV_Le_Diable.jpg" },
  { name: "La Maison Dieu", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Jean_Dodali_XVI_La_Maison_Dieu.jpg/400px-Jean_Dodali_XVI_La_Maison_Dieu.jpg" },
  { name: "L'Etoile", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Jean_Dodali_XVII_L%27%C3%89toile.jpg/400px-Jean_Dodali_XVII_L%27%C3%89toile.jpg" },
  { name: "La Lune", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Jean_Dodali_XVIII_La_Lune.jpg/400px-Jean_Dodali_XVIII_La_Lune.jpg" },
  { name: "Le Soleil", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jean_Dodali_XVIIII_Le_Soleil.jpg/400px-Jean_Dodali_XVIIII_Le_Soleil.jpg" },
  { name: "Le Jugement", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Jean_Dodali_XX_Le_Jugement.jpg/400px-Jean_Dodali_XX_Le_Jugement.jpg" },
  { name: "Le Monde", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Jean_Dodali_XXI_Le_Monde.jpg/400px-Jean_Dodali_XXI_Le_Monde.jpg" },
  { name: "Le Mat", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jean_Dodali_Le_Mat.jpg/400px-Jean_Dodali_Le_Mat.jpg" },
];

const READINGS = [
  "Les arcanes tissent un recit fascinant pour vous. Le chemin que vous empruntez est jalonne de transformations profondes. Les forces du passe vous poussent vers un renouveau inattendu. Faites confiance a votre intuition, car elle est votre meilleur guide dans cette periode de changement. L'univers conspire en votre faveur, meme si le voile du mystere ne se leve que lentement.",
  "Les cartes parlent d'un voyage interieur qui s'annonce revelateur. Des energies puissantes se croisent dans votre destinee, creant des opportunites la ou vous ne voyez que des obstacles. Les astres veillent sur votre chemin et vous guident vers une comprehension plus profonde de vous-meme.",
  "Je vois dans ce tirage une danse entre ombre et lumiere. Votre question touche a l'essence meme de votre transformation personnelle. Les arcanes revelent que vous etes a un carrefour decisif. Le courage de faire face a vos verites cachees vous menera vers une liberation attendue depuis longtemps.",
  "Le destin murmure a travers ces cartes... Une periode de renouveau s'ouvre devant vous. Les epreuves recentes n'etaient que des preparatifs pour ce qui vient. Votre force interieure brille plus que jamais et les arcanes confirment que vous etes sur la bonne voie. Laissez-vous porter par le courant cosmique.",
];

const DEEP_READINGS = [
  "Ces deux arcanes supplementaires eclairent d'une lumiere nouvelle votre lecture. Ce qui semblait obscur trouve maintenant sa signification. La voie se dessine plus clairement devant vous. Avancez avec confiance sur ce chemin que les cartes ont trace pour vous.",
  "Les nouvelles cartes approfondissent la vision precedente. Elles revelent des couches cachees de votre destinee. Un message clair emerge : le moment d'agir approche. Les energies se concentrent et le changement que vous esperez se concretisera bientot.",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Phases ─── */
type Phase = "welcome" | "question" | "shuffle" | "pick" | "reading" | "deepen-pick" | "deep-reading" | "final";

/* ─── CSS animations via <style> ─── */
const ANIM_CSS = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes glow { 0%, 100% { box-shadow: 0 0 15px rgba(212,175,55,0.3); } 50% { box-shadow: 0 0 35px rgba(212,175,55,0.6); } }
@keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes cardFlip { 0% { transform: rotateY(0deg); } 50% { transform: rotateY(90deg); } 100% { transform: rotateY(0deg); } }
@keyframes typing { from { width: 0; } to { width: 100%; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes particle { 0% { transform: translateY(0) scale(1); opacity: 0.8; } 100% { transform: translateY(-100vh) scale(0); opacity: 0; } }
.animate-in { animation: fadeIn 0.8s ease-out forwards; }
.animate-glow { animation: glow 2s ease-in-out infinite; }
.animate-flicker { animation: flicker 3s ease-in-out infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
`;

/* ─── Typewriter Hook ─── */
function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { displayed, done };
}

/* ─── Particle BG ─── */
function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      size: 2 + Math.random() * 3,
    }))
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: -10,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "rgba(212,175,55,0.5)",
            animation: `particle ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Card Back SVG ─── */
function CardBack() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(135deg, #1a0a2e 0%, #0d0d2b 50%, #1a0a2e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "2px solid rgba(212,175,55,0.4)", borderRadius: 8,
    }}>
      <div style={{
        width: "70%", height: "80%",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 8,
      }}>
        <div style={{ fontSize: 28, color: "#d4af37" }}>&#9733;</div>
        <div style={{ fontSize: 10, color: "rgba(212,175,55,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>Tarot</div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Page() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [question, setQuestion] = useState("");
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [picked, setPicked] = useState<TarotCard[]>([]);
  const [deepPicked, setDeepPicked] = useState<TarotCard[]>([]);
  const [reading, setReading] = useState("");
  const [deepReading, setDeepReading] = useState("");
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [fadeClass, setFadeClass] = useState("animate-in");
  const questionRef = useRef<HTMLInputElement>(null);

  const typewriter = useTypewriter(phase === "reading" ? reading : phase === "deep-reading" ? deepReading : "", 25);

  const transitionTo = useCallback((next: Phase, delayMs = 0) => {
    setFadeClass("");
    setTimeout(() => {
      setPhase(next);
      setFadeClass("animate-in");
    }, delayMs || 400);
  }, []);

  const handleStart = () => transitionTo("question");

  const handleQuestionSubmit = () => {
    if (!question.trim()) return;
    setShuffledDeck(shuffle(DECK));
    transitionTo("shuffle");
    setTimeout(() => {
      setShuffledDeck(shuffle(DECK));
      transitionTo("pick");
    }, 2500);
  };

  const handlePickCard = (idx: number) => {
    const card = shuffledDeck[idx];
    if (picked.find((c) => c.name === card.name)) return;
    if (picked.length >= 4) return;
    const newPicked = [...picked, card];
    setFlippedCards(new Set([...flippedCards, idx]));
    setPicked(newPicked);
    if (newPicked.length === 4) {
      const r = READINGS[Math.floor(Math.random() * READINGS.length)];
      setReading(r);
      setTimeout(() => transitionTo("reading"), 1200);
    }
  };

  const handleDeepen = () => {
    const remaining = shuffledDeck.filter((c) => !picked.find((p) => p.name === c.name));
    const extra = shuffle(remaining).slice(0, 2);
    setDeepPicked(extra);
    setFlippedCards(new Set());
    transitionTo("deepen-pick");
  };

  const handlePickDeep = (idx: number) => {
    setFlippedCards(new Set([...flippedCards, idx]));
    if (flippedCards.size + 1 >= 2) {
      const r = DEEP_READINGS[Math.floor(Math.random() * DEEP_READINGS.length)];
      setDeepReading(r);
      setTimeout(() => transitionTo("deep-reading"), 1200);
    }
  };

  const handleRestart = () => {
    setPicked([]);
    setDeepPicked([]);
    setReading("");
    setDeepReading("");
    setFlippedCards(new Set());
    setQuestion("");
    transitionTo("welcome");
  };

  useEffect(() => {
    if (phase === "question" && questionRef.current) {
      questionRef.current.focus();
    }
  }, [phase]);

  /* ─── STYLES ─── */
  const s = {
    page: { minHeight: "100vh", background: "#050505", color: "#d4af37", fontFamily: "'Cinzel', serif", position: "relative" as const, overflow: "hidden" },
    center: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem 1rem", position: "relative" as const, zIndex: 1 },
    title: { fontSize: "clamp(1.5rem, 5vw, 3rem)", textAlign: "center" as const, marginBottom: "1.5rem", textShadow: "0 0 30px rgba(212,175,55,0.3)" },
    subtitle: { fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", color: "rgba(212,175,55,0.6)", textAlign: "center" as const, maxWidth: 500, lineHeight: 1.6, marginBottom: "2rem" },
    btn: { padding: "14px 40px", background: "transparent", border: "2px solid #d4af37", color: "#d4af37", fontFamily: "'Cinzel', serif", fontSize: "1rem", cursor: "pointer", borderRadius: 4, transition: "all 0.3s", letterSpacing: 2 },
    btnHover: { background: "rgba(212,175,55,0.15)", boxShadow: "0 0 20px rgba(212,175,55,0.3)" },
    input: { width: "100%", maxWidth: 450, padding: "14px 20px", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37", fontFamily: "'Cinzel', serif", fontSize: "1rem", borderRadius: 4, outline: "none" },
    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px", maxWidth: 700, width: "100%", padding: "1rem" },
    card: { width: "100%", aspectRatio: "2/3", cursor: "pointer", perspective: "1000px", borderRadius: 8 },
    cardInner: { width: "100%", height: "100%", position: "relative" as const, transition: "transform 0.6s", transformStyle: "preserve-3d" as const, borderRadius: 8 },
    cardFace: { position: "absolute" as const, width: "100%", height: "100%", backfaceVisibility: "hidden" as const, borderRadius: 8, overflow: "hidden" },
    readingBox: { maxWidth: 600, lineHeight: 1.8, fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", color: "rgba(212,175,55,0.85)", textAlign: "center" as const },
    pickedRow: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: "2rem" },
    pickedCard: { width: 90, aspectRatio: "2/3", borderRadius: 6, overflow: "hidden", border: "2px solid rgba(212,175,55,0.5)", animation: "glow 2s ease-in-out infinite" },
    separator: { width: 60, height: 1, background: "rgba(212,175,55,0.3)", margin: "1.5rem auto" },
    counter: { fontSize: "0.85rem", color: "rgba(212,175,55,0.5)", marginBottom: "1rem" },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      <div style={s.page}>
        <Particles />

        {/* ─── WELCOME ─── */}
        {phase === "welcome" && (
          <div style={s.center} className={fadeClass}>
            <div style={{ fontSize: 60, marginBottom: "1rem", animation: "float 3s ease-in-out infinite" }}>&#9733;</div>
            <h1 style={s.title}>Le Rituel du Tarot</h1>
            <p style={s.subtitle}>
              {"Bienvenue, ame curieuse. Les 22 arcanes majeurs du Tarot de Grimaud sont prets a vous reveler les mysteres de votre destinee..."}
            </p>
            <button
              style={s.btn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.btnHover)}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
              onClick={handleStart}
            >
              COMMENCER LE RITUEL
            </button>
          </div>
        )}

        {/* ─── QUESTION ─── */}
        {phase === "question" && (
          <div style={s.center} className={fadeClass}>
            <div style={{ fontSize: 40, marginBottom: "1rem", animation: "flicker 3s ease-in-out infinite" }}>&#128302;</div>
            <h2 style={{ ...s.title, fontSize: "clamp(1.2rem, 4vw, 2rem)" }}>Quelle est votre question ?</h2>
            <p style={{ ...s.subtitle, marginBottom: "1.5rem" }}>
              {"Concentrez-vous... Formulez votre question avec clarte, et les cartes vous repondront."}
            </p>
            <input
              ref={questionRef}
              style={s.input}
              type="text"
              placeholder="Posez votre question au destin..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuestionSubmit()}
            />
            <button
              style={{ ...s.btn, marginTop: "1.5rem", opacity: question.trim() ? 1 : 0.4 }}
              onMouseEnter={(e) => question.trim() && Object.assign(e.currentTarget.style, s.btnHover)}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
              onClick={handleQuestionSubmit}
              disabled={!question.trim()}
            >
              CONSULTER LES ARCANES
            </button>
          </div>
        )}

        {/* ─── SHUFFLE ─── */}
        {phase === "shuffle" && (
          <div style={s.center} className={fadeClass}>
            <div style={{ fontSize: 48, animation: "pulse 0.5s ease-in-out infinite", marginBottom: "1.5rem" }}>&#127183;</div>
            <h2 style={{ ...s.title, fontSize: "clamp(1.2rem, 4vw, 1.8rem)" }}>{"Les cartes se melangent..."}</h2>
            <p style={{ ...s.subtitle, fontSize: "0.9rem" }}>{"Les arcanes repondent a votre energie..."}</p>
          </div>
        )}

        {/* ─── PICK 4 CARDS ─── */}
        {phase === "pick" && (
          <div style={s.center} className={fadeClass}>
            <h2 style={{ ...s.title, fontSize: "clamp(1rem, 3.5vw, 1.6rem)", marginBottom: "0.5rem" }}>
              Choisissez 4 arcanes
            </h2>
            <p style={s.counter}>{picked.length} / 4 selectionnes</p>
            <div style={s.cardGrid}>
              {shuffledDeck.map((card, idx) => {
                const isFlipped = flippedCards.has(idx);
                const isPicked = picked.find((c) => c.name === card.name);
                return (
                  <div
                    key={card.name}
                    style={{
                      ...s.card,
                      opacity: isPicked ? 0.4 : 1,
                      pointerEvents: isPicked || picked.length >= 4 ? "none" : "auto",
                    }}
                    onClick={() => handlePickCard(idx)}
                  >
                    <div style={{
                      ...s.cardInner,
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}>
                      <div style={s.cardFace}>
                        <CardBack />
                      </div>
                      <div style={{
                        ...s.cardFace,
                        transform: "rotateY(180deg)",
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          crossOrigin="anonymous"
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── READING ─── */}
        {phase === "reading" && (
          <div style={s.center} className={fadeClass}>
            <div style={{ fontSize: 36, marginBottom: "1rem" }}>&#128302;</div>
            <h2 style={{ ...s.title, fontSize: "clamp(1rem, 3.5vw, 1.6rem)", marginBottom: "1.5rem" }}>Votre lecture</h2>
            <div style={s.pickedRow}>
              {picked.map((card) => (
                <div key={card.name} style={s.pickedCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.imageUrl} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <div style={s.readingBox}>
              {typewriter.displayed}
              {!typewriter.done && <span style={{ animation: "blink 1s infinite" }}>|</span>}
            </div>
            {typewriter.done && (
              <div style={{ marginTop: "2rem", display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }} className="animate-in">
                <button
                  style={s.btn}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.btnHover)}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
                  onClick={handleDeepen}
                >
                  APPROFONDIR (+2 cartes)
                </button>
                <button
                  style={{ ...s.btn, borderColor: "rgba(212,175,55,0.4)", color: "rgba(212,175,55,0.6)" }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.btnHover)}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
                  onClick={handleRestart}
                >
                  NOUVEAU TIRAGE
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── DEEPEN PICK ─── */}
        {phase === "deepen-pick" && (
          <div style={s.center} className={fadeClass}>
            <h2 style={{ ...s.title, fontSize: "clamp(1rem, 3.5vw, 1.6rem)", marginBottom: "0.5rem" }}>
              Revelons 2 arcanes de plus...
            </h2>
            <p style={s.counter}>Touchez les cartes pour les retourner</p>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              {deepPicked.map((card, idx) => {
                const isFlipped = flippedCards.has(idx);
                return (
                  <div
                    key={card.name}
                    style={{ ...s.card, width: 120 }}
                    onClick={() => handlePickDeep(idx)}
                  >
                    <div style={{
                      ...s.cardInner,
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}>
                      <div style={s.cardFace}><CardBack /></div>
                      <div style={{ ...s.cardFace, transform: "rotateY(180deg)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={card.imageUrl} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── DEEP READING ─── */}
        {phase === "deep-reading" && (
          <div style={s.center} className={fadeClass}>
            <div style={{ fontSize: 36, marginBottom: "1rem" }}>&#10024;</div>
            <h2 style={{ ...s.title, fontSize: "clamp(1rem, 3.5vw, 1.6rem)", marginBottom: "1.5rem" }}>Revelation profonde</h2>
            <div style={s.pickedRow}>
              {[...picked, ...deepPicked].map((card) => (
                <div key={card.name} style={s.pickedCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.imageUrl} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <div style={s.readingBox}>
              {typewriter.displayed}
              {!typewriter.done && <span style={{ animation: "blink 1s infinite" }}>|</span>}
            </div>
            {typewriter.done && (
              <div style={{ marginTop: "2rem" }} className="animate-in">
                <button
                  style={s.btn}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.btnHover)}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
                  onClick={handleRestart}
                >
                  NOUVEAU TIRAGE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
