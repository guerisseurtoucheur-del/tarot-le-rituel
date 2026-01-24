
import React from 'react';
import { motion } from 'framer-motion';
import { TarotCardType } from '../types';

interface TarotCardProps {
  card: TarotCardType;
  isRevealed: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, isRevealed }) => {
  return (
    <motion.div
      className="w-[120px] h-[210px] md:w-[150px] md:h-[260px] cursor-pointer"
      style={{ perspective: 1000 }}
      whileHover={{ y: -10, scale: 1.05, transition: {type: 'spring', stiffness: 300} }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* Card Back */}
        <div
          className="absolute w-full h-full bg-red-900 border-2 border-amber-600/50 rounded-lg p-2 flex items-center justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/cardboard-flat.png)',
            backgroundColor: 'rgba(50, 0, 0, 0.8)',
            backgroundBlendMode: 'multiply'
          }}
        >
           <div 
            className="w-full h-full border border-amber-500/30 rounded-md"
            style={{
                background: 'radial-gradient(ellipse at center, rgba(252, 211, 77,0.1) 0%,rgba(0,0,0,0) 70%)'
            }}
           ></div>
        </div>
        
        {/* Card Front */}
        <div
          className="absolute w-full h-full bg-gray-200 rounded-lg overflow-hidden border-2 border-amber-200 shadow-lg shadow-black/50"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
           <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                <h3 className="text-white text-xs md:text-sm font-bold tracking-wider">{card.name}</h3>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TarotCard;
