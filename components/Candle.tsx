import React from 'react';
import { motion } from 'framer-motion';

interface CandleProps {
  side: 'left' | 'right';
}

const Candle: React.FC<CandleProps> = ({ side }) => {
  return (
    <div
      className={`fixed bottom-0 ${side === 'left' ? 'left-4 md:left-8' : 'right-4 md:right-8'} z-10 pointer-events-none hidden md:block`}
    >
      {/* Glow */}
      <motion.div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,170,50,0.15) 0%, rgba(255,120,20,0.05) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 0.95, 1.05, 1],
          opacity: [0.8, 1, 0.7, 0.9, 0.8],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Flame */}
      <div className="relative flex flex-col items-center">
        <motion.div
          className="relative w-3 h-8 mb-0"
          animate={{
            scaleY: [1, 1.2, 0.9, 1.1, 1],
            scaleX: [1, 0.9, 1.1, 0.95, 1],
            rotate: [0, 2, -2, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(to top, #ff6600 0%, #ff9900 40%, #ffcc00 70%, #ffffff 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              filter: 'blur(1px)',
            }}
          />
          <motion.div
            className="absolute -inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,150,50,0.4) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.5, 0.8, 0.4, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Wick */}
        <div className="w-[2px] h-2 bg-[#333]" />

        {/* Candle body */}
        <div
          className="w-6 h-24 rounded-b-sm"
          style={{
            background: 'linear-gradient(to right, #8B0000 0%, #a01010 30%, #c01515 50%, #a01010 70%, #8B0000 100%)',
          }}
        />
      </div>
    </div>
  );
};

export default Candle;
