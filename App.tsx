import React, { useState, useEffect } from 'react';

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
  const [mounted, setMounted] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-black" />;

  const toggleCard = (id: number) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4af37] p-4 md:p-6 font-serif">
      <header className="max-w-7xl mx-auto text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold tracking-[0.3em] uppercase mb-2">Le Rituel de Grimaud</h1>
        <p className="text-[#d4af37]/50 italic text-sm">Cliquez sur une lame pour révéler son mystère</p>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-w-[1200px] mx-auto pb-10">
        {ARCANES_MAJEURS.map((card) => (
          <div 
            key={card.id}
            onClick={() => toggleCard(card.id)}
            className="relative h-[150px] md:h-[180px] cursor-pointer group"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="relative w-full h-full transition-all duration-700 shadow-lg"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: flipped[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              
              {/* DOS MYSTIQUE (Style Salon de Cartomancie) */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-[#d4af37]/40 overflow-hidden"
                style={{ 
                    backfaceVisibility: 'hidden',
                    background: 'radial-gradient(circle, #1a1a1a 0%, #050505 100%)'
                }}
              >
                {/* Motif géométrique sacré en SVG pour la netteté */}
                <svg width="60%" height="60%" viewBox="0 0 100 100" className="opacity-60 text-[#d4af37]">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="0.3" />
                    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="2" fill="currentColor" />
                </svg>
                <div className="absolute inset-1 border border-[#d4af37]/10 rounded-md pointer-events-none" />
              </div>

              {/* FACE (Dessins originaux intacts) */}
              <div 
                className="absolute inset-0 bg-[#0d0d0d] rounded-lg p-1 flex flex-col border border-[#d4af37]"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)' 
                }}
              >
                <div className="relative flex-1 w-full rounded overflow-hidden bg-black flex items-center justify-center">
                  <img src={card.img} alt={card.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="h-4 flex items-center justify-center mt-1">
                  <span className="text-[8px] font-bold tracking-tighter uppercase text-[#d4af37]/80">{card.name}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}