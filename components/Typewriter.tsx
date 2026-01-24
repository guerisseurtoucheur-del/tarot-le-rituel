
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface TypewriterProps {
  text: string;
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 0.05 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      if(i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed * 1000);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return <p>{displayText}<span className="inline-block w-2 h-5 bg-amber-200 animate-pulse ml-1"></span></p>;
};

export default Typewriter;
