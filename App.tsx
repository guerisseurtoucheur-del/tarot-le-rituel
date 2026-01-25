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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const toggleCard = (id: number) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4af37] p-4 md:p-8 font-serif">
      <header className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase mb-2">
          Le Rituel de Grimaud
        </h1>
        <p className="text-[#d4af37]/60 italic">Choisissez vos lames pour le tirage</p>
      </header>

      {/* Grille ajustée : plus de colonnes, cartes plus petites */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 max-w-[1400px] mx-auto pb-20">
        {ARCANES_MAJEURS.map((card) => (
          <div 
            key={card.id}
            onClick={() => toggleCard(card.id)}
            className="relative h-[280px] md:h-[320px] cursor-pointer group"
            style={{ perspective: '1200px' }}
          >
            <div 
              className="relative w-full h-full transition-all duration-700"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: flipped[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              
              {/* DOS (Plus sobre) */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] rounded-xl border-2 border-[#d4af37]/50 shadow-lg"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-3xl opacity-40">👁️</div>
              </div>

              {/* FACE (Dessin préservé mais ajusté) */}
              <div 
                className="absolute inset-0 bg-[#0d0d0d] rounded-xl p-2 flex flex-col border-2 border-[#d4af37]"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)' 
                }}
              >
                <div className="relative flex-1 w-full border border-[#d4af37]/20 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <img 
                    src={card.img} 
                    alt={card.name} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
                <div className="h-8 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">{card.name}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}