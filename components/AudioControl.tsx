
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AudioControl: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio focus needed"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/11/21/audio_a21a5c68c3.mp3" loop />
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        className="text-[#fde08d]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          {isPlaying ? (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </>
          ) : (
            <line x1="23" y1="9" x2="17" y2="15"></line>
          )}
        </svg>
      </motion.button>
      
      {/* Barre de volume horizontale */}
      <div className="w-32 h-1 bg-[#c5a059]/20 relative rounded-full">
        <div className="absolute top-0 left-0 w-3/4 h-full bg-[#c5a059] rounded-full"></div>
      </div>

      <span className="text-[10px] md:text-xs tracking-[0.2em] whitespace-nowrap">MUSIQUE : MÉLODIE TZIGANE ANCESTRALE</span>
    </div>
  );
};

export default AudioControl;
