"use client";

import { useEffect, useState } from "react";

export default function MysticOrb() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const offsetX = (mousePos.x / (typeof window !== "undefined" ? window.innerWidth : 1) - 0.5) * 20;
  const offsetY = (mousePos.y / (typeof window !== "undefined" ? window.innerHeight : 1) - 0.5) * 20;

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto" style={{ perspective: "600px" }}>
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
          transform: `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)`,
        }}
      />

      {/* Orbiting symbols */}
      {["*", "+", "*"].map((symbol, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 text-primary"
          style={{
            fontSize: "0.7rem",
            opacity: 0.4,
            animation: `orbit ${8 + i * 4}s linear infinite`,
            animationDelay: `${i * -3}s`,
          }}
        >
          {symbol}
        </div>
      ))}

      {/* Inner orb */}
      <div
        className="absolute inset-6 md:inset-8 rounded-full overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at ${35 + offsetX * 0.5}% ${35 + offsetY * 0.5}%, rgba(212,175,55,0.25) 0%, transparent 50%),
            radial-gradient(circle at 65% 65%, rgba(160,64,64,0.1) 0%, transparent 40%),
            radial-gradient(circle, rgba(10,10,26,0.95) 30%, #050510 100%)
          `,
          border: "1px solid rgba(212,175,55,0.2)",
          boxShadow: `
            0 0 40px rgba(212,175,55,0.1),
            inset 0 0 30px rgba(212,175,55,0.05)
          `,
          transform: `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Inner shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(212,175,55,0.06) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        className="absolute inset-2 md:inset-4 rounded-full"
        style={{
          border: "1px solid rgba(212,175,55,0.1)",
          animation: "spin-slow 30s linear infinite",
        }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary"
            style={{
              top: "50%",
              left: "50%",
              opacity: 0.3,
              transform: `rotate(${deg}deg) translateX(${80}px) translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
