import React from 'react';
import { motion } from 'framer-motion';

interface RitualCardProps {
  card: { name: string; imageUrl: string };
  index: number;
  isRevealed: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  onClick: () => void;
  layoutId?: string;
}

const RitualCard: React.FC<RitualCardProps> = ({
  card,
  index,
  isRevealed,
  isSelectable,
  isSelected,
  onClick,
  layoutId,
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={`relative cursor-pointer select-none ${
        isSelectable ? 'hover:z-10' : ''
      }`}
      style={{ perspective: 1200 }}
      onClick={isSelectable ? onClick : undefined}
      initial={{ opacity: 0, y: 40, rotateZ: (index - 3) * 3 }}
      animate={{
        opacity: 1,
        y: isSelected ? -12 : 0,
        rotateZ: 0,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 120 }}
      whileHover={isSelectable ? { y: -16, scale: 1.08, transition: { type: 'spring', stiffness: 300 } } : {}}
    >
      <motion.div
        className="relative w-[100px] h-[170px] sm:w-[120px] sm:h-[200px] md:w-[140px] md:h-[235px]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden border-2"
          style={{
            backfaceVisibility: 'hidden',
            borderColor: isSelected ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.25)',
            background: 'linear-gradient(145deg, #1a0a0a 0%, #0d0505 50%, #1a0a0a 100%)',
            boxShadow: isSelected
              ? '0 0 25px rgba(212,175,55,0.3), 0 8px 32px rgba(0,0,0,0.5)'
              : '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="70%" height="70%" viewBox="0 0 100 100" className="opacity-40">
              <defs>
                <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#b8860b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#grad-${index})`} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke={`url(#grad-${index})`} strokeWidth="0.3" />
              <circle cx="50" cy="50" r="25" fill="none" stroke={`url(#grad-${index})`} strokeWidth="0.3" />
              <path d="M50 5 L50 95" stroke={`url(#grad-${index})`} strokeWidth="0.3" />
              <path d="M5 50 L95 50" stroke={`url(#grad-${index})`} strokeWidth="0.3" />
              <path d="M18 18 L82 82" stroke={`url(#grad-${index})`} strokeWidth="0.3" />
              <path d="M82 18 L18 82" stroke={`url(#grad-${index})`} strokeWidth="0.3" />
              <polygon
                points="50,10 61,38 92,38 67,56 77,85 50,68 23,85 33,56 8,38 39,38"
                fill="none"
                stroke={`url(#grad-${index})`}
                strokeWidth="0.4"
              />
              <circle cx="50" cy="50" r="5" fill="none" stroke="#d4af37" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="1.5" fill="#d4af37" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute inset-2 border border-[#d4af37]/10 rounded pointer-events-none" />
          {isSelectable && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 70%)',
              }}
            />
          )}
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden border-2 border-[#d4af37]/60"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: '0 0 30px rgba(212,175,55,0.2), 0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute inset-0 bg-[#f5f0e1]">
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 pt-6">
            <p className="text-center text-[10px] sm:text-xs font-bold tracking-wider text-[#d4af37] uppercase">
              {card.name}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RitualCard;
