
import React from 'react';
import { motion } from 'framer-motion';

interface CandleProps {
    className?: string;
}

const GoldenParticle: React.FC = () => {
    const duration = Math.random() * 3 + 2; // 2 to 5 seconds
    const delay = Math.random() * 2;
    const x = (Math.random() - 0.5) * 80;
    const y = -100 - Math.random() * 50;

    return (
        <motion.div
            className="absolute bottom-0 w-1 h-1 bg-amber-300 rounded-full"
            style={{ filter: 'blur(1px)' }}
            initial={{ y: 0, x: 0, opacity: 0 }}
            animate={{ 
                y: y, 
                x: x, 
                opacity: [0, 1, 1, 0],
                scale: [1, 1.5, 1]
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                repeatType: 'loop',
                ease: "easeOut"
            }}
        />
    );
};

const Candle: React.FC<CandleProps> = ({ className }) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Flame */}
      <motion.div
        className="w-4 h-8 bg-amber-400 rounded-full"
        style={{
          boxShadow: '0 0 15px 5px rgba(252, 211, 77, 0.7)',
          filter: 'blur(3px)',
          transformOrigin: 'bottom center'
        }}
        animate={{
          scale: [1, 1.05, 0.95, 1.02, 1],
          skewX: [0, 2, -2, 1, -1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />
       {/* Candle Stick */}
      <div className="w-6 h-24 bg-stone-200" style={{
          background: 'linear-gradient(to right, #fdfbfb, #ebedee 70%)',
          boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.2)'
      }} />
      
      {/* Particles */}
      <div className="absolute top-0 w-full h-full">
        {Array.from({ length: 15 }).map((_, i) => (
            <GoldenParticle key={i} />
        ))}
      </div>
    </div>
  );
};

export default Candle;
