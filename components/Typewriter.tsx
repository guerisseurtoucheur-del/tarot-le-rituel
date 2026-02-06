"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function Typewriter({ text, speed = 0.03 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayText("");
    setIsDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed * 1000);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      {!isDone && (
        <motion.span
          style={{
            display: "inline-block",
            width: 2,
            height: 16,
            backgroundColor: "#d4af37",
            marginLeft: 2,
            verticalAlign: "text-bottom",
          }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  );
}
