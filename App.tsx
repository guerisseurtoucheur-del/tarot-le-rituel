
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCardType, GameState } from './types';
import { TAROT_DECK } from './constants/tarotDeck';
import { getReading } from './services/geminiService';
import TarotCard from './components/TarotCard';
import Candle from './components/Candle';
import Typewriter from './components/Typewriter';
import AudioControl from './components/AudioControl';

// Helper to shuffle the deck
const shuffleDeck = (deck: TarotCardType[]): TarotCardType[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [deck, setDeck] = useState<TarotCardType[]>(shuffleDeck(TAROT_DECK));
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const allRevealed = revealedCards.length > 0 && revealedCards.every(Boolean);
  const canDeepen = allRevealed && drawnCards.length === 4;
  const isFinalReading = allRevealed && drawnCards.length === 6;

  const handleStartRitual = () => {
    setGameState(GameState.DEALING);
    const newDeck = shuffleDeck(TAROT_DECK);
    const initialDrawn = newDeck.slice(0, 4);
    setDeck(newDeck.slice(4));
    setDrawnCards(initialDrawn);
    setRevealedCards(new Array(4).fill(false));
    setReading('');
  };
  
  const handleDeepenDestiny = () => {
    setGameState(GameState.DEEPENING);
    const additionalCards = deck.slice(0, 2);
    setDeck(deck.slice(2));
    setDrawnCards([...drawnCards, ...additionalCards]);
    setRevealedCards(new Array(6).fill(false).map((_, i) => i < 4));
    setReading('');
  };

  const handleRevealCard = (index: number) => {
    if (revealedCards[index]) return;
    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);
  };
  
  const fetchReading = useCallback(async () => {
      if (!allRevealed || drawnCards.length === 0 || (drawnCards.length !== 4 && drawnCards.length !== 6)) return;
  
      setIsLoading(true);
      setReading('');
      
      const previousReading = drawnCards.length === 6 ? reading : undefined;
  
      try {
          const newReading = await getReading(drawnCards, previousReading);
          setReading(newReading);
          if(drawnCards.length === 4) {
              setGameState(GameState.READING);
          } else {
              setGameState(GameState.FINAL_READING);
          }
      } catch (error) {
          console.error("Error fetching reading:", error);
          setReading("La connexion avec les esprits a été perdue. Veuillez réessayer.");
      } finally {
          setIsLoading(false);
      }
  }, [allRevealed, drawnCards, reading]);
  
  useEffect(() => {
      if(allRevealed) {
          fetchReading();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedCards, fetchReading]);

  const resetRitual = () => {
      setGameState(GameState.INITIAL);
      setDrawnCards([]);
      setRevealedCards([]);
      setReading('');
      setDeck(shuffleDeck(TAROT_DECK));
  }

  return (
    <div className="bg-black text-white min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 relative font-cinzel"
      style={{
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundColor: 'rgba(20, 10, 10, 0.9)',
        backgroundBlendMode: 'multiply'
      }}>
      
      <div className="absolute top-4 right-4 z-50">
          <AudioControl />
      </div>

      <Candle className="absolute top-1/4 left-8 md:left-20" />
      <Candle className="absolute top-1/3 right-8 md:right-20" />

      <div className="w-full h-full flex flex-col items-center justify-center z-10 p-4">
        <AnimatePresence>
          {gameState === GameState.INITIAL && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center flex flex-col items-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Le Rituel du Tarot</h1>
              <p className="text-amber-100 my-4 text-lg">Les arcanes attendent votre question.</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(252, 211, 77, 0.7)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartRitual}
                className="bg-red-900 border-2 border-amber-400 text-amber-200 px-8 py-3 rounded-lg shadow-lg text-xl tracking-widest"
              >
                Commencer le Rituel
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {(gameState !== GameState.INITIAL) && (
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center h-full pt-16 md:pt-8">
            {/* The Velvet Mat */}
            <div className="w-full h-[300px] md:h-[400px] relative flex justify-center items-center rounded-lg bg-red-900/50 shadow-inner shadow-black p-4"
              style={{
                  backgroundImage: 'url(https://www.transparenttextures.com/patterns/velvet.png)',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
              }}>

              <AnimatePresence>
                {drawnCards.map((card, index) => (
                  <motion.div
                    key={card.name}
                    custom={index}
                    initial={{ opacity: 0, y: -100, scale: 0.5 }}
                    animate={(i) => ({
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { delay: i * 0.2 + 0.5, type: 'spring', stiffness: 100 }
                    })}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute"
                    style={{
                      transform: `translateX(${(index - (drawnCards.length -1) / 2) * 130}px) md:translateX(${(index - (drawnCards.length -1) / 2) * 180}px)`
                    }}
                  >
                    <TarotCard
                      card={card}
                      isRevealed={revealedCards[index]}
                      onReveal={() => handleRevealCard(index)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="text-center mt-8 h-64 flex flex-col justify-center items-center">
                {isLoading && (
                    <div className="flex items-center space-x-2 text-amber-200">
                        <div className="w-4 h-4 rounded-full bg-amber-300 animate-pulse"></div>
                        <div className="w-4 h-4 rounded-full bg-amber-300 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-4 h-4 rounded-full bg-amber-300 animate-pulse [animation-delay:0.4s]"></div>
                        <p>Les esprits murmurent...</p>
                    </div>
                )}
                
                <AnimatePresence>
                {reading && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-3xl text-amber-100 text-lg md:text-xl p-4 bg-black/30 rounded-lg"
                    >
                        <Typewriter text={reading} />
                    </motion.div>
                )}
                </AnimatePresence>

                <div className="mt-6">
                    {canDeepen && !isLoading && (
                        <motion.button
                            initial={{opacity: 0}} animate={{opacity: 1}}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(252, 211, 77, 0.7)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDeepenDestiny}
                            className="bg-red-900 border-2 border-amber-400 text-amber-200 px-6 py-2 rounded-lg shadow-lg text-lg"
                        >
                            Approfondir le Destin
                        </motion.button>
                    )}
                    {isFinalReading && !isLoading && (
                         <motion.button
                            initial={{opacity: 0}} animate={{opacity: 1}}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(252, 211, 77, 0.7)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetRitual}
                            className="bg-red-900 border-2 border-amber-400 text-amber-200 px-6 py-2 rounded-lg shadow-lg text-lg"
                        >
                            Nouveau Rituel
                        </motion.button>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
