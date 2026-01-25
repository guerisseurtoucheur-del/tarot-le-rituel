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
  // CRUCIAL : Force React à attendre d'être sur le navigateur
  const [mounted, setMounted] = useState(false);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;

  const selectCard = (card: any) => {
    if (selectedCards.length < 4 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const positions = [
    { label: "Le Présent", pos: "md:col-start-1 md:row-start-2" },
    { label: "L'Obstacle", pos: "md:col-start-3 md:row-start-2" },
    { label: "Le Conseil", pos: "md:col-start-2 md:row-start-1" },
    { label: "L'Issue", pos: "md:col-start-2 md:row-start-3" },
  ];

  return (
    <div className="min-h-screen bg-black text-[#d4af37] p-6 font-serif">
      <h1 className="text-center text-4xl font-bold uppercase tracking-[0.2em] py-10">
        Salon de Cartomancie
      </h1>

      {selectedCards.length < 4 ? (
        /* SÉLECTION */
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 max-w-6xl mx-auto">
          {ARCANES_MAJEURS.map((card) => (
            <div 
              key={card.id}
              onClick={() => selectCard(card)}
              className={`aspect-[2/3] border rounded cursor-pointer transition-all flex items-center justify-center bg-[#111]
                ${selectedCards.find(c => c.id === card.id) ? 'opacity-5 border-transparent' : 'border-[#d4af37]/40 hover:border-[#d4af37]'}`}
            >
              <span className="text-[10px] opacity-20">{card.id}</span>
            </div>
          ))}
        </div>
      ) : (
        /* TIRAGE EN CROIX */
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 pt-10 h-[800px] items-center">
          {selectedCards.map((card, idx) => (
            <div key={idx} className={`w-full ${positions[idx].pos}`}>
              <p className="text-center text-[10px] mb-2 uppercase opacity-40 tracking-widest">{positions[idx].label}</p>
              <div 
                onClick={() => setFlipped(f => ({...f, [idx]: !f[idx]}))}
                className="relative aspect-[2/3] border-2 border-[#d4af37] rounded-xl overflow-hidden cursor-pointer bg-[#0a0a0a]"
              >
                {flipped[idx] ? (
                  <img src={card.img} className="w-full h-full object-contain p-1" alt={card.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">👁</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCards.length === 4 && (
        <div className="text-center py-20">
          <button onClick={() => {setSelectedCards([]); setFlipped({});}} className="border border-[#d4af37] px-8 py-2 hover:bg-[#d4af37] hover:text-black transition-all">
            NOUVEAU TIRAGE
          </button>
        </div>
      )}
    </div>
  );
}