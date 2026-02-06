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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  console.log("[v0] App component rendering");
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

  // Intro sequence
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Fortune phrase rotation
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

  console.log("[v0] Current gameState:", gameState, "showIntro:", showIntro);

  // --- RENDER ---

  return (
    <div
      className="min-h-screen bg-[#050505] text-[#d4af37] overflow-x-hidden relative"
      style={{ fontFamily: "'Cinzel', serif", minHeight: '100vh', backgroundColor: '#050505', color: '#d4af37' }}
    >
      <MysticParticles />
      <Candle side="left" />
      <Candle side="right" />
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      {/* Audio toggle */}
      <motion.button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 p-3 rounded-full border border-[#d4af37]/20 bg-[#0a0a0a]/80 backdrop-blur-sm"
        whileHover={{ scale: 1.1, borderColor: 'rgba(212,175,55,0.5)' }}
        whileTap={{ scale: 0.9 }}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505' }}
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
              className="text-2xl md:text-4xl tracking-[0.3em] uppercase mt-8 text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Le Rituel du Tarot
            </motion.h1>
            <motion.div
              className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            />
            <motion.p
              className="text-[#d4af37]/40 text-xs tracking-[0.2em] mt-3 italic"
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
            className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', position: 'relative', zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <CrystalBall />

            <motion.h1
              className="text-xl sm:text-2xl md:text-4xl tracking-[0.2em] uppercase mt-8 mb-2 text-center text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Le Rituel du Tarot
            </motion.h1>

            <motion.div
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />

            <motion.p
              className="text-[#d4af37]/50 text-xs sm:text-sm italic text-center max-w-md mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {fortunePhrase}
            </motion.p>

            <motion.div
              className="w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <label className="block text-xs tracking-[0.3em] uppercase text-[#d4af37]/60 mb-3 text-center">
                Quelle est votre question ?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartRitual()}
                  placeholder="Posez votre question au destin..."
                  className="w-full bg-[#0a0505]/80 border border-[#d4af37]/20 rounded-lg px-5 py-4 text-[#d4af37] placeholder-[#d4af37]/20 text-sm md:text-base focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, transparent 70%)',
                  }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              <motion.button
                onClick={handleStartRitual}
                disabled={!question.trim()}
                className="mt-6 mx-auto block px-10 py-3 bg-transparent border border-[#d4af37]/40 rounded-lg text-[#d4af37] text-sm tracking-[0.2em] uppercase transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                whileHover={question.trim() ? {
                  scale: 1.05,
                  borderColor: 'rgba(212,175,55,0.8)',
                  boxShadow: '0 0 20px rgba(212,175,55,0.15)',
                } : {}}
                whileTap={question.trim() ? { scale: 0.95 } : {}}
              >
                Commencer le Rituel
              </motion.button>
            </motion.div>

            {/* Decorative bottom symbols */}
            <motion.div
              className="flex items-center gap-4 mt-16 text-[#d4af37]/15 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span>&#9789;</span>
              <span className="w-12 h-[1px] bg-[#d4af37]/10" />
              <span>&#9788;</span>
              <span className="w-12 h-[1px] bg-[#d4af37]/10" />
              <span>&#9790;</span>
            </motion.div>
          </motion.div>
        )}

        {/* ===== SHUFFLING ANIMATION ===== */}
        {isShuffling && (
          <motion.div
            key="shuffling"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050505]/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-32 h-48">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-lg border border-[#d4af37]/30"
                  style={{
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
              className="mt-8 text-sm tracking-[0.3em] uppercase text-[#d4af37]/60"
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
            className="min-h-screen flex flex-col items-center pt-8 px-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-lg sm:text-xl md:text-2xl tracking-[0.15em] uppercase mb-2 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choisissez 4 Arcanes
            </motion.h2>
            <motion.p
              className="text-[#d4af37]/40 text-xs sm:text-sm italic mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Laissez votre intuition vous guider...
            </motion.p>

            {/* Selected count */}
            <motion.div className="flex items-center gap-2 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${
                    i < selectedCards.length
                      ? 'bg-[#d4af37] border-[#d4af37]'
                      : 'border-[#d4af37]/30'
                  }`}
                  animate={
                    i < selectedCards.length
                      ? { scale: [1, 1.4, 1], boxShadow: ['0 0 0px #d4af37', '0 0 12px #d4af37', '0 0 4px #d4af37'] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                />
              ))}
            </motion.div>

            {/* Card spread */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl pb-8">
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

            {/* Loading state */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050505]/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-16 h-16 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.p
                    className="mt-6 text-sm tracking-[0.2em] text-[#d4af37]/50"
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
            className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              className="text-lg sm:text-xl md:text-2xl tracking-[0.15em] uppercase mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Votre Tirage
            </motion.h2>

            {/* Selected cards display */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
              {selectedCards.map((card, i) => (
                <motion.div
                  key={card.name}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8, type: 'spring' }}
                >
                  <div
                    className="w-[90px] h-[155px] sm:w-[110px] sm:h-[185px] md:w-[130px] md:h-[220px] rounded-lg overflow-hidden border-2 border-[#d4af37]/50 relative"
                    style={{
                      boxShadow: '0 0 20px rgba(212,175,55,0.15), 0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 pt-4">
                      <p className="text-[8px] sm:text-[10px] font-bold tracking-wider text-[#d4af37] uppercase text-center">
                        {card.name}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="mt-2 text-[9px] tracking-[0.15em] text-[#d4af37]/40 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.5 }}
                  >
                    {['Passe', 'Present', 'Obstacle', 'Avenir'][i]}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Reading text */}
            <motion.div
              className="max-w-2xl w-full bg-[#0a0505]/60 border border-[#d4af37]/15 rounded-xl p-6 md:p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{
                boxShadow: '0 0 40px rgba(212,175,55,0.05), inset 0 0 30px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/40" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4af37]/50">
                  La Cartomancienne parle
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
              </div>
              <div className="text-[#d4af37]/80 text-sm md:text-base leading-relaxed italic">
                <Typewriter text={reading} speed={0.025} />
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                onClick={handleDeepen}
                className="px-8 py-3 border border-[#d4af37]/40 rounded-lg text-[#d4af37] text-xs sm:text-sm tracking-[0.15em] uppercase"
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(212,175,55,0.8)',
                  boxShadow: '0 0 20px rgba(212,175,55,0.15)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                Approfondir le Tirage
              </motion.button>
              <motion.button
                onClick={handleNewReading}
                className="px-8 py-3 border border-[#d4af37]/20 rounded-lg text-[#d4af37]/50 text-xs sm:text-sm tracking-[0.15em] uppercase"
                whileHover={{
                  scale: 1.05,
                  color: 'rgba(212,175,55,1)',
                  borderColor: 'rgba(212,175,55,0.5)',
                }}
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
            className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              className="text-lg sm:text-xl md:text-2xl tracking-[0.15em] uppercase mb-2 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Approfondissement
            </motion.h2>
            <motion.p
              className="text-[#d4af37]/40 text-xs sm:text-sm italic mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Deux arcanes supplementaires eclairent votre chemin...
              <br />
              Retournez-les pour completer la vision.
            </motion.p>

            {/* Original 4 cards (small) */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {selectedCards.map((card, i) => (
                <motion.div
                  key={card.name}
                  className="w-[60px] h-[100px] sm:w-[70px] sm:h-[115px] rounded border border-[#d4af37]/30 overflow-hidden relative opacity-70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 }}
            />

            {/* Deep cards */}
            <div className="flex gap-6 md:gap-10 mb-8">
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
                  className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050505]/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-16 h-16 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.p
                    className="mt-6 text-sm tracking-[0.2em] text-[#d4af37]/50"
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
            className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.h2
              className="text-lg sm:text-xl md:text-2xl tracking-[0.15em] uppercase mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Lecture Approfondie
            </motion.h2>

            {/* All 6 cards */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
              {[...selectedCards, ...deepCards].map((card, i) => (
                <motion.div
                  key={card.name}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div
                    className={`rounded-lg overflow-hidden border-2 relative ${
                      i >= 4
                        ? 'border-[#d4af37]/70 w-[90px] h-[155px] sm:w-[110px] sm:h-[185px] md:w-[130px] md:h-[220px]'
                        : 'border-[#d4af37]/30 w-[70px] h-[120px] sm:w-[85px] sm:h-[145px] md:w-[100px] md:h-[170px]'
                    }`}
                    style={{
                      boxShadow: i >= 4
                        ? '0 0 25px rgba(212,175,55,0.2), 0 8px 32px rgba(0,0,0,0.4)'
                        : '0 4px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-3">
                      <p className="text-[7px] sm:text-[8px] font-bold tracking-wider text-[#d4af37] uppercase text-center">
                        {card.name}
                      </p>
                    </div>
                  </div>
                  {i < 4 && (
                    <span className="mt-1 text-[8px] tracking-wider text-[#d4af37]/30 uppercase">
                      {['Passe', 'Present', 'Obstacle', 'Avenir'][i]}
                    </span>
                  )}
                  {i >= 4 && (
                    <span className="mt-1 text-[8px] tracking-wider text-[#d4af37]/50 uppercase">
                      {['Eclairage', 'Conseil'][i - 4]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Previous reading (collapsed) */}
            <motion.div
              className="max-w-2xl w-full bg-[#0a0505]/40 border border-[#d4af37]/10 rounded-lg p-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37]/30 mb-2">Premiere Lecture</p>
              <p className="text-[#d4af37]/40 text-xs leading-relaxed italic line-clamp-3">{reading}</p>
            </motion.div>

            {/* Deep reading */}
            <motion.div
              className="max-w-2xl w-full bg-[#0a0505]/60 border border-[#d4af37]/15 rounded-xl p-6 md:p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{
                boxShadow: '0 0 40px rgba(212,175,55,0.05), inset 0 0 30px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/40" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4af37]/50">
                  Revelation Finale
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
              </div>
              <div className="text-[#d4af37]/80 text-sm md:text-base leading-relaxed italic">
                <Typewriter text={deepReading} speed={0.025} />
              </div>
            </motion.div>

            {/* New reading button */}
            <motion.button
              onClick={handleNewReading}
              className="mt-8 px-10 py-3 border border-[#d4af37]/40 rounded-lg text-[#d4af37] text-xs sm:text-sm tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(212,175,55,0.8)',
                boxShadow: '0 0 20px rgba(212,175,55,0.15)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              Nouveau Rituel
            </motion.button>

            {/* Footer ornament */}
            <motion.div
              className="flex items-center gap-3 mt-10 text-[#d4af37]/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <span className="w-16 h-[1px] bg-[#d4af37]/10" />
              <span className="text-lg">&#9788;</span>
              <span className="w-16 h-[1px] bg-[#d4af37]/10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
