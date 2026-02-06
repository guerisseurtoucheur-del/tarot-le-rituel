"use client";

import React from "react";
import { motion } from "framer-motion";

const GOLD = "#d4af37";

interface RitualCardProps {
  card: { name: string; imageUrl: string };
  index: number;
  isRevealed: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function RitualCard({
  card,
  index,
  isRevealed,
  isSelectable,
  isSelected,
  onClick,
}: RitualCardProps) {
  return (
    <motion.div
      style={{ position: "relative", cursor: isSelectable ? "pointer" : "default", perspective: 1200, userSelect: "none" }}
      onClick={isSelectable ? onClick : undefined}
      initial={{ opacity: 0, y: 40, rotateZ: (index - 3) * 3 }}
      animate={{ opacity: 1, y: isSelected ? -12 : 0, rotateZ: 0, scale: isSelected ? 1.05 : 1 }}
      transition={{ duration: 0.6, delay: index * 0.08, type: "spring", stiffness: 120 }}
      whileHover={isSelectable ? { y: -16, scale: 1.08, transition: { type: "spring", stiffness: 300 } } : {}}
    >
      <motion.div
        style={{
          position: "relative",
          width: "clamp(100px, 14vw, 140px)",
          height: "clamp(170px, 24vw, 235px)",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            overflow: "hidden",
            border: `2px solid ${isSelected ? GOLD + "cc" : GOLD + "40"}`,
            background: "linear-gradient(145deg, #1a0a0a 0%, #0d0505 50%, #1a0a0a 100%)",
            backfaceVisibility: "hidden",
            boxShadow: isSelected
              ? `0 0 25px ${GOLD}4d, 0 8px 32px rgba(0,0,0,0.5)`
              : "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="70%" height="70%" viewBox="0 0 100 100" style={{ opacity: 0.4 }}>
              <defs>
                <linearGradient id={`g${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#b8860b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#g${index})`} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke={`url(#g${index})`} strokeWidth="0.3" />
              <circle cx="50" cy="50" r="25" fill="none" stroke={`url(#g${index})`} strokeWidth="0.3" />
              <path d="M50 5 L50 95" stroke={`url(#g${index})`} strokeWidth="0.3" />
              <path d="M5 50 L95 50" stroke={`url(#g${index})`} strokeWidth="0.3" />
              <path d="M18 18 L82 82" stroke={`url(#g${index})`} strokeWidth="0.3" />
              <path d="M82 18 L18 82" stroke={`url(#g${index})`} strokeWidth="0.3" />
              <polygon
                points="50,10 61,38 92,38 67,56 77,85 50,68 23,85 33,56 8,38 39,38"
                fill="none"
                stroke={`url(#g${index})`}
                strokeWidth="0.4"
              />
              <circle cx="50" cy="50" r="5" fill="none" stroke={GOLD} strokeWidth="0.8" />
              <circle cx="50" cy="50" r="1.5" fill={GOLD} opacity={0.6} />
            </svg>
          </div>
          <div style={{ position: "absolute", inset: 8, border: `1px solid ${GOLD}1a`, borderRadius: 4, pointerEvents: "none" }} />
          {isSelectable && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 8,
                background: `radial-gradient(ellipse at center, ${GOLD}33 0%, transparent 70%)`,
              }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            />
          )}
        </div>
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            overflow: "hidden",
            border: `2px solid ${GOLD}99`,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: `0 0 30px ${GOLD}33, 0 8px 32px rgba(0,0,0,0.5)`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#f5f0e1" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.imageUrl} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
              padding: "24px 8px 8px",
            }}
          >
            <p style={{ textAlign: "center", fontSize: "clamp(9px, 1.5vw, 12px)", fontWeight: "bold", letterSpacing: "0.1em", color: GOLD, textTransform: "uppercase", margin: 0 }}>
              {card.name}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
