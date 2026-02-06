"use client";

import { useEffect, useState, useRef } from "react";

const FEATURED_CARDS = [
  { name: "L'Etoile", image: "/cards/17-etoile.jpg" },
  { name: "La Lune", image: "/cards/18-lune.jpg" },
  { name: "Le Soleil", image: "/cards/19-soleil.jpg" },
  { name: "La Roue de Fortune", image: "/cards/10-roue.jpg" },
  { name: "Le Monde", image: "/cards/21-monde.jpg" },
];

export default function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center py-16 md:py-24 overflow-hidden">
      <div className="flex gap-4 md:gap-8 items-center">
        {FEATURED_CARDS.map((card, i) => {
          const offset = (i - 2) * 12;
          const rotation = (i - 2) * 8;
          const yShift = Math.abs(i - 2) * 20;
          const parallax = scrollY * 0.03 * (i % 2 === 0 ? 1 : -1);

          return (
            <div
              key={card.name}
              className="relative group"
              style={{
                transform: `
                  translateY(${yShift + parallax}px) 
                  rotate(${rotation}deg)
                  translateX(${offset}px)
                `,
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: isVisible ? 1 : 0,
                animation: isVisible
                  ? `fade-in-up 0.8s ease-out ${i * 0.15}s both`
                  : "none",
              }}
            >
              <div
                className="relative w-24 h-40 md:w-36 md:h-56 rounded-lg overflow-hidden"
                style={{
                  border: "1px solid rgba(212,175,55,0.25)",
                  boxShadow: `
                    0 10px 40px rgba(0,0,0,0.5),
                    0 0 20px rgba(212,175,55,0.08)
                  `,
                  transition: "all 0.4s ease",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,5,16,0.7) 0%, transparent 50%)",
                  }}
                />
              </div>
              <p
                className="text-center mt-3 text-xs md:text-sm tracking-wider"
                style={{
                  color: "var(--color-muted-foreground)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {card.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
