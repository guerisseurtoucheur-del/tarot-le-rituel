
import React from 'react';
import { motion } from 'framer-motion';
import { TarotCardType } from '../types';

interface TarotCardProps {
  card: TarotCardType;
  isRevealed: boolean;
  onReveal: () => void;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, isRevealed, onReveal }) => {
  return (
    <motion.div
      onClick={onReveal}
      className="w-[120px] h-[210px] md:w-[160px] md:h-[280px] cursor-pointer"
      style={{ perspective: 1000 }}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card Back */}
        <div
          className="absolute w-full h-full bg-red-900 border-4 border-amber-400 rounded-lg p-2 flex items-center justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/cardboard-flat.png)',
            backgroundColor: 'rgba(50, 0, 0, 0.8)',
            backgroundBlendMode: 'multiply'
          }}
        >
           <div className="w-2/3 h-2/3 border-2 border-amber-500 rounded-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 border border-amber-600 rounded-full"></div>
            </div>
        </div>
        
        {/* Card Front */}
        <div
          className="absolute w-full h-full bg-gray-200 rounded-lg overflow-hidden border-2 border-amber-200"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
           <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center">
                <h3 className="text-white text-sm md:text-base font-bold tracking-wider">{card.name}</h3>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TarotCard;
