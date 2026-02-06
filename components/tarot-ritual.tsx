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
  "Les cartes parlent d'un voyage interieur revelateur. Des energies puissantes se croisent dans votre destinee, creant des opportunites la ou vous ne voyez que des obstacles. Les astres veillent sur votre chemin.",
  "Je vois dans ce tirage une danse entre ombre et lumiere. Votre question touche a l'essence meme de votre transformation personnelle. Les arcanes revelent que vous etes a un carrefour decisif.",
  "Les cartes revelent un chemin de sagesse et de renouveau. Les forces celestes s'alignent pour vous offrir une periode de clarte et de revelation. Ce que vous cherchez est plus proche que vous ne le pensez.",
  "Un vent de changement souffle sur votre destinee. Les arcanes dessinent un tableau riche de promesses et de defis. Chaque epreuve traversee vous rapproche de votre verite interieure.",
];

const DEEP_READINGS = [
  "Les deux arcanes supplementaires eclairent d'une lumiere nouvelle votre lecture. Ce qui semblait obscur trouve maintenant sa signification. Les forces cosmiques confirment que votre instinct premier etait le bon.",
  "Ces nouvelles cartes approfondissent la vision precedente. Elles revelent des couches cachees de votre destinee. Un message clair emerge : le moment d'agir approche.",
  "Les arcanes supplementaires apportent une nuance essentielle. Votre chemin prend un tournant inattendu mais favorable. Les forces invisibles travaillent en votre faveur.",
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- REVEALED CARD ---- */
function RevealedCard({
  card,
  size = "normal",
}: {
  card: DrawnCard;
  size?: "normal" | "small";
}) {
  const isSmall = size === "small";
  return (
    <div className="text-center">
      <div
        className={`${isSmall ? "w-20 h-32" : "w-28 h-44 md:w-32 md:h-48"} rounded-lg overflow-hidden mx-auto`}
        style={{
          border: `2px solid ${card.reversed ? "var(--color-accent)" : "var(--color-primary)"}`,
          boxShadow: card.reversed
            ? "0 0 25px rgba(160,64,64,0.3)"
            : "0 0 25px rgba(212,175,55,0.2)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover"
          style={{
            transform: card.reversed ? "rotate(180deg)" : "none",
          }}
        />
      </div>
      <p
        className={`${isSmall ? "text-xs" : "text-xs md:text-sm"} mt-2 tracking-wide`}
        style={{ color: "var(--color-muted-foreground)" }}
      >
        {card.name}
      </p>
      {card.reversed && (
        <p className="text-xs mt-1 italic" style={{ color: "var(--color-accent)" }}>
          Renversee
        </p>
      )}
    </div>
  );
}

/* ---- MAIN COMPONENT ---- */
export default function TarotRitual({ onRestart }: { onRestart: () => void }) {
  const [phase, setPhase] = useState<Phase>(Phase.QUESTION);
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

  useEffect(
    () => () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    },
    []
  );

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
    const remaining = shuffledDeck.filter(
      (c) => !selectedCards.find((s) => s.id === c.id)
    );
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
        const r =
          DEEP_READINGS[Math.floor(Math.random() * DEEP_READINGS.length)];
        setDeepReading(r);
        setPhase(Phase.DEEP_READING);
        typeText(r);
      }, 1200);
    }
  };

  const btnClasses =
    "bg-transparent border border-primary text-primary px-8 py-3 font-sans text-sm md:text-base tracking-widest cursor-pointer transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:-translate-y-0.5 active:translate-y-0";

  const cardBackClasses =
    "w-24 h-40 md:w-28 md:h-44 rounded-lg cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:border-primary";

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16"
      style={{ animation: "fade-in 0.6s ease-out" }}
    >
      <div className="text-center max-w-3xl w-full">
        {/* QUESTION */}
        {phase === Phase.QUESTION && (
          <div style={{ animation: "fade-in-up 0.6s ease-out" }}>
            <p
              className="text-lg md:text-xl mb-2 tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              Concentrez-vous...
            </p>
            <p
              className="text-sm italic mb-10"
              style={{
                color: "var(--color-muted-foreground)",
                fontFamily: "var(--font-serif)",
              }}
            >
              Quelle question brule dans votre coeur ?
            </p>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitQuestion()}
              placeholder="Posez votre question au destin..."
              className="w-full max-w-lg mx-auto block bg-muted/30 border border-border rounded-lg px-6 py-4 text-foreground font-sans text-base text-center"
              autoFocus
            />
            <button
              className={`${btnClasses} mt-8`}
              style={{
                opacity: question.trim() ? 1 : 0.3,
                pointerEvents: question.trim() ? "auto" : "none",
              }}
              onClick={submitQuestion}
            >
              Consulter les Arcanes
            </button>
          </div>
        )}

        {/* SHUFFLE */}
        {phase === Phase.SHUFFLE && (
          <div style={{ animation: "fade-in 0.4s ease-out" }}>
            <p
              className="text-lg md:text-xl mb-8 tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              Les cartes se melangent...
            </p>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-24 md:w-20 md:h-28 rounded-lg overflow-hidden"
                  style={{
                    border: "1px solid var(--color-border)",
                    animation: `card-bob ${0.4 + i * 0.15}s ease-in-out infinite`,
                    boxShadow: "0 0 15px rgba(212,175,55,0.08)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CARD_BACK}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div
              className="w-8 h-8 border-2 border-primary rounded-full mx-auto mt-10"
              style={{
                borderTopColor: "transparent",
                animation: "spin-slow 1s linear infinite",
              }}
            />
          </div>
        )}

        {/* SELECT 4 CARDS */}
        {phase === Phase.SELECT && (
          <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
            <p
              className="text-lg md:text-xl mb-2 tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              Choisissez 4 arcanes
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
              {selectedCards.length} / 4 selectionnees
            </p>
            {selectedCards.length > 0 && (
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                {selectedCards.map((card) => (
                  <RevealedCard key={card.id} card={card} />
                ))}
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              {shuffledDeck.map((card) => {
                if (flippedIds.has(card.id)) return null;
                return (
                  <div
                    key={card.id}
                    className={cardBackClasses}
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 0 15px rgba(212,175,55,0.06)",
                    }}
                    onClick={() => selectCard(card)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CARD_BACK}
                      alt="Carte cachee"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* READING */}
        {phase === Phase.READING && (
          <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
            <p
              className="text-lg md:text-xl mb-6 tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              La voyante parle...
            </p>
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {selectedCards.map((card) => (
                <RevealedCard key={card.id} card={card} />
              ))}
            </div>
            <div
              className="bg-muted/20 border border-border rounded-xl p-6 md:p-8 max-w-2xl mx-auto text-left leading-relaxed italic"
              style={{
                color: "var(--color-secondary-foreground)",
                fontFamily: "var(--font-serif)",
                fontSize: "1.05rem",
                minHeight: 80,
              }}
            >
              {typedText}
              {isTyping && (
                <span style={{ animation: "blink 0.8s infinite" }}>|</span>
              )}
            </div>
            {!isTyping && (
              <div className="flex gap-4 justify-center flex-wrap mt-8">
                <button className={btnClasses} onClick={startDeepening}>
                  Approfondir (2 cartes)
                </button>
                <button className={btnClasses} onClick={onRestart}>
                  Nouveau Rituel
                </button>
              </div>
            )}
          </div>
        )}

        {/* DEEP SELECT */}
        {phase === Phase.DEEP_SELECT && (
          <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
            <p
              className="text-lg md:text-xl mb-2 tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              Choisissez 2 arcanes supplementaires
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
              {deepCards.length} / 2 selectionnees
            </p>
            {deepCards.length > 0 && (
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                {deepCards.map((card) => (
                  <RevealedCard key={card.id} card={card} />
                ))}
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              {shuffledDeck.map((card) => {
                if (flippedIds.has(card.id)) return null;
                return (
                  <div
                    key={card.id}
                    className={cardBackClasses}
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 0 15px rgba(212,175,55,0.06)",
                    }}
                    onClick={() => selectDeepCard(card)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CARD_BACK}
                      alt="Carte cachee"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DEEP READING */}
        {phase === Phase.DEEP_READING && (
          <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
            <p
              className="text-lg md:text-xl mb-6 tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              Les arcanes revelent leur secret...
            </p>
            <div className="flex justify-center gap-3 mb-4 flex-wrap">
              {selectedCards.map((card) => (
                <RevealedCard key={card.id} card={card} size="small" />
              ))}
            </div>
            <p
              className="text-xs mb-3 tracking-widest uppercase"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              + Approfondissement
            </p>
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {deepCards.map((card) => (
                <RevealedCard key={card.id} card={card} />
              ))}
            </div>
            <div
              className="bg-muted/20 border border-border rounded-xl p-6 md:p-8 max-w-2xl mx-auto text-left leading-relaxed italic"
              style={{
                color: "var(--color-secondary-foreground)",
                fontFamily: "var(--font-serif)",
                fontSize: "1.05rem",
                minHeight: 80,
              }}
            >
              {typedText}
              {isTyping && (
                <span style={{ animation: "blink 0.8s infinite" }}>|</span>
              )}
            </div>
            {!isTyping && (
              <button className={`${btnClasses} mt-8`} onClick={onRestart}>
                Nouveau Rituel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
