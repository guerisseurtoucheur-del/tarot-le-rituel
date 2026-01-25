
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

// Bouton principal style "Plaque" (Bois sombre et Or brossé)
const MainPlaqueButton: React.FC<{onClick: () => void; children: React.ReactNode; disabled?: boolean}> = ({onClick, children, disabled}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.02, filter: 'brightness(1.1)' }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    className={`relative px-12 py-5 flex items-center justify-center min-w-[300px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {/* Fond Plaque Bois avec texture */}
    <div className="absolute inset-0 border-[3px] border-[#c5a059] rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
         style={{
           background: 'linear-gradient(180deg, #3d2b14 0%, #1a1108 100%)',
           boxShadow: 'inset 0 0 20px rgba(0,0,0,1), 0 8px 25px rgba(0,0,0,0.8)'
         }}>
      {/* Texture bois subtile */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-matter.png)' }}></div>
      
      {/* Ornements dorés aux coins */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-[4px] border-l-[4px] border-[#fde08d] shadow-[0_0_8px_rgba(253,224,141,0.4)]"></div>
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-[4px] border-r-[4px] border-[#fde08d] shadow-[0_0_8px_rgba(253,224,141,0.4)]"></div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-[4px] border-l-[4px] border-[#fde08d] shadow-[0_0_8px_rgba(253,224,141,0.4)]"></div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-[4px] border-r-[4px] border-[#fde08d] shadow-[0_0_8px_rgba(253,224,141,0.4)]"></div>
    </div>
    
    <span className="relative z-10 font-cinzel font-bold text-[#fde08d] text-xl md:text-2xl tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
      {children}
    </span>
  </motion.button>
);

const SecondaryButton: React.FC<{onClick: () => void; children: React.ReactNode; disabled?: boolean}> = ({onClick, children, disabled}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.05, color: '#fde08d' }}
    className={`px-8 py-3 border border-[#c5a059]/40 rounded-full text-[#c5a059] font-cinzel text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all bg-black/40 backdrop-blur-md ${disabled ? 'opacity-30' : 'hover:border-[#fde08d] shadow-xl'}`}
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
    if (!userQuestion.trim() && !isDeepening) return;
    setIsLoading(true);
    try {
      const res = await getReading(currentCards, userQuestion || "Quel est mon destin ?", isDeepening ? reading : undefined);
      setReading(res);
      setGameState(isDeepening ? GameState.FINAL_READING : GameState.READING);
    } catch (e) {
      setReading("Les cieux sont voilés. L'astral ne répond pas à votre appel.");
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
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 md:p-10 overflow-hidden font-cinzel">
      {/* Laptop Frame */}
      <div className="relative w-full max-w-[1400px] aspect-[16/10] bg-[#1a1a1a] rounded-t-3xl border-x-[14px] border-t-[14px] border-[#252525] shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        
        {/* Screen Content */}
        <div className="relative flex-grow bg-cover bg-center" 
             style={{ backgroundImage: "url('https://i.imgur.com/3sPjB0p.jpeg')" }}>
          
          {/* Overlays pour l'immersion */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-brightness-90"></div>

          {/* HUD Content */}
          <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
            
            {/* Top Bar - Purifié sans aucun logo */}
            <header className="flex justify-end items-start">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="w-12 h-12 rounded-full border-2 border-[#fde08d]/50 flex items-center justify-center text-[#fde08d] bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(253,224,141,0.2)]"
              >
                <span className="text-2xl font-serif font-bold">?</span>
              </motion.button>
            </header>

            {/* Middle Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-[#fde08d] tracking-[0.15em] uppercase drop-shadow-[0_5px_20px_rgba(0,0,0,1)]">
                  TIRAGE INITIAL DE {drawnCards.length} CARTES
                </h1>
                <p className="text-[#e0c097] italic text-xl md:text-2xl mt-4 drop-shadow-xl opacity-90 tracking-wide">
                  Posez votre question... et révelez votre chemin...
                </p>
              </motion.div>

              {/* Cards Deck Area */}
              <div className="flex gap-4 md:gap-8 my-10 perspective-1000">
                <AnimatePresence mode='popLayout'>
                  {drawnCards.map((card, i) => (
                    <motion.div
                      key={card.name + i}
                      initial={{ opacity: 0, y: 100, rotateX: 45, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ delay: i * 0.15, type: 'spring', damping: 12, stiffness: 100 }}
                    >
                      <TarotCard card={card} isRevealed={true} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Interaction Zone */}
              <div className="w-full max-w-4xl flex flex-col items-center gap-10">
                {gameState === GameState.DEALT && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                    <input 
                      type="text"
                      placeholder="Quelle vérité cherchez-vous dans les arcanes ?"
                      className="w-full bg-transparent border-b-2 border-[#c5a059]/40 text-[#fde08d] text-center text-2xl md:text-3xl p-5 focus:outline-none focus:border-[#fde08d] placeholder-[#c5a059]/30 italic transition-all drop-shadow-md font-serif"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                    />
                  </motion.div>
                )}

                {(reading || isLoading) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/75 backdrop-blur-2xl p-10 rounded-2xl border border-[#c5a059]/40 w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-4 text-[#fde08d] italic text-2xl animate-pulse">
                        <span className="w-3 h-3 bg-[#fde08d] rounded-full shadow-[0_0_10px_#fde08d]"></span>
                        La cartomancienne déchiffre les fils du destin...
                        <span className="w-3 h-3 bg-[#fde08d] rounded-full shadow-[0_0_10px_#fde08d]"></span>
                      </div>
                    ) : (
                      <div className="text-[#fde08d] text-xl md:text-2xl leading-relaxed italic drop-shadow-lg font-serif">
                        <Typewriter text={reading} speed={0.02} />
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-10">
                  {gameState === GameState.DEALT && (
                    <MainPlaqueButton onClick={() => fetchReading(drawnCards)} disabled={!userQuestion.trim()}>
                      RÉVÉLER MON DESTIN
                    </MainPlaqueButton>
                  )}
                  {gameState === GameState.READING && drawnCards.length === 4 && (
                    <SecondaryButton onClick={handleDeepen}>
                      APPROFONDIR LE TIRAGE (2 CARTES)
                    </SecondaryButton>
                  )}
                  {(gameState === GameState.FINAL_READING || (gameState === GameState.READING && drawnCards.length === 4)) && (
                     <motion.button 
                        whileHover={{ letterSpacing: '0.5em', color: '#fde08d' }}
                        onClick={handleStartRitual} 
                        className="text-[#c5a059] border-b border-[#c5a059]/30 text-xs tracking-[0.4em] uppercase transition-all py-2"
                     >
                        Nouveau Rituel
                     </motion.button>
                  )}
                </div>
              </div>
            </main>

            {/* Footer HUD */}
            <footer className="flex justify-between items-end text-[#c5a059] font-bold text-sm tracking-[0.2em] uppercase mt-6">
              <AudioControl />
              <div className="flex items-center gap-8 bg-black/40 px-8 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
                <span className="opacity-90">
                  {currentDate.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).replace(',', '')} PM CET
                </span>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-6 h-6 bg-[#fde08d] clip-star shadow-[0_0_25px_#fde08d]"
                ></motion.div>
              </div>
            </footer>
          </div>
        </div>

        {/* Laptop Bottom Lip / Bezel */}
        <div className="h-8 bg-[#181818] w-full border-t border-black/50 flex justify-center items-center shadow-inner">
            <div className="w-32 h-2 bg-[#333] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
