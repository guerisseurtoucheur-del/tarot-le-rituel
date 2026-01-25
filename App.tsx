import React, { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

// Liste complète des 22 Arcanes Majeurs
const ARCANES_MAJEURS = [
  { id: 0, name: "Le Mat", img: "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg" },
  { id: 1, name: "Le Bateleur", img: "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg" },
  { id: 2, name: "La Papesse", img: "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg" },
  { id: 3, name: "L'Impératrice", img: "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg" },
  { id: 4, name: "L'Empereur", img: "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg" },
  { id: 5, name: "Le Pape", img: "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg" },
  { id: 6, name: "L'Amoureux", img: "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg" },
  { id: 7, name: "Le Chariot", img: "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg" },
  { id: 8, name: "La Justice", img: "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg" },
  { id: 9, name: "L'Ermite", img: "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg" },
  { id: 10, name: "La Roue de Fortune", img: "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg" },
  { id: 11, name: "La Force", img: "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg" },
  { id: 12, name: "Le Pendu", img: "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg" },
  { id: 13, name: "L'Arcane sans nom", img: "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg" },
  { id: 14, name: "Tempérance", img: "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg" },
  { id: 15, name: "Le Diable", img: "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg" },
  { id: 16, name: "La Maison Dieu", img: "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg" },
  { id: 17, name: "L'Étoile", img: "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg" },
  { id: 18, name: "La Lune", img: "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg" },
  { id: 19, name: "Le Soleil", img: "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg" },
  { id: 20, name: "Le Jugement", img: "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg" },
  { id: 21, name: "Le Monde", img: "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg" },
];

export default function App() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggleCard = (id: number) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4af37] p-4 md:p-12 font-serif">
      {/* Header Statif */}
      <header className="max-w-7xl mx-auto text-center mb-16 relative">
        <div className="absolute top-0 right-0 p-4">
          <HelpCircle className="w-8 h-8 opacity-40 hover:opacity-100 cursor-help transition-all" />
        </div>
        <h1 className="text-4xl md:text-7xl font-bold tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          Les 22 Arcanes Majeurs
        </h1>
        <div className="flex items-center justify-center gap-4 text-[#d4af37]/60 italic text-lg">
          <Sparkles className="w-5 h-5" />
          <p>Cliquez sur une lame pour révéler son mystère</p>
          <Sparkles className="w-5 h-5" />
        </div>
      </header>

      {/* Grille des 22 cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 max-w-[1600px] mx-auto pb-20">
        {ARCANES_MAJEURS.map((card) => (
          <div 
            key={card.id}
            onClick={() => toggleCard(card.id)}
            className="relative h-[480px] cursor-pointer group perspective-1000"
          >
            <div className={`relative w-full h-full transition-all duration-[850ms] preserve-3d ${flipped[card.id] ? 'rotate-y-180' : 'hover:scale-[1.04]'}`}>
              
              {/* DOS (LE GRIMOIRE) */}
              <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-[#0a0c10] rounded-2xl border-[3px] border-[#d4af37] shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="absolute inset-4 border border-[#d4af37]/10 rounded-xl pointer-events-none" />
                <svg viewBox="0 0 100 100" className="w-32 h-32 z-10 opacity-80">
                  <path d="M50 15 L85 75 L15 75 Z" fill="none" stroke="#d4af37" strokeWidth="0.8" />
                  <path d="M30 52 Q50 30 70 52 Q50 74 30 52" fill="none" stroke="#d4af37" strokeWidth="1" />
                  <circle cx="50" cy="52" r="5" fill="#d4af37" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" strokeWidth="0.1" />
                </svg>
                <span className="mt-8 text-[10px] tracking-[0.5em] opacity-30 uppercase">Arcane {card.id}</span>
              </div>

              {/* DEVANT (L'ILLUSTRATION) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0d0d0d] rounded-2xl p-4 flex flex-col border-[4px] border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                <div className="relative flex-1 w-full border border-[#d4af37]/40 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <img 
                    src={card.img} 
                    alt={card.name} 
                    className="max-h-[90%] max-w-[90%] object-contain z-10 sepia-[0.4] brightness-90" 
                  />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-10 mix-blend-overlay" />
                </div>
                <div className="h-12 flex items-center justify-center">
                  <span className="text-lg font-bold tracking-[0.2em] text-[#d4af37] uppercase font-serif drop-shadow-md">
                    {card.name}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <style>{`
        .perspective-1000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}