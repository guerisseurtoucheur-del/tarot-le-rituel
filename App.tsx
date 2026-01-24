
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCardType, GameState } from './types';
import { TAROT_DECK } from './constants/tarotDeck';
import { getReading } from './services/geminiService';
import TarotCard from './components/TarotCard';
import Typewriter from './components/Typewriter';
import AudioControl from './components/AudioControl';

// Helper to shuffle the deck
const shuffleDeck = (deck: TarotCardType[]): TarotCardType[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

// Custom Plaque Button to match the reference image (Wood & Gold style)
const PlaqueButton: React.FC<{onClick: () => void; children: React.ReactNode; disabled?: boolean; secondary?: boolean}> = ({onClick, children, disabled, secondary}) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1: 1.02, filter: 'brightness(1.1)' }}
            whileTap={{ scale: disabled ? 1: 0.98 }}
            className={`relative group px-8 py-3 min-w-[200px] flex items-center justify-center ${disabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {/* Background Texture (CSS gradient to simulate wood) */}
            <div className="absolute inset-0 rounded-lg border-2 border-[#a27c3f] shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                 style={{
                     background: 'linear-gradient(180deg, #463015 0%, #291a0a 100%)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.5)'
                 }}>
                 {/* Inner border for detail */}
                 <div className="absolute inset-[2px] border border-[#6b5026] rounded-md"></div>
            </div>
            
            {/* Ornaments (Left/Right) - Simulated with CSS */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-6 bg-[#a27c3f] rounded-l-sm shadow-md"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-6 bg-[#a27c3f] rounded-r-sm shadow-md"></div>

            {/* Text */}
            <span className="relative z-10 font-cinzel font-bold text-[#fde08d] text-sm md:text-base uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                {children}
            </span>
        </motion.button>
    )
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [deck, setDeck] = useState<TarotCardType[]>(shuffleDeck(TAROT_DECK));
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const canReveal = userQuestion.trim().length > 0 && !isLoading;
  const canDeepen = !isLoading && reading && drawnCards.length === 4;
  const isFinalReading = drawnCards.length === 6 && !isLoading;

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize the "Table" with 4 cards face up (or ready to be read)
  useEffect(() => {
      handleStartRitual();
  }, []);

  const handleStartRitual = () => {
    const newDeck = shuffleDeck(TAROT_DECK);
    // Draw 4 cards immediately
    const initialDrawn = newDeck.slice(0, 4).map(card => ({...card, revealed: true})); 
    setDeck(newDeck.slice(4));
    setDrawnCards(initialDrawn);
    setReading('');
    setUserQuestion('');
    setGameState(GameState.DEALT);
  };
  
  const handleDeepenDestiny = () => {
    const additionalCards = deck.slice(0, 2).map(card => ({...card, revealed: true}));
    setDeck(deck.slice(2));
    const newDrawnCards = [...drawnCards, ...additionalCards];
    setDrawnCards(newDrawnCards);
    
    // Animate into reading
    fetchReading(newDrawnCards, true);
    setGameState(GameState.DEEPENING);
  };

  const fetchReading = useCallback(async (currentCards: TarotCardType[], isDeepening = false) => {
      setIsLoading(true);
      
      const previousReading = isDeepening ? reading : undefined;
  
      try {
          const newReading = await getReading(currentCards, userQuestion, previousReading);
          setReading(newReading);
          if(currentCards.length === 4) {
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
  }, [userQuestion, reading]);

  return (
    <div className="bg-black min-h-screen w-full flex items-center justify-center p-2 md:p-8 font-cinzel overflow-hidden">
        
        {/* Laptop Frame Container */}
        <div className="relative w-full max-w-[1400px] aspect-video bg-[#0f0f0f] rounded-2xl shadow-2xl ring-1 ring-gray-800 flex flex-col overflow-hidden">
            
            {/* Webcam / Bezel details */}
            <div className="absolute top-0 w-full h-4 bg-black/50 z-50 flex justify-center items-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            </div>

            {/* Screen Content */}
            <div className="relative w-full h-full bg-cover bg-center"
                 style={{ 
                     // Using a mystical background image to simulate the room
                     backgroundImage: "url('https://images.unsplash.com/photo-1596280628766-07e324d3d1e9?q=80&w=2670&auto=format&fit=crop')",
                 }}>
                
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/90 via-black/20 to-black/60"></div>

                {/* Main UI Layer */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-10">
                    
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#fde08d] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
                                AL <br/>
                                <span className="text-2xl md:text-3xl font-normal tracking-wider">Studio</span>
                            </h1>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            className="w-10 h-10 rounded-full border-2 border-[#fde08d] text-[#fde08d] flex items-center justify-center font-bold text-xl bg-black/30 backdrop-blur-sm"
                        >
                            ?
                        </motion.button>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-grow flex flex-col items-center justify-center -mt-8">
                        
                        {/* Title Section */}
                        <div className="text-center mb-6">
                            <motion.h2 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl md:text-5xl font-bold text-[#fde08d] drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-wide mb-2"
                            >
                                TIRAGE INITIAL DE {drawnCards.length} CARTES
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, delay: 0.3 }}
                                className="text-[#e0c097] text-lg md:text-xl italic font-serif tracking-wide drop-shadow-md"
                            >
                                {gameState === GameState.READING || gameState === GameState.FINAL_READING 
                                    ? "Les arcanes ont parlé..." 
                                    : "Posez votre question... et révèle votre chemin.."}
                            </motion.p>
                        </div>

                        {/* Cards Layout */}
                        <div className="relative w-full max-w-5xl h-[250px] md:h-[320px] flex justify-center items-center gap-4 md:gap-8 perspective-1000 mb-8">
                            <AnimatePresence>
                                {drawnCards.map((card, index) => (
                                    <motion.div
                                        key={card.name}
                                        initial={{ opacity: 0, y: 50, rotateX: 30 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{ delay: index * 0.15, type: 'spring', damping: 12 }}
                                        className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                    >
                                        <TarotCard card={card} isRevealed={!!card.revealed} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Input & Actions Zone */}
                        <div className="w-full max-w-3xl flex flex-col items-center gap-6">
                            
                            {/* Question Input (Only visible before reading) */}
                            {gameState === GameState.DEALT && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="w-full max-w-xl"
                                >
                                    <input
                                        type="text"
                                        value={userQuestion}
                                        onChange={(e) => setUserQuestion(e.target.value)}
                                        placeholder="Écrivez votre question ici..."
                                        className="w-full bg-transparent border-b border-[#a27c3f]/50 text-[#fde08d] text-center text-xl md:text-2xl p-2 focus:outline-none focus:border-[#fde08d] transition-colors placeholder-[#a27c3f]/50 font-serif italic"
                                    />
                                </motion.div>
                            )}

                            {/* Reading Display */}
                            {(reading || isLoading) && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="w-full bg-black/60 border border-[#a27c3f]/30 p-6 rounded-lg backdrop-blur-sm min-h-[120px] text-center"
                                >
                                    {isLoading ? (
                                        <p className="text-[#e0c097] animate-pulse italic">La cartomancienne consulte les étoiles...</p>
                                    ) : (
                                        <div className="text-[#fde08d] text-lg leading-relaxed shadow-black drop-shadow-md">
                                            <Typewriter text={reading} speed={0.02} />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-6 mt-2 items-center">
                                {gameState === GameState.DEALT && (
                                    <PlaqueButton onClick={() => fetchReading(drawnCards)} disabled={!canReveal}>
                                        RÉVÉLER MON DESTIN
                                    </PlaqueButton>
                                )}
                                
                                {canDeepen && (
                                    <PlaqueButton onClick={handleDeepenDestiny}>
                                        APPROFONDIR LE TIRAGE (2 CARTES)
                                    </PlaqueButton>
                                )}

                                {(isFinalReading || (gameState === GameState.READING && drawnCards.length === 4)) && (
                                    <motion.button
                                        onClick={handleStartRitual}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-[#a27c3f] border-b border-[#a27c3f] text-sm uppercase tracking-widest hover:text-[#fde08d] hover:border-[#fde08d] transition-colors mt-2"
                                    >
                                        Nouveau Rituel
                                    </motion.button>
                                )}
                            </div>
                        </div>

                    </main>

                    {/* Footer */}
                    <footer className="flex justify-between items-end text-[#a27c3f] text-xs md:text-sm font-bold tracking-widest uppercase">
                        <AudioControl />
                        <div className="text-right">
                             {currentDate.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).replace(':', 'H')} PM CET
                        </div>
                    </footer>

                </div>
            </div>
        </div>
        
        {/* Reflection under laptop (Optional polish) */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default App;
