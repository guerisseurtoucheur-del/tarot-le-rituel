
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCardType, GameState } from './types';
import { TAROT_DECK } from './constants/tarotDeck';
import { getReading } from './services/geminiService';
import TarotCard from './components/TarotCard';
import Typewriter from './components/Typewriter';
import AudioControl from './components/AudioControl';

const shuffleDeck = (deck: TarotCardType[]): TarotCardType[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

// Bouton principal style "Plaque" (Bois et Or)
const MainPlaqueButton: React.FC<{onClick: () => void; children: React.ReactNode; disabled?: boolean}> = ({onClick, children, disabled}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.02, filter: 'brightness(1.1)' }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    className={`relative px-10 py-4 flex items-center justify-center min-w-[280px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {/* Frame Dorée */}
    <div className="absolute inset-0 border-[3px] border-[#c5a059] rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)]"
         style={{
           background: 'linear-gradient(180deg, #4a3419 0%, #2a1b0c 100%)',
           boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.6)'
         }}>
      {/* Ornements coins */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#fde08d]"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#fde08d]"></div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#fde08d]"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#fde08d]"></div>
    </div>
    <span className="relative z-10 font-cinzel font-bold text-[#fde08d] text-lg tracking-[0.2em] uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
      {children}
    </span>
  </motion.button>
);

// Bouton secondaire style "Approfondir"
const SecondaryButton: React.FC<{onClick: () => void; children: React.ReactNode; disabled?: boolean}> = ({onClick, children, disabled}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.05, color: '#fde08d' }}
    className={`px-6 py-2 border border-[#c5a059]/40 rounded-full text-[#c5a059] font-cinzel text-xs tracking-widest uppercase transition-all ${disabled ? 'opacity-30' : 'hover:border-[#fde08d]'}`}
  >
    {children}
  </motion.button>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [deck, setDeck] = useState<TarotCardType[]>(shuffleDeck(TAROT_DECK));
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    // Initial deal
    handleStartRitual();
    return () => clearInterval(timer);
  }, []);

  const handleStartRitual = () => {
    const newDeck = shuffleDeck(TAROT_DECK);
    const initialDrawn = newDeck.slice(0, 4).map(card => ({...card, revealed: true}));
    setDeck(newDeck.slice(4));
    setDrawnCards(initialDrawn);
    setReading('');
    setUserQuestion('');
    setGameState(GameState.DEALT);
  };

  const fetchReading = useCallback(async (currentCards: TarotCardType[], isDeepening = false) => {
    setIsLoading(true);
    try {
      const res = await getReading(currentCards, userQuestion || "Quel est mon destin ?", isDeepening ? reading : undefined);
      setReading(res);
      setGameState(isDeepening ? GameState.FINAL_READING : GameState.READING);
    } catch (e) {
      setReading("Les cieux sont voilés. Réessayez plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, [userQuestion, reading]);

  const handleDeepen = () => {
    const more = deck.slice(0, 2).map(c => ({...c, revealed: true}));
    const total = [...drawnCards, ...more];
    setDrawnCards(total);
    fetchReading(total, true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden">
      {/* Laptop Frame */}
      <div className="relative w-full max-w-[1280px] aspect-[16/10] bg-[#1a1a1a] rounded-t-3xl border-x-[12px] border-t-[12px] border-[#222] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Screen Background - Fortune Teller Image */}
        <div className="relative flex-grow bg-cover bg-center" 
             style={{ backgroundImage: "url('https://i.imgur.com/3sPjB0p.jpeg')" }}>
          
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

          {/* HUD Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
            
            {/* Top Bar */}
            <header className="flex justify-between items-start">
              <div className="flex flex-col">
                {/* Logo retiré selon instruction */}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full border border-[#fde08d]/40 flex items-center justify-center text-[#fde08d] bg-black/20 backdrop-blur-sm"
              >
                <span className="text-xl font-serif">?</span>
              </motion.button>
            </header>

            {/* Middle Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center -mt-10">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold text-[#fde08d] mb-2 tracking-widest drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
                style={{ fontStyle: 'italic' }}
              >
                TIRAGE INITIAL DE {drawnCards.length} CARTES
              </motion.h1>
              
              <p className="text-[#e0c097] italic text-lg md:text-xl mb-10 drop-shadow-md">
                Posez votre question... et révele voutr chemin..
              </p>

              {/* Cards Row */}
              <div className="flex gap-4 md:gap-6 mb-12">
                <AnimatePresence>
                  {drawnCards.map((card, i) => (
                    <motion.div
                      key={card.name + i}
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TarotCard card={card} isRevealed={true} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Question Input and Buttons */}
              <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                {gameState === GameState.DEALT && (
                  <input 
                    type="text"
                    placeholder="Tapez votre question ici..."
                    className="w-full bg-transparent border-b border-[#c5a059]/30 text-[#fde08d] text-center text-xl md:text-2xl p-2 focus:outline-none focus:border-[#fde08d] placeholder-[#c5a059]/40 italic font-serif transition-all"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                  />
                )}

                {reading && !isLoading && (
                  <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg border border-[#c5a059]/20 max-h-[150px] overflow-y-auto w-full text-[#fde08d] text-lg italic">
                    <Typewriter text={reading} speed={0.03} />
                  </div>
                )}

                {isLoading && (
                  <div className="text-[#fde08d] animate-pulse italic text-lg">La cartomancienne déchiffre les fils du destin...</div>
                )}

                <div className="flex flex-wrap justify-center items-center gap-8">
                  {gameState === GameState.DEALT && (
                    <MainPlaqueButton onClick={() => fetchReading(drawnCards)}>
                      RÉVÉLER MON DESTIN
                    </MainPlaqueButton>
                  )}
                  {gameState === GameState.READING && drawnCards.length === 4 && (
                    <SecondaryButton onClick={handleDeepen}>
                      APPROFONDIR LE TIRAGE (2 CARTES)
                    </SecondaryButton>
                  )}
                  {(gameState === GameState.FINAL_READING || (gameState === GameState.READING && drawnCards.length === 4)) && (
                     <button onClick={handleStartRitual} className="text-[#c5a059] border-b border-[#c5a059]/40 text-xs tracking-[0.3em] uppercase hover:text-[#fde08d] transition-colors">
                        Nouveau Rituel
                     </button>
                  )}
                </div>
              </div>
            </main>

            {/* Footer HUD */}
            <footer className="flex justify-between items-end text-[#c5a059] font-bold text-xs tracking-widest uppercase">
              <AudioControl />
              <div className="flex items-center gap-4">
                <span>{currentDate.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).replace(',', '')} PM CET</span>
                <div className="w-6 h-6 bg-[#fde08d] clip-star shadow-[0_0_10px_#fde08d]" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
              </div>
            </footer>
          </div>
        </div>

        {/* Laptop Lower Bezel */}
        <div className="h-4 bg-[#111] w-full border-t border-black flex justify-center items-center">
            <div className="w-20 h-1 bg-[#333] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
