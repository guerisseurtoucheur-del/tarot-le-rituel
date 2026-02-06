import React from 'react';
import { motion } from 'framer-motion';

const CrystalBall: React.FC = () => {
  return (
    <motion.div
      className="relative w-20 h-20 md:w-28 md:h-28 mx-auto"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(138,43,226,0.05) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ball */}
      <div
        className="absolute inset-2 rounded-full border border-[#d4af37]/20"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(60,60,80,0.6) 0%, rgba(20,10,30,0.9) 50%, rgba(5,5,10,1) 100%)',
          boxShadow: 'inset 0 0 20px rgba(212,175,55,0.1), 0 0 40px rgba(212,175,55,0.08)',
        }}
      >
        {/* Highlight */}
        <div
          className="absolute top-2 left-3 w-4 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 100%)',
          }}
        />
        
        {/* Inner shimmer */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.2, 0.5, 0.3],
            scale: [0.8, 1, 0.9, 1.1, 0.8],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Base */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-20 h-3 rounded-b-lg"
        style={{
          background: 'linear-gradient(to right, #2a1a00, #4a3000, #2a1a00)',
          borderBottom: '1px solid rgba(212,175,55,0.2)',
        }}
      />
    </motion.div>
  );
};

export default CrystalBall;
