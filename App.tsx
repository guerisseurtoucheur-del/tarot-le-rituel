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
  const [isClient, setIsClient] = useState(false);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  // Sécurité pour Vercel (évite les erreurs d'hydratation)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectCard = (card: any) => {
    if (selectedCards.length < 4 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-black text-[#d4af37] p-4 md:p-10">
      <h1 className="text-center text-3xl font-bold uppercase tracking-widest mb-10">
        Salon de Cartomancie
      </h1>

      {selectedCards.length < 4 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
          {ARCANES_MAJEURS.map((card) => (
            <div 
              key={card.id}
              onClick={() => selectCard(card)}
              className={`aspect-[2/3] border rounded cursor-pointer transition-all flex items-center justify-center
                ${selectedCards.find(c => c.id === card.id) ? 'opacity-10 border-gray-600' : 'border-[#d4af37]/50 hover:border-[#d4af37]'}`}
            >
              <div className="text-[8px]">ARCANUM</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {selectedCards.map((card, idx) => (
            <div 
              key={idx} 
              className={`h-64 border-2 border-[#d4af37] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-[#111]
                ${idx === 2 ? 'col-start-2 row-start-1' : idx === 3 ? 'col-start-2 row-start-3' : ''}`}
              onClick={() => setFlipped(f => ({...f, [idx]: !f[idx]}))}
            >
              {flipped[idx] ? (
                <img src={card.img} alt={card.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-2 uppercase text-xs">Carte {idx + 1}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedCards.length === 4 && (
        <div className="text-center mt-10">
          <button onClick={() => {setSelectedCards([]); setFlipped({});}} className="border border-[#d4af37] px-6 py-2 rounded">Recommencer</button>
        </div>
      )}
    </div>
  );
}