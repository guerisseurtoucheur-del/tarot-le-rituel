import React, { useState } from 'react';

// Images stables
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
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const selectCard = (card: any) => {
    if (selectedCards.length < 4 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const resetTirage = () => {
    setSelectedCards([]);
    setFlipped({});
  };

  const positions = [
    { label: "Le Présent", class: "col-start-1 row-start-2" },
    { label: "L'Obstacle", class: "col-start-3 row-start-2" },
    { label: "Le Conseil", class: "col-start-2 row-start-1" },
    { label: "L'Issue", class: "col-start-2 row-start-3" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4af37] p-4 md:p-8 font-serif">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest uppercase mb-2">Le Grand Tirage en Croix</h1>
        <p className="text-[#d4af37]/60 italic">
          {selectedCards.length < 4 
            ? `Choisissez ${4 - selectedCards.length} cartes de votre main` 
            : "Révélez votre destin..."}
        </p>
      </header>

      {selectedCards.length < 4 ? (
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {ARCANES_MAJEURS.map((card) => {
            const isSelected = selectedCards.find(c => c.id === card.id);
            return (
              <div 
                key={card.id}
                onClick={() => selectCard(card)}
                className={`w-20 h-32 cursor-pointer transition-all border rounded-lg flex items-center justify-center bg-[#0a0c10]
                  ${isSelected ? 'opacity-20 scale-90' : 'border-[#d4af37]/40 hover:border-[#d4af37] hover:-translate-y-1'}`}
              >
                <span className="text-[10px] opacity-40 uppercase">Arcane</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-10">
          <div className="grid grid-cols-3 grid-rows-3 gap-4 md:gap-8 items-center justify-items-center h-[600px]">
            {selectedCards.map((card, index) => (
              <div key={index} className={`w-full max-w-[160px] md:max-w-[200px] h-[260px] md:h-[320px] ${positions[index].class}`}>
                <div className="text-center mb-2 text-[10px] tracking-widest uppercase opacity-40">{positions[index].label}</div>
                <div 
                  onClick={() => setFlipped(prev => ({...prev, [index]: !prev[index]}))}
                  className="relative w-full h-full cursor-pointer perspective-1000"
                >
                  <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${flipped[index] ? 'rotate-y-180' : ''}`}>
                    <div className="absolute inset-0 backface-hidden bg-[#0a0c10] rounded-xl border-2 border-[#d4af37] flex flex-col items-center justify-center p-4">
                        <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black rounded-xl border-2 border-[#d4af37] overflow-hidden p-2 flex flex-col">
                       <img src={card.img} alt={card.name} className="flex-1 object-contain" />
                       <div className="text-[9px] text-center mt-1 font-bold uppercase">{card.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <button onClick={resetTirage} className="px-8 py-2 border border-[#d4af37] rounded-full text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all">
              Nouveau Tirage
            </button>
          </div>
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}