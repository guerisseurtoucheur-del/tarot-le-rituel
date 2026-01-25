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
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const selectCard = (card: any) => {
    if (selectedCards.length < 4 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const reset = () => {
    setSelectedCards([]);
    setFlipped({});
  };

  const positions = [
    { label: "Le Présent", pos: "md:col-start-1 md:row-start-2" },
    { label: "L'Obstacle", pos: "md:col-start-3 md:row-start-2" },
    { label: "Le Conseil", pos: "md:col-start-2 md:row-start-1" },
    { label: "L'Issue", pos: "md:col-start-2 md:row-start-3" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4af37] p-4 font-serif selection:bg-[#d4af37] selection:text-black">
      {/* HEADER */}
      <header className="max-w-4xl mx-auto text-center py-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] uppercase mb-4 drop-shadow-2xl">
          Salon de Cartomancie
        </h1>
        <div className="h-px w-32 bg-[#d4af37] mx-auto mb-6 opacity-50" />
        <p className="text-lg italic opacity-70">
          {selectedCards.length < 4 
            ? `Veuillez choisir ${4 - selectedCards.length} arcanes pour commencer...` 
            : "Le tirage est prêt. Retournez les lames pour voir votre chemin."}
        </p>
      </header>

      {/* PHASE 1 : SÉLECTION */}
      {selectedCards.length < 4 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3 max-w-6xl mx-auto pb-20">
          {ARCANES_MAJEURS.map((card) => {
            const isSelected = selectedCards.find(c => c.id === card.id);
            return (
              <div 
                key={card.id}
                onClick={() => selectCard(card)}
                className={`aspect-[2/3] border-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center bg-[#0a0a0a]
                  ${isSelected ? 'opacity-10 border-gray-800 scale-90' : 'border-[#d4af37]/30 hover:border-[#d4af37] hover:-translate-y-2 shadow-lg shadow-black'}`}
              >
                <div className="text-[10px] tracking-tighter opacity-30 text-center">✧<br/>{card.id}<br/>✧</div>
              </div>
            );
          })}
        </div>
      ) : (
        /* PHASE 2 : LE TIRAGE EN CROIX */
        <div className="max-w-5xl mx-auto py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-8 items-center justify-items-center">
            {selectedCards.map((card, index) => (
              <div key={index} className={`w-full max-w-[220px] ${positions[index].pos}`}>
                <p className="text-center text-[10px] tracking-[0.3em] uppercase mb-3 opacity-40">{positions[index].label}</p>
                
                <div 
                  className="relative h-[340px] w-full cursor-pointer [perspective:1000px]"
                  onClick={() => setFlipped(prev => ({...prev, [index]: !prev[index]}))}
                >
                  <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${flipped[index] ? '[transform:rotateY(180deg)]' : ''}`}>
                    
                    {/* DOS (Style Grimoire) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] bg-[#0d0d0d] border-2 border-[#d4af37] rounded-xl flex items-center justify-center shadow-2xl">
                      <div className="absolute inset-2 border border-[#d4af37]/10 rounded-lg" />
                      <div className="text-4xl">👁</div>
                    </div>

                    {/* FACE (L'image) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-black border-2 border-[#d4af37] rounded-xl overflow-hidden flex flex-col shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                      <img src={card.img} alt={card.name} className="flex-1 object-contain p-2 sepia-[0.3] brightness-90" />
                      <div className="bg-[#d4af37] text-black text-center py-2 text-xs font-bold uppercase tracking-widest">
                        {card.name}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button 
              onClick={reset}
              className="px-10 py-3 border border-[#d4af37] rounded-full text-xs uppercase tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition-all active:scale-95"
            >
              Nouveau Tirage
            </button>
          </div>
        </div>
      )}
      
      <footer className="text-center py-10 opacity-20 text-[10px] tracking-[0.5em] uppercase">
        In Umbra Nihil Est
      </footer>
    </div>
  );
}