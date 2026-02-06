"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ---- TYPES ---- */
interface TarotCard {
  id: number;
  name: string;
  image: string;
}

interface DrawnCard extends TarotCard {
  reversed: boolean;
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

/* ---- DECK ---- */
const CARD_BACK = "/cards/back.jpg";
const DECK: TarotCard[] = [
  { id: 0, name: "Le Mat", image: "/cards/00-mat.jpg" },
  { id: 1, name: "Le Bateleur", image: "/cards/01-bateleur.jpg" },
  { id: 2, name: "La Papesse", image: "/cards/02-papesse.jpg" },
  { id: 3, name: "L'Imperatrice", image: "/cards/03-imperatrice.jpg" },
  { id: 4, name: "L'Empereur", image: "/cards/04-empereur.jpg" },
  { id: 5, name: "Le Pape", image: "/cards/05-pape.jpg" },
  { id: 6, name: "L'Amoureux", image: "/cards/06-amoureux.jpg" },
  { id: 7, name: "Le Chariot", image: "/cards/07-chariot.jpg" },
  { id: 8, name: "La Justice", image: "/cards/08-justice.jpg" },
  { id: 9, name: "L'Hermite", image: "/cards/09-hermite.jpg" },
  { id: 10, name: "La Roue de Fortune", image: "/cards/10-roue.jpg" },
  { id: 11, name: "La Force", image: "/cards/11-force.jpg" },
  { id: 12, name: "Le Pendu", image: "/cards/12-pendu.jpg" },
  { id: 13, name: "L'Arcane sans Nom", image: "/cards/13-mort.jpg" },
  { id: 14, name: "Temperance", image: "/cards/14-temperance.jpg" },
  { id: 15, name: "Le Diable", image: "/cards/15-diable.jpg" },
  { id: 16, name: "La Maison Dieu", image: "/cards/16-maison.jpg" },
  { id: 17, name: "L'Etoile", image: "/cards/17-etoile.jpg" },
  { id: 18, name: "La Lune", image: "/cards/18-lune.jpg" },
  { id: 19, name: "Le Soleil", image: "/cards/19-soleil.jpg" },
  { id: 20, name: "Le Jugement", image: "/cards/20-jugement.jpg" },
  { id: 21, name: "Le Monde", image: "/cards/21-monde.jpg" },
];

/* ---- READINGS ---- */
const READINGS = [
  "Les arcanes tissent un recit fascinant pour vous. Le chemin que vous empruntez est jalonne de transformations profondes. Les forces du passe vous poussent vers un renouveau inattendu. Faites confiance a votre intuition, car elle est votre meilleur guide.",
  "Les cartes parlent d un voyage interieur revelateur. Des energies puissantes se croisent dans votre destinee, creant des opportunites la ou vous ne voyez que des obstacles. Les astres veillent sur votre chemin.",
  "Je vois dans ce tirage une danse entre ombre et lumiere. Votre question touche a l essence meme de votre transformation personnelle. Les arcanes revelent que vous etes a un carrefour decisif.",
  "Les cartes revelent un chemin de sagesse et de renouveau. Les forces celestes s alignent pour vous offrir une periode de clarte et de revelation. Ce que vous cherchez est plus proche que vous ne le pensez.",
  "Un vent de changement souffle sur votre destinee. Les arcanes dessinent un tableau riche de promesses et de defis. Chaque epreuve traversee vous rapproche de votre verite interieure.",
];

const DEEP_READINGS = [
  "Les deux arcanes supplementaires eclairent d une lumiere nouvelle votre lecture. Ce qui semblait obscur trouve maintenant sa signification. Les forces cosmiques confirment que votre instinct premier etait le bon.",
  "Ces nouvelles cartes approfondissent la vision precedente. Elles revelent des couches cachees de votre destinee. Un message clair emerge : le moment d agir approche.",
  "Les arcanes supplementaires apportent une nuance essentielle. Votre chemin prend un tournant inattendu mais favorable. Les forces invisibles travaillent en votre faveur.",
];

/* ---- SHUFFLE ---- */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ===== COMPOSANT ===== */
export default function TarotPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>(Phase.WELCOME);
  const [question, setQuestion] = useState("");
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [deepCards, setDeepCards] = useState<DrawnCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState("");
  const [deepReading, setDeepReading] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => () => {
    if (typingRef.current) clearTimeout(typingRef.current);
  }, []);

  const typeText = useCallback((text: string) => {
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
      }
    };
    run();
  }, []);

  const startRitual = () => setPhase(Phase.QUESTION);

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
    const drawn: DrawnCard = { ...card, reversed: Math.random() < 0.4 };
    const next = [...selectedCards, drawn];
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
    setShuffledDeck(shuffleArray(remaining));
    setFlippedIds(new Set());
    setDeepCards([]);
    setPhase(Phase.DEEP_SELECT);
  };

  const selectDeepCard = (card: TarotCard) => {
    if (deepCards.find((c) => c.id === card.id)) return;
    if (deepCards.length >= 2) return;
    const drawn: DrawnCard = { ...card, reversed: Math.random() < 0.4 };
    const next = [...deepCards, drawn];
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

  /* Ne rien rendre cote serveur pour eviter erreur hydration */
  if (!mounted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#d4af37",
        fontFamily: "'Cinzel', serif",
      }}>
        <p>Preparation du rituel...</p>
      </div>
    );
  }

  const gold = "#d4af37";
  const goldDim = "rgba(212,175,55,0.4)";
  const goldGlow = "rgba(212,175,55,0.15)";

  /* Helper: affiche une carte revelee avec rotation si renversee */
  const RevealedCard = ({ card, size = "normal" }: { card: DrawnCard; size?: "normal" | "small" }) => {
    const w = size === "small" ? 80 : 100;
    const h = size === "small" ? 130 : 160;
    const fontSize = size === "small" ? "0.6rem" : "0.65rem";
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: w, height: h, borderRadius: 8,
          border: `2px solid ${card.reversed ? "#a04040" : gold}`, overflow: "hidden",
          boxShadow: card.reversed
            ? "0 0 25px rgba(160,64,64,0.3)"
            : "0 0 25px rgba(212,175,55,0.3)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt={card.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: card.reversed ? "rotate(180deg)" : "none",
            }}
          />
        </div>
        <p style={{ fontSize, marginTop: 6, color: goldDim, maxWidth: w }}>{card.name}</p>
        {card.reversed && (
          <p style={{ fontSize: "0.55rem", marginTop: 2, color: "#a04040", fontStyle: "italic" }}>Renversee</p>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.7; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2); }
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.4); }
        }
        @keyframes cardBob {
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
        .tbtn:hover {
          background: rgba(212,175,55,0.1) !important;
          box-shadow: 0 0 20px rgba(212,175,55,0.2);
          transform: translateY(-2px);
        }
        .cback:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 0 30px rgba(212,175,55,0.4) !important;
          border-color: #d4af37 !important;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at center, #0d0906 0%, #050505 70%)",
        color: gold,
        fontFamily: "'Cinzel', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Particules */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 3 + (i % 4),
                height: 3 + (i % 4),
                borderRadius: "50%",
                background: gold,
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13 + 5) % 100}%`,
                opacity: 0.15 + (i % 3) * 0.1,
                animation: `float ${5 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.7) % 5}s`,
              }}
            />
          ))}
        </div>

        {/* Contenu */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, width: "100%" }}>

          {/* === ACCUEIL === */}
          {phase === Phase.WELCOME && (
            <div>
              <div style={{
                width: 120, height: 120, borderRadius: "50%", margin: "0 auto 2rem",
                background: "radial-gradient(circle at 35% 35%, rgba(212,175,55,0.2), transparent 60%), radial-gradient(circle, rgba(30,20,50,0.8), #050505)",
                border: `1px solid ${goldDim}`,
                animation: "pulse 3s ease-in-out infinite",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", color: gold,
              }}>
                {"*"}
              </div>
              <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>
                Le Rituel du Tarot
              </h1>
              <p style={{ color: goldDim, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                Les 22 Arcanes Majeurs du Tarot de Grimaud
              </p>
              <p style={{ color: goldDim, fontSize: "0.8rem", fontStyle: "italic", maxWidth: 500, margin: "1rem auto" }}>
                Entrez dans le sanctuaire de la voyante... Les cartes vous attendent.
              </p>
              <button className="tbtn" style={{
                background: "transparent", border: `1px solid ${gold}`, color: gold,
                padding: "0.75rem 2rem", fontFamily: "'Cinzel', serif", fontSize: "1rem",
                cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.3s", marginTop: "1.5rem",
              }} onClick={startRitual}>
                Commencer le Rituel
              </button>
            </div>
          )}

          {/* === QUESTION === */}
          {phase === Phase.QUESTION && (
            <div>
              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Concentrez-vous...</p>
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
                  background: "rgba(255,255,255,0.03)", border: `1px solid ${goldDim}`,
                  borderRadius: 8, padding: "1rem 1.5rem", color: gold,
                  fontFamily: "'Cinzel', serif", fontSize: "1rem",
                  width: "100%", maxWidth: 500, outline: "none", textAlign: "center",
                }}
                autoFocus
              />
              <br />
              <button className="tbtn" style={{
                background: "transparent", border: `1px solid ${gold}`, color: gold,
                padding: "0.75rem 2rem", fontFamily: "'Cinzel', serif", fontSize: "1rem",
                cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.3s", marginTop: "1.5rem",
                opacity: question.trim() ? 1 : 0.3,
                pointerEvents: question.trim() ? "auto" : "none",
              }} onClick={submitQuestion}>
                Consulter les Arcanes
              </button>
            </div>
          )}

          {/* === MELANGE === */}
          {phase === Phase.SHUFFLE && (
            <div>
              <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>Les cartes se melangent...</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    width: 60, height: 90,
                    border: `1px solid ${goldDim}`, borderRadius: 8,
                    overflow: "hidden",
                    animation: `cardBob ${0.4 + i * 0.15}s ease-in-out infinite`,
                    boxShadow: `0 0 15px ${goldGlow}`,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CARD_BACK} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              <div style={{
                width: 30, height: 30, border: `2px solid ${gold}`, borderTopColor: "transparent",
                borderRadius: "50%", margin: "2rem auto 0", animation: "spin 1s linear infinite",
              }} />
            </div>
          )}

          {/* === SELECTION 4 CARTES === */}
          {phase === Phase.SELECT && (
            <div>
              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Choisissez 4 arcanes</p>
              <p style={{ color: goldDim, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                {selectedCards.length} / 4 selectionnees
              </p>
              {selectedCards.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                  {selectedCards.map((card) => (
                    <RevealedCard key={card.id} card={card} />
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {shuffledDeck.map((card) => {
                  if (flippedIds.has(card.id)) return null;
                  return (
                    <div key={card.id} className="cback" style={{
                      width: 100, height: 160,
                      border: `1px solid ${goldDim}`, borderRadius: 8,
                      cursor: "pointer", overflow: "hidden",
                      transition: "all 0.3s",
                      boxShadow: `0 0 15px ${goldGlow}`,
                    }} onClick={() => selectCard(card)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={CARD_BACK} alt="Carte cachee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* === LECTURE === */}
          {phase === Phase.READING && (
            <div>
              <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>La voyante parle...</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
                {selectedCards.map((card) => (
                  <RevealedCard key={card.id} card={card} />
                ))}
              </div>
              <div style={{
                background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: 12, padding: "1.5rem 2rem", maxWidth: 600, margin: "0 auto",
                fontSize: "0.95rem", lineHeight: 1.7, fontStyle: "italic",
                color: "rgba(212,175,55,0.85)", textAlign: "left", minHeight: 80,
              }}>
                {typedText}
                {isTyping && <span style={{ animation: "blink 0.8s infinite" }}>|</span>}
              </div>
              {!isTyping && (
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  <button className="tbtn" style={{
                    background: "transparent", border: `1px solid ${gold}`, color: gold,
                    padding: "0.75rem 2rem", fontFamily: "'Cinzel', serif", fontSize: "1rem",
                    cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.3s",
                  }} onClick={startDeepening}>
                    Approfondir (2 cartes)
                  </button>
                  <button className="tbtn" style={{
                    background: "transparent", border: `1px solid ${gold}`, color: gold,
                    padding: "0.75rem 2rem", fontFamily: "'Cinzel', serif", fontSize: "1rem",
                    cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.3s",
                  }} onClick={restart}>
                    Nouveau Rituel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* === SELECTION PROFONDE === */}
          {phase === Phase.DEEP_SELECT && (
            <div>
              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Choisissez 2 arcanes supplementaires</p>
              <p style={{ color: goldDim, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                {deepCards.length} / 2 selectionnees
              </p>
              {deepCards.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                  {deepCards.map((card) => (
                    <RevealedCard key={card.id} card={card} />
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {shuffledDeck.map((card) => {
                  if (flippedIds.has(card.id)) return null;
                  return (
                    <div key={card.id} className="cback" style={{
                      width: 100, height: 160,
                      border: `1px solid ${goldDim}`, borderRadius: 8,
                      cursor: "pointer", overflow: "hidden",
                      transition: "all 0.3s",
                      boxShadow: `0 0 15px ${goldGlow}`,
                    }} onClick={() => selectDeepCard(card)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={CARD_BACK} alt="Carte cachee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* === LECTURE PROFONDE === */}
          {phase === Phase.DEEP_READING && (
            <div>
              <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>Les arcanes revelent leur secret...</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
                {selectedCards.map((card) => (
                  <RevealedCard key={card.id} card={card} size="small" />
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: goldDim, marginBottom: "0.5rem" }}>+ Approfondissement</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
                {deepCards.map((card) => (
                  <RevealedCard key={card.id} card={card} />
                ))}
              </div>
              <div style={{
                background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: 12, padding: "1.5rem 2rem", maxWidth: 600, margin: "0 auto",
                fontSize: "0.95rem", lineHeight: 1.7, fontStyle: "italic",
                color: "rgba(212,175,55,0.85)", textAlign: "left", minHeight: 80,
              }}>
                {typedText}
                {isTyping && <span style={{ animation: "blink 0.8s infinite" }}>|</span>}
              </div>
              {!isTyping && (
                <button className="tbtn" style={{
                  background: "transparent", border: `1px solid ${gold}`, color: gold,
                  padding: "0.75rem 2rem", fontFamily: "'Cinzel', serif", fontSize: "1rem",
                  cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.3s", marginTop: "1.5rem",
                }} onClick={restart}>
                  Nouveau Rituel
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
