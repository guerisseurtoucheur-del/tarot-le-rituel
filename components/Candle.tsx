"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Candle({ side }: { side: "left" | "right" }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        [side === "left" ? "left" : "right"]: 24,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: -96,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,170,50,0.15) 0%, rgba(255,120,20,0.05) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 0.95, 1.05, 1], opacity: [0.8, 1, 0.7, 0.9, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div
          style={{ position: "relative", width: 12, height: 32 }}
          animate={{
            scaleY: [1, 1.2, 0.9, 1.1, 1],
            scaleX: [1, 0.9, 1.1, 0.95, 1],
            rotate: [0, 2, -2, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: "linear-gradient(to top, #ff6600 0%, #ff9900 40%, #ffcc00 70%, #ffffff 100%)",
              filter: "blur(1px)",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,150,50,0.4) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0.5, 0.8, 0.4, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <div style={{ width: 2, height: 8, backgroundColor: "#333" }} />
        <div
          style={{
            width: 24,
            height: 96,
            borderRadius: "0 0 2px 2px",
            background: "linear-gradient(to right, #8B0000 0%, #a01010 30%, #c01515 50%, #a01010 70%, #8B0000 100%)",
          }}
        />
      </div>
    </div>
  );
}
