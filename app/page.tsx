"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ───────────────────── TYPES ───────────────────── */
interface TarotCard {
  id: number;
  name: string;
  image: string;
}

enum Phase {
  WELCOME = "WELCOME",
  QUESTION = "QUESTION",
  SHUFFLE = "SHUFFLE",
  SELECT = "SELECT",
  READING = "READING",
  DEEP_SELECT = "DEEP_SELECT",
  DEEP_READING = "DEEP_READING",
}

/* ──────────────────── DECK ─────────────────────── */
const DECK: TarotCard[] = [
  { id: 0, name: "Le Mat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Jean_Dodal_Tarot_trump_22.jpg/130px-Jean_Dodal_Tarot_trump_22.jpg" },
  { id: 1, name: "Le Bateleur", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Jean_Dodal_Tarot_trump_01.jpg/130px-Jean_Dodal_Tarot_trump_01.jpg" },
  { id: 2, name: "La Papesse", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Jean_Dodal_Tarot_trump_02.jpg/130px-Jean_Dodal_Tarot_trump_02.jpg" },
  { id: 3, name: "L'Imperatrice", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Jean_Dodal_Tarot_trump_03.jpg/130px-Jean_Dodal_Tarot_trump_03.jpg" },
  { id: 4, name: "L'Empereur", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Jean_Dodal_Tarot_trump_04.jpg/130px-Jean_Dodal_Tarot_trump_04.jpg" },
  { id: 5, name: "Le Pape", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Jean_Dodal_Tarot_trump_05.jpg/130px-Jean_Dodal_Tarot_trump_05.jpg" },
  { id: 6, name: "L'Amoureux", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Jean_Dodal_Tarot_trump_06.jpg/130px-Jean_Dodal_Tarot_trump_06.jpg" },
  { id: 7, name: "Le Chariot", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Jean_Dodal_Tarot_trump_07.jpg/130px-Jean_Dodal_Tarot_trump_07.jpg" },
  { id: 8, name: "La Justice", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Jean_Dodal_Tarot_trump_08.jpg/130px-Jean_Dodal_Tarot_trump_08.jpg" },
  { id: 9, name: "L'Hermite", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Jean_Dodal_Tarot_trump_09.jpg/130px-Jean_Dodal_Tarot_trump_09.jpg" },
  { id: 10, name: "La Roue de Fortune", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Jean_Dodal_Tarot_trump_10.jpg/130px-Jean_Dodal_Tarot_trump_10.jpg" },
  { id: 11, name: "La Force", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jean_Dodal_Tarot_trump_11.jpg/130px-Jean_Dodal_Tarot_trump_11.jpg" },
  { id: 12, name: "Le Pendu", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jean_Dodal_Tarot_trump_12.jpg/130px-Jean_Dodal_Tarot_trump_12.jpg" },
  { id: 13, name: "L'Arcane sans Nom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jean_Dodal_Tarot_trump_13.jpg/130px-Jean_Dodal_Tarot_trump_13.jpg" },
  { id: 14, name: "Temperance", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Jean_Dodal_Tarot_trump_14.jpg/130px-Jean_Dodal_Tarot_trump_14.jpg" },
  { id: 15, name: "Le Diable", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Jean_Dodal_Tarot_trump_15.jpg/130px-Jean_Dodal_Tarot_trump_15.jpg" },
  { id: 16, name: "La Maison Dieu", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Jean_Dodal_Tarot_trump_16.jpg/130px-Jean_Dodal_Tarot_trump_16.jpg" },
  { id: 17, name: "L'Etoile", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jean_Dodal_Tarot_trump_17.jpg/130px-Jean_Dodal_Tarot_trump_17.jpg" },
  { id: 18, name: "La Lune", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Jean_Dodal_Tarot_trump_18.jpg/130px-Jean_Dodal_Tarot_trump_18.jpg" },
  { id: 19, name: "Le Soleil", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Jean_Dodal_Tarot_trump_19.jpg/130px-Jean_Dodal_Tarot_trump_19.jpg" },
  { id: 20, name: "Le Jugement", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Jean_Dodal_Tarot_trump_20.jpg/130px-Jean_Dodal_Tarot_trump_20.jpg" },
  { id: 21, name: "Le Monde", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jean_Dodal_Tarot_trump_21.jpg/130px-Jean_Dodal_Tarot_trump_21.jpg" },
];

/* ──────────────── LECTURES FALLBACK ────────────── */
const READINGS = [
  "Les arcanes tissent un recit fascinant pour vous. Le chemin que vous empruntez est jalonne de transformations profondes. Les forces du passe vous poussent vers un renouveau inattendu. Faites confiance a votre intuition, car elle est votre meilleur guide dans cette periode de changement. L'univers conspire en votre faveur, meme si le voile du mystere ne se leve que lentement.",
  "Les cartes parlent d'un voyage interieur qui s'annonce revelateur. Des energies puissantes se croisent dans votre destinee, creant des opportunites la ou vous ne voyez que des obstacles. Votre passe recele la cle de votre avenir. Les astres veillent sur votre chemin et vous guident vers une comprehension plus profonde de vous-meme.",
  "Je vois dans ce tirage une danse entre ombre et lumiere. Votre question touche a l'essence meme de votre transformation personnelle. Les arcanes revelent que vous etes a un carrefour decisif. Le courage de faire face a vos verites cachees vous menera vers une liberation attendue depuis longtemps.",
  "Les cartes revelent un chemin de sagesse et de renouveau. Les forces celestes s'alignent pour vous offrir une periode de clarte et de revelation. Ce que vous cherchez est plus proche que vous ne le pensez. Les arcanes vous invitent a ecouter la voix silencieuse de votre coeur.",
  "Un vent de changement souffle sur votre destinee. Les arcanes dessinent un tableau riche de promesses et de defis. Chaque epreuve traversee vous rapproche de votre verite interieure. Le moment est venu d'embrasser pleinement votre pouvoir personnel.",
];

const DEEP_READINGS = [
  "Les deux arcanes supplementaires eclairent d'une lumiere nouvelle votre lecture. Ce qui semblait obscur trouve maintenant sa signification. La voie se dessine plus clairement devant vous. Les forces cosmiques confirment que votre instinct premier etait le bon.",
  "Ces nouvelles cartes approfondissent considerablement la vision precedente. Elles revelent des couches cachees de votre destinee. Un message clair emerge : le moment d'agir approche. Les energies se concentrent et le changement que vous esperez se concretisera bientot.",
  "Les arcanes supplementaires apportent une nuance essentielle. Votre chemin prend un tournant inattendu mais favorable. Les forces invisibles travaillent en votre faveur, et ces deux nouvelles cartes confirment que vous etes sur la bonne voie.",
];

/* ──────────────── SHUFFLE UTIL ─────────────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════ */
export default function TarotPage() {
  const [phase, setPhase] = useState<Phase>(Phase.WELCOME);
  const [question, setQuestion] = useState("");
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [deepCards, setDeepCards] = useState<TarotCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [deepReading, setDeepReading] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  /* ── TYPEWRITER ── */
  const typeText = useCallback((text: string, onDone?: () => void) => {
    setTypedText("");
    setIsTyping(true);
    let i = 0;
    const run = () => {
      if (i < text.length) {
        setTypedText(text.slice(0, i + 1));
        i++;
        typingRef.current = setTimeout(run, 25 + Math.random() * 25);
      } else {
        setIsTyping(false);
        onDone?.();
      }
    };
    run();
  }, []);

  useEffect(() => () => { if (typingRef.current) clearTimeout(typingRef.current); }, []);

  /* ── ACTIONS ── */
  const startRitual = () => {
    setPhase(Phase.QUESTION);
  };

  const submitQuestion = () => {
    if (!question.trim()) return;
    setPhase(Phase.SHUFFLE);
    setTimeout(() => {
      setShuffledDeck(shuffleArray(DECK));
      setPhase(Phase.SELECT);
    }, 2500);
  };

  const selectCard = (card: TarotCard) => {
    if (selectedCards.find((c) => c.id === card.id)) return;
    if (selectedCards.length >= 4) return;
    const next = [...selectedCards, card];
    setSelectedCards(next);
    setFlippedIds((s) => new Set(s).add(card.id));
    if (next.length === 4) {
      setTimeout(() => {
        const r = READINGS[Math.floor(Math.random() * READINGS.length)];
        setReading(r);
        setPhase(Phase.READING);
        typeText(r);
      }, 1200);
    }
  };

  const startDeepening = () => {
    const remaining = shuffledDeck.filter((c) => !selectedCards.find((s) => s.id === c.id));
    const reshuffled = shuffleArray(remaining);
    setShuffledDeck(reshuffled);
    setFlippedIds(new Set());
    setDeepCards([]);
    setPhase(Phase.DEEP_SELECT);
  };

  const selectDeepCard = (card: TarotCard) => {
    if (deepCards.find((c) => c.id === card.id)) return;
    if (deepCards.length >= 2) return;
    const next = [...deepCards, card];
    setDeepCards(next);
    setFlippedIds((s) => new Set(s).add(card.id));
    if (next.length === 2) {
      setTimeout(() => {
        const r = DEEP_READINGS[Math.floor(Math.random() * DEEP_READINGS.length)];
        setDeepReading(r);
        setPhase(Phase.DEEP_READING);
        typeText(r);
      }, 1200);
    }
  };

  const restart = () => {
    setPhase(Phase.WELCOME);
    setQuestion("");
    setShuffledDeck([]);
    setSelectedCards([]);
    setDeepCards([]);
    setFlippedIds(new Set());
    setReading("");
    setDeepReading("");
    setTypedText("");
    setIsTyping(false);
  };

  /* ── STYLES ── */
  const gold = "#d4af37";
  const goldDim = "rgba(212,175,55,0.4)";
  const goldGlow = "rgba(212,175,55,0.15)";
  const dark = "#050505";
  const darkCard = "#0a0a0a";

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: `radial-gradient(ellipse at center, #0d0906 0%, ${dark} 70%)`,
    color: gold,
    fontFamily: "'Cinzel', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    opacity: fadeIn ? 1 : 0,
    transition: "opacity 1.5s ease",
    position: "relative",
    overflow: "hidden",
  };

  const btnStyle: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${gold}`,
    color: gold,
    padding: "0.75rem 2rem",
    fontFamily: "'Cinzel', serif",
    fontSize: "1rem",
    cursor: "pointer",
    letterSpacing: "0.1em",
    transition: "all 0.3s ease",
    marginTop: "1.5rem",
  };

  const cardBack: React.CSSProperties = {
    width: 100,
    height: 160,
    background: `linear-gradient(145deg, #1a1205, #0a0800)`,
    border: `1px solid ${goldDim}`,
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    transition: "all 0.3s ease",
    boxShadow: `0 0 15px ${goldGlow}`,
    position: "relative" as const,
    overflow: "hidden" as const,
  };

  const cardFlipped: React.CSSProperties = {
    width: 100,
    height: 160,
    borderRadius: 8,
    border: `2px solid ${gold}`,
    overflow: "hidden",
    boxShadow: `0 0 25px rgba(212,175,55,0.3)`,
  };

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div style={containerStyle}>
      {/* Particules decoratives */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.7; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes pulse { 
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2); } 
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.4); } 
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cardHover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .tarot-btn:hover {
          background: rgba(212,175,55,0.1) !important;
          box-shadow: 0 0 20px rgba(212,175,55,0.2);
          transform: translateY(-2px);
        }
        .card-back:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 0 30px rgba(212,175,55,0.4) !important;
          border-color: #d4af37 !important;
        }
      `}</style>

      {/* ─── PARTICULES ─── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              borderRadius: "50%",
              background: gold,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* ─── CONTENU ─── */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, width: "100%" }}>

        {/* ═══ ACCUEIL ═══ */}
        {phase === Phase.WELCOME && (
          <div>
            {/* Boule de cristal */}
            <div style={{
              width: 120, height: 120, borderRadius: "50%", margin: "0 auto 2rem",
              background: "radial-gradient(circle at 35% 35%, rgba(212,175,55,0.2), transparent 60%), radial-gradient(circle at 50% 50%, rgba(30,20,50,0.8), #050505)",
              border: `1px solid ${goldDim}`,
              animation: "pulse 3s ease-in-out infinite",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.5rem",
            }}>
              {"*"}
            </div>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>
              Le Rituel du Tarot
            </h1>
            <p style={{ color: goldDim, fontSize: "0.9rem", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
              Les 22 Arcanes Majeurs du Tarot de Grimaud
            </p>
            <p style={{ color: goldDim, fontSize: "0.8rem", fontStyle: "italic", maxWidth: 500, margin: "1rem auto" }}>
              Entrez dans le sanctuaire de la voyante... Les cartes vous attendent.
            </p>
            <button className="tarot-btn" style={btnStyle} onClick={startRitual}>
              Commencer le Rituel
            </button>
          </div>
        )}

        {/* ═══ QUESTION ═══ */}
        {phase === Phase.QUESTION && (
          <div>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Concentrez-vous...
            </p>
            <p style={{ color: goldDim, fontSize: "0.85rem", fontStyle: "italic", marginBottom: "2rem" }}>
              Quelle question brule dans votre coeur ?
            </p>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitQuestion()}
              placeholder="Posez votre question au destin..."
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${goldDim}`,
                borderRadius: 8,
                padding: "1rem 1.5rem",
                color: gold,
                fontFamily: "'Cinzel', serif",
                fontSize: "1rem",
                width: "100%",
                maxWidth: 500,
                outline: "none",
                textAlign: "center",
              }}
              autoFocus
            />
            <br />
            <button
              className="tarot-btn"
              style={{ ...btnStyle, opacity: question.trim() ? 1 : 0.3, pointerEvents: question.trim() ? "auto" : "none" }}
              onClick={submitQuestion}
            >
              Consulter les Arcanes
            </button>
          </div>
        )}

        {/* ═══ MELANGE ═══ */}
        {phase === Phase.SHUFFLE && (
          <div>
            <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
              Les cartes se melangent...
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    ...cardBack,
                    width: 60,
                    height: 90,
                    animation: `cardHover ${0.4 + i * 0.15}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {"?"}
                </div>
              ))}
            </div>
            <div style={{
              width: 30, height: 30, border: `2px solid ${gold}`, borderTopColor: "transparent",
              borderRadius: "50%", margin: "2rem auto 0", animation: "spin 1s linear infinite"
            }} />
          </div>
        )}

        {/* ═══ SELECTION (4 cartes) ═══ */}
        {phase === Phase.SELECT && (
          <div>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Choisissez 4 arcanes
            </p>
            <p style={{ color: goldDim, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              {selectedCards.length} / 4 cartes selectionnees
            </p>
            {/* Cartes selectionnees */}
            {selectedCards.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {selectedCards.map((card) => (
                  <div key={card.id} style={{ textAlign: "center" }}>
                    <div style={cardFlipped}>
                      <img
                        src={card.image}
                        alt={card.name}
                        crossOrigin="anonymous"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <p style={{ fontSize: "0.65rem", marginTop: 6, color: goldDim, maxWidth: 100 }}>{card.name}</p>
                  </div>
                ))}
              </div>
            )}
            {/* Grille de selection */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {shuffledDeck.map((card) => {
                const isFlipped = flippedIds.has(card.id);
                if (isFlipped) return null;
                return (
                  <div
                    key={card.id}
                    className="card-back"
                    style={cardBack}
                    onClick={() => selectCard(card)}
                  >
                    {"?"}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ LECTURE ═══ */}
        {phase === Phase.READING && (
          <div>
            <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
              La voyante parle...
            </p>
            {/* Cartes tirees */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
              {selectedCards.map((card) => (
                <div key={card.id} style={{ textAlign: "center" }}>
                  <div style={cardFlipped}>
                    <img src={card.image} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontSize: "0.65rem", marginTop: 6, color: goldDim, maxWidth: 100 }}>{card.name}</p>
                </div>
              ))}
            </div>
            {/* Texte de la lecture */}
            <div style={{
              background: "rgba(212,175,55,0.03)",
              border: `1px solid rgba(212,175,55,0.15)`,
              borderRadius: 12,
              padding: "1.5rem 2rem",
              maxWidth: 600,
              margin: "0 auto",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              fontStyle: "italic",
              color: "rgba(212,175,55,0.85)",
              textAlign: "left",
              minHeight: 80,
            }}>
              {typedText}
              {isTyping && <span style={{ animation: "blink 0.8s infinite" }}>|</span>}
            </div>
            {!isTyping && (
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
                <button className="tarot-btn" style={btnStyle} onClick={startDeepening}>
                  Approfondir (2 cartes)
                </button>
                <button className="tarot-btn" style={btnStyle} onClick={restart}>
                  Nouveau Rituel
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ SELECTION PROFONDE (2 cartes) ═══ */}
        {phase === Phase.DEEP_SELECT && (
          <div>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Choisissez 2 arcanes supplementaires
            </p>
            <p style={{ color: goldDim, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              {deepCards.length} / 2 cartes selectionnees
            </p>
            {deepCards.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {deepCards.map((card) => (
                  <div key={card.id} style={{ textAlign: "center" }}>
                    <div style={cardFlipped}>
                      <img src={card.image} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <p style={{ fontSize: "0.65rem", marginTop: 6, color: goldDim, maxWidth: 100 }}>{card.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {shuffledDeck.map((card) => {
                const isFlipped = flippedIds.has(card.id);
                if (isFlipped) return null;
                return (
                  <div key={card.id} className="card-back" style={cardBack} onClick={() => selectDeepCard(card)}>
                    {"?"}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ LECTURE PROFONDE ═══ */}
        {phase === Phase.DEEP_READING && (
          <div>
            <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
              Les arcanes revelent leur secret...
            </p>
            {/* Toutes les cartes */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
              {selectedCards.map((card) => (
                <div key={card.id} style={{ textAlign: "center" }}>
                  <div style={{ ...cardFlipped, width: 80, height: 130 }}>
                    <img src={card.image} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontSize: "0.6rem", marginTop: 4, color: goldDim, maxWidth: 80 }}>{card.name}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: goldDim, marginBottom: "0.5rem" }}>+ Approfondissement</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
              {deepCards.map((card) => (
                <div key={card.id} style={{ textAlign: "center" }}>
                  <div style={cardFlipped}>
                    <img src={card.image} alt={card.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontSize: "0.65rem", marginTop: 6, color: goldDim, maxWidth: 100 }}>{card.name}</p>
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(212,175,55,0.03)",
              border: `1px solid rgba(212,175,55,0.15)`,
              borderRadius: 12,
              padding: "1.5rem 2rem",
              maxWidth: 600,
              margin: "0 auto",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              fontStyle: "italic",
              color: "rgba(212,175,55,0.85)",
              textAlign: "left",
              minHeight: 80,
            }}>
              {typedText}
              {isTyping && <span style={{ animation: "blink 0.8s infinite" }}>|</span>}
            </div>
            {!isTyping && (
              <button className="tarot-btn" style={btnStyle} onClick={restart}>
                Nouveau Rituel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
