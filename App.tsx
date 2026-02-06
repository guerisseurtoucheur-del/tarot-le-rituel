import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MysticParticles from './components/MysticParticles';
import RitualCard from './components/RitualCard';
import CrystalBall from './components/CrystalBall';
import Candle from './components/Candle';
import Typewriter from './components/Typewriter';
import { TAROT_DECK } from './constants/tarotDeck';
import { getReading } from './services/geminiService';
import { TarotCardType, GameState } from './types';

const FORTUNE_TELLER_PHRASES = [
  "Les arcanes murmurent... je sens une presence forte.",
  "Les etoiles s'alignent pour votre lecture ce soir...",
  "Concentrez-vous... l'univers a un message pour vous.",
  "Les cartes vous attendaient... elles ont des choses a reveler.",
  "Le voile entre les mondes s'amincit... posez votre question.",
];

const GOLD = '#d4af37';
const BG = '#050505';
const BG_CARD = '#0a0505';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [question, setQuestion] = useState('');
  const [shuffledDeck, setShuffledDeck] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState('');
  const [deepReading, setDeepReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fortunePhrase, setFortunePhrase] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [deepCards, setDeepCards] = useState<TarotCardType[]>([]);
  const [deepRevealed, setDeepRevealed] = useState<Set<number>>(new Set());

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a21a5c68c3.mp3';

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState === GameState.INITIAL && !showIntro) {
      setFortunePhrase(FORTUNE_TELLER_PHRASES[Math.floor(Math.random() * FORTUNE_TELLER_PHRASES.length)]);
    }
  }, [gameState, showIntro]);

  const handleStartRitual = useCallback(() => {
    if (!question.trim()) return;
    setIsShuffling(true);
    const shuffled = shuffleArray(TAROT_DECK);
    setTimeout(() => {
      setShuffledDeck(shuffled);
      setIsShuffling(false);
      setGameState(GameState.DEALT);
    }, 2000);
  }, [question]);

  const handleSelectCard = useCallback((card: TarotCardType, index: number) => {
    if (selectedCards.length >= 4) return;
    if (selectedCards.find((c) => c.name === card.name)) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
    setRevealedCards((prev) => new Set(prev).add(index));

    if (newSelected.length === 4) {
      setIsLoading(true);
      getReading(newSelected, question)
        .then((text) => {
          setReading(text);
          setGameState(GameState.READING);
        })
        .catch(() => {
          setReading("Les esprits sont troubles... Reessayez dans un instant.");
          setGameState(GameState.READING);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedCards, question]);

  const handleDeepen = useCallback(() => {
    const remainingDeck = shuffledDeck.filter(
      (c) => !selectedCards.find((s) => s.name === c.name)
    );
    const extraCards = shuffleArray(remainingDeck).slice(0, 2);
    setDeepCards(extraCards);
    setGameState(GameState.DEEPENING);
  }, [shuffledDeck, selectedCards]);

  const handleSelectDeepCard = useCallback((card: TarotCardType, index: number) => {
    setDeepRevealed((prev) => new Set(prev).add(index));

    if (deepRevealed.size + 1 === 2) {
      setIsLoading(true);
      const allCards = [...selectedCards, ...deepCards];
      getReading(allCards, question, reading)
        .then((text) => {
          setDeepReading(text);
          setGameState(GameState.FINAL_READING);
        })
        .catch(() => {
          setDeepReading("Le voile se referme... mais les cartes ont parle.");
          setGameState(GameState.FINAL_READING);
        })
        .finally(() => setIsLoading(false));
    }
  }, [deepRevealed, selectedCards, deepCards, question, reading]);

  const handleNewReading = useCallback(() => {
    setGameState(GameState.INITIAL);
    setQuestion('');
    setShuffledDeck([]);
    setSelectedCards([]);
    setRevealedCards(new Set());
    setReading('');
    setDeepReading('');
    setDeepCards([]);
    setDeepRevealed(new Set());
    setFortunePhrase(FORTUNE_TELLER_PHRASES[Math.floor(Math.random() * FORTUNE_TELLER_PHRASES.length)]);
  }, []);

  const visibleDeck = useMemo(() => {
    if (gameState !== GameState.DEALT) return [];
    return shuffledDeck.slice(0, 12);
  }, [shuffledDeck, gameState]);

  // --- Styles ---
  const s = {
    root: {
      fontFamily: "'Cinzel', serif",
      minHeight: '100vh',
      backgroundColor: BG,
      color: GOLD,
      overflowX: 'hidden' as const,
      position: 'relative' as const,
    },
    audioBtn: {
      position: 'fixed' as const,
      top: 16,
      right: 16,
      zIndex: 50,
      padding: 12,
      borderRadius: '50%',
      border: `1px solid ${GOLD}33`,
      backgroundColor: `${BG_CARD}cc`,
      backdropFilter: 'blur(4px)',
      cursor: 'pointer',
    },
    fullOverlay: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: BG,
    },
    centerCol: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 1rem',
      position: 'relative' as const,
      zIndex: 10,
    },
    topCol: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 64,
      paddingLeft: 16,
      paddingRight: 16,
      position: 'relative' as const,
      zIndex: 10,
    },
    title: {
      fontSize: 'clamp(1.1rem, 4vw, 2.2rem)',
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      marginTop: 32,
      marginBottom: 8,
      textAlign: 'center' as const,
      textWrap: 'balance' as const,
    },
    subtitle: {
      fontSize: 'clamp(0.9rem, 3vw, 1.5rem)',
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const,
      marginBottom: 8,
      textAlign: 'center' as const,
    },
    divider: {
      width: 96,
      height: 1,
      background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
      marginBottom: 24,
    },
    phrase: {
      color: `${GOLD}80`,
      fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
      fontStyle: 'italic',
      textAlign: 'center' as const,
      maxWidth: 420,
      marginBottom: 40,
      lineHeight: 1.6,
    },
    label: {
      display: 'block',
      fontSize: '0.7rem',
      letterSpacing: '0.3em',
      textTransform: 'uppercase' as const,
      color: `${GOLD}99`,
      marginBottom: 12,
      textAlign: 'center' as const,
    },
    input: {
      width: '100%',
      maxWidth: 480,
      backgroundColor: `${BG_CARD}cc`,
      border: `1px solid ${GOLD}33`,
      borderRadius: 8,
      padding: '14px 20px',
      color: GOLD,
      fontSize: 'clamp(0.8rem, 2vw, 1rem)',
      fontFamily: "'Cinzel', serif",
      outline: 'none',
    },
    btn: {
      marginTop: 24,
      padding: '12px 40px',
      backgroundColor: 'transparent',
      border: `1px solid ${GOLD}66`,
      borderRadius: 8,
      color: GOLD,
      fontSize: '0.8rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
    },
    btnDisabled: {
      opacity: 0.2,
      cursor: 'not-allowed',
    },
    cardGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: 12,
      maxWidth: 900,
      paddingBottom: 32,
    },
    dotRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 24,
    },
    dot: (active: boolean) => ({
      width: 12,
      height: 12,
      borderRadius: '50%',
      border: `1px solid ${active ? GOLD : GOLD + '4d'}`,
      backgroundColor: active ? GOLD : 'transparent',
      transition: 'all 0.3s',
      boxShadow: active ? `0 0 8px ${GOLD}` : 'none',
    }),
    readingBox: {
      maxWidth: 640,
      width: '100%',
      backgroundColor: `${BG_CARD}99`,
      border: `1px solid ${GOLD}26`,
      borderRadius: 12,
      padding: 'clamp(16px, 4vw, 32px)',
      boxShadow: `0 0 40px ${GOLD}0d, inset 0 0 30px rgba(0,0,0,0.3)`,
    },
    readingHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    readingLine: {
      height: 1,
      background: `linear-gradient(to right, transparent, ${GOLD}66)`,
    },
    readingLabel: {
      fontSize: '0.6rem',
      letterSpacing: '0.3em',
      textTransform: 'uppercase' as const,
      color: `${GOLD}80`,
      whiteSpace: 'nowrap' as const,
    },
    readingText: {
      color: `${GOLD}cc`,
      fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
      lineHeight: 1.7,
      fontStyle: 'italic',
    },
    loadingOverlay: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${BG}e6`,
    },
    spinner: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      border: `2px solid ${GOLD}33`,
      borderTopColor: GOLD,
    },
    loadingText: {
      marginTop: 24,
      fontSize: '0.85rem',
      letterSpacing: '0.2em',
      color: `${GOLD}80`,
    },
    cardRevealRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: 16,
      marginBottom: 32,
    },
    revealCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    revealImg: (big: boolean) => ({
      width: big ? 'clamp(90px, 15vw, 130px)' : 'clamp(70px, 12vw, 100px)',
      height: big ? 'clamp(155px, 25vw, 220px)' : 'clamp(120px, 20vw, 170px)',
      borderRadius: 8,
      overflow: 'hidden' as const,
      border: `2px solid ${big ? GOLD + 'b3' : GOLD + '4d'}`,
      position: 'relative' as const,
      boxShadow: big
        ? `0 0 25px ${GOLD}33, 0 8px 32px rgba(0,0,0,0.4)`
        : `0 4px 16px rgba(0,0,0,0.3)`,
    }),
    imgFill: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    cardOverlay: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
      padding: '16px 4px 4px',
    },
    cardName: {
      fontSize: 'clamp(7px, 1.5vw, 10px)',
      fontWeight: 'bold' as const,
      letterSpacing: '0.1em',
      color: GOLD,
      textTransform: 'uppercase' as const,
      textAlign: 'center' as const,
    },
    positionLabel: (dim: boolean) => ({
      marginTop: 4,
      fontSize: '0.5rem',
      letterSpacing: '0.15em',
      color: dim ? `${GOLD}4d` : `${GOLD}80`,
      textTransform: 'uppercase' as const,
    }),
    symbolRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginTop: 64,
      color: `${GOLD}26`,
      fontSize: '1.2rem',
    },
    symbolLine: {
      width: 48,
      height: 1,
      backgroundColor: `${GOLD}1a`,
    },
    btnRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: 16,
      marginTop: 32,
    },
    btnSecondary: {
      padding: '12px 32px',
      backgroundColor: 'transparent',
      border: `1px solid ${GOLD}33`,
      borderRadius: 8,
      color: `${GOLD}80`,
      fontSize: '0.75rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const,
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
    },
    miniCard: {
      width: 'clamp(50px, 10vw, 70px)',
      height: 'clamp(85px, 16vw, 115px)',
      borderRadius: 4,
      border: `1px solid ${GOLD}4d`,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      opacity: 0.7,
    },
    collapsedReading: {
      maxWidth: 640,
      width: '100%',
      backgroundColor: `${BG_CARD}66`,
      border: `1px solid ${GOLD}1a`,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    collapsedLabel: {
      fontSize: '0.6rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color: `${GOLD}4d`,
      marginBottom: 8,
    },
    collapsedText: {
      color: `${GOLD}66`,
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontStyle: 'italic',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    },
  };

  return (
    <div style={s.root}>
      <MysticParticles />
      <Candle side="left" />
      <Candle side="right" />
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      {/* Audio toggle */}
      <motion.button
        onClick={toggleAudio}
        style={s.audioBtn}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? 'Couper le son' : 'Activer le son'}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </motion.button>

      {/* ===== INTRO SPLASH ===== */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            style={s.fullOverlay}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <CrystalBall />
            </motion.div>
            <motion.h1
              style={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Le Rituel du Tarot
            </motion.h1>
            <motion.div
              style={s.divider}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            />
            <motion.p
              style={{ color: `${GOLD}66`, fontSize: '0.7rem', letterSpacing: '0.2em', fontStyle: 'italic' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              de Grimaud
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT ===== */}
      <AnimatePresence mode="wait">
        {/* ===== PHASE 1: QUESTION ===== */}
        {gameState === GameState.INITIAL && !showIntro && (
          <motion.div
            key="initial"
            style={s.centerCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <CrystalBall />

            <motion.h1
              style={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Le Rituel du Tarot
            </motion.h1>

            <motion.div
              style={s.divider}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />

            <motion.p
              style={s.phrase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {fortunePhrase}
            </motion.p>

            <motion.div
              style={{ width: '100%', maxWidth: 480 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <label style={s.label}>
                Quelle est votre question ?
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartRitual()}
                  placeholder="Posez votre question au destin..."
                  style={s.input}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.button
                  onClick={handleStartRitual}
                  disabled={!question.trim()}
                  style={{
                    ...s.btn,
                    ...(question.trim() ? {} : s.btnDisabled),
                  }}
                  whileHover={question.trim() ? {
                    scale: 1.05,
                    borderColor: `${GOLD}cc`,
                    boxShadow: `0 0 20px ${GOLD}26`,
                  } : {}}
                  whileTap={question.trim() ? { scale: 0.95 } : {}}
                >
                  Commencer le Rituel
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              style={s.symbolRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span>&#9789;</span>
              <span style={s.symbolLine} />
              <span>&#9788;</span>
              <span style={s.symbolLine} />
              <span>&#9790;</span>
            </motion.div>
          </motion.div>
        )}

        {/* ===== SHUFFLING ANIMATION ===== */}
        {isShuffling && (
          <motion.div
            key="shuffling"
            style={{ ...s.loadingOverlay, zIndex: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{ position: 'relative', width: 128, height: 192 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    border: `1px solid ${GOLD}4d`,
                    background: 'linear-gradient(145deg, #1a0a0a, #0d0505)',
                  }}
                  animate={{
                    x: [0, (i - 2) * 40, 0, -(i - 2) * 30, 0],
                    y: [0, -20, 0, -15, 0],
                    rotateZ: [0, (i - 2) * 8, 0, -(i - 2) * 5, 0],
                    rotateY: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.8,
                    ease: 'easeInOut',
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
            <motion.p
              style={s.loadingText}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Le destin melange les arcanes...
            </motion.p>
          </motion.div>
        )}

        {/* ===== PHASE 2: CARD SELECTION ===== */}
        {gameState === GameState.DEALT && (
          <motion.div
            key="dealt"
            style={s.topCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              style={s.subtitle}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choisissez 4 Arcanes
            </motion.h2>
            <motion.p
              style={{ ...s.phrase, marginBottom: 8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Laissez votre intuition vous guider...
            </motion.p>

            {/* Progress dots */}
            <div style={s.dotRow}>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  style={s.dot(i < selectedCards.length)}
                  animate={
                    i < selectedCards.length
                      ? { scale: [1, 1.4, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>

            {/* Card spread */}
            <div style={s.cardGrid}>
              {visibleDeck.map((card, index) => {
                const isSelected = !!selectedCards.find((c) => c.name === card.name);
                return (
                  <RitualCard
                    key={card.name}
                    card={card}
                    index={index}
                    isRevealed={revealedCards.has(index)}
                    isSelectable={!isSelected && selectedCards.length < 4}
                    isSelected={isSelected}
                    onClick={() => handleSelectCard(card, index)}
                  />
                );
              })}
            </div>

            {/* Loading overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  style={s.loadingOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    style={s.spinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.p
                    style={s.loadingText}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    La cartomancienne lit les arcanes...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ===== PHASE 3: READING ===== */}
        {gameState === GameState.READING && (
          <motion.div
            key="reading"
            style={s.topCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              style={s.subtitle}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Votre Tirage
            </motion.h2>

            {/* Selected cards display */}
            <div style={s.cardRevealRow}>
              {selectedCards.map((card, i) => (
                <motion.div
                  key={card.name}
                  style={s.revealCard}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8, type: 'spring' }}
                >
                  <div style={s.revealImg(true)}>
                    <img src={card.imageUrl} alt={card.name} style={s.imgFill} crossOrigin="anonymous" />
                    <div style={s.cardOverlay}>
                      <p style={s.cardName}>{card.name}</p>
                    </div>
                  </div>
                  <motion.span
                    style={s.positionLabel(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.5 }}
                  >
                    {['Passe', 'Present', 'Obstacle', 'Avenir'][i]}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Reading text */}
            <motion.div
              style={s.readingBox}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div style={s.readingHeader}>
                <div style={{ ...s.readingLine, width: 32 }} />
                <span style={s.readingLabel}>La Cartomancienne parle</span>
                <div style={{ ...s.readingLine, flex: 1 }} />
              </div>
              <div style={s.readingText}>
                <Typewriter text={reading} speed={0.025} />
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              style={s.btnRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                onClick={handleDeepen}
                style={s.btn}
                whileHover={{ scale: 1.05, borderColor: `${GOLD}cc`, boxShadow: `0 0 20px ${GOLD}26` }}
                whileTap={{ scale: 0.95 }}
              >
                Approfondir le Tirage
              </motion.button>
              <motion.button
                onClick={handleNewReading}
                style={s.btnSecondary}
                whileHover={{ scale: 1.05, color: GOLD, borderColor: `${GOLD}80` }}
                whileTap={{ scale: 0.95 }}
              >
                Nouveau Tirage
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ===== PHASE 4: DEEPENING ===== */}
        {gameState === GameState.DEEPENING && (
          <motion.div
            key="deepening"
            style={s.topCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              style={s.subtitle}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Approfondissement
            </motion.h2>
            <motion.p
              style={{ ...s.phrase, marginBottom: 32 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Deux arcanes supplementaires eclairent votre chemin...
              <br />
              Retournez-les pour completer la vision.
            </motion.p>

            {/* Original 4 cards (small) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              {selectedCards.map((card, i) => (
                <motion.div
                  key={card.name}
                  style={s.miniCard}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <img src={card.imageUrl} alt={card.name} style={s.imgFill} crossOrigin="anonymous" />
                </motion.div>
              ))}
            </div>

            <motion.div
              style={{ ...s.divider, width: 64, marginBottom: 24 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 }}
            />

            {/* Deep cards */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
              {deepCards.map((card, index) => (
                <RitualCard
                  key={card.name}
                  card={card}
                  index={index}
                  isRevealed={deepRevealed.has(index)}
                  isSelectable={!deepRevealed.has(index)}
                  isSelected={deepRevealed.has(index)}
                  onClick={() => handleSelectDeepCard(card, index)}
                />
              ))}
            </div>

            {/* Loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  style={s.loadingOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    style={s.spinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.p
                    style={s.loadingText}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Les arcanes revelent leurs secrets profonds...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ===== PHASE 5: FINAL READING ===== */}
        {gameState === GameState.FINAL_READING && (
          <motion.div
            key="final"
            style={s.topCol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.h2
              style={s.subtitle}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Lecture Approfondie
            </motion.h2>

            {/* All 6 cards */}
            <div style={s.cardRevealRow}>
              {[...selectedCards, ...deepCards].map((card, i) => (
                <motion.div
                  key={card.name}
                  style={s.revealCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div style={s.revealImg(i >= 4)}>
                    <img src={card.imageUrl} alt={card.name} style={s.imgFill} crossOrigin="anonymous" />
                    <div style={s.cardOverlay}>
                      <p style={s.cardName}>{card.name}</p>
                    </div>
                  </div>
                  {i < 4 && <span style={s.positionLabel(true)}>{['Passe', 'Present', 'Obstacle', 'Avenir'][i]}</span>}
                  {i >= 4 && <span style={s.positionLabel(false)}>{['Eclairage', 'Conseil'][i - 4]}</span>}
                </motion.div>
              ))}
            </div>

            {/* Previous reading */}
            <motion.div
              style={s.collapsedReading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p style={s.collapsedLabel}>Premiere Lecture</p>
              <p style={s.collapsedText}>{reading}</p>
            </motion.div>

            {/* Deep reading */}
            <motion.div
              style={s.readingBox}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div style={s.readingHeader}>
                <div style={{ ...s.readingLine, width: 32 }} />
                <span style={s.readingLabel}>Revelation Finale</span>
                <div style={{ ...s.readingLine, flex: 1 }} />
              </div>
              <div style={s.readingText}>
                <Typewriter text={deepReading} speed={0.025} />
              </div>
            </motion.div>

            {/* New reading button */}
            <motion.div style={{ display: 'flex', justifyContent: 'center' }}>
              <motion.button
                onClick={handleNewReading}
                style={{ ...s.btn, marginTop: 32 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05, borderColor: `${GOLD}cc`, boxShadow: `0 0 20px ${GOLD}26` }}
                whileTap={{ scale: 0.95 }}
              >
                Nouveau Rituel
              </motion.button>
            </motion.div>

            {/* Footer ornament */}
            <motion.div
              style={s.symbolRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <span style={s.symbolLine} />
              <span>&#9788;</span>
              <span style={s.symbolLine} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
