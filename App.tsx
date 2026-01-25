import React, { useState, useEffect } from 'react';

// Liste simplifiée pour tester la stabilité
const ARCANES = [
  { id: 1, name: "LE BATELEUR", img: "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg" },
  { id: 2, name: "LA PAPESSE", img: "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg" },
  { id: 3, name: "L'IMPERATRICE", img: "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg" },
  { id: 4, name: "L'EMPEREUR", img: "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg" }
];

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);

  // Sécurité anti-écran blanc pour Vercel
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div style={{background: 'black', minHeight: '100vh'}} />;
  }

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#d4af37',
      minHeight: '100vh',
      fontFamily: 'serif',
      padding: '40px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        Salon de Voyance
      </h1>
      
      <p style={{ opacity: 0.6, marginBottom: '40px' }}>Cliquez sur une carte pour voir si le site fonctionne</p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {ARCANES.map((card) => (
          <div 
            key={card.id}
            onClick={() => setFlipped(card.id)}
            style={{
              width: '180px',
              height: '280px',
              border: '2px solid #d4af37',
              borderRadius: '12px',
              cursor: 'pointer',
              overflow: 'hidden',
              backgroundColor: '#0a0a0a',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s'
            }}
          >
            {flipped === card.id ? (
              <>
                <img src={card.img} alt={card.name} style={{ width: '100%', height: '85%', objectFit: 'contain' }} />
                <div style={{ fontSize: '12px', padding: '10px', fontWeight: 'bold' }}>{card.name}</div>
              </>
            ) : (
              <div style={{ margin: 'auto', fontSize: '40px' }}>👁️</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '50px', opacity: 0.3, fontSize: '10px' }}>
        Vercel Build Status: Success
      </div>
    </div>
  );
}