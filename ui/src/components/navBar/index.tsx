import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const itensMenu = [
    { nome: 'Início', rota: '/' },
    { nome: 'Biblioteca', rota: '/biblioteca'},
    { nome: 'Músicas', rota: '/musicas', },
    { nome: 'Criar Música', rota: '/inserir-musica', },
    { nome: 'Criar Álbum', rota: '/inserir-album', },
  ];

  return (
    <nav style={{
      backgroundColor: 'transparent', // 🟢 Corrigido para transparente para não criar blocos pretos rígidos
      height: '100%',            
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxSizing: 'border-box',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
    }}>
      
      <div 
        onClick={() => navigate('/')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer',
          padding: '0 8px',
          marginBottom: '8px'
        }}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" 
          alt="Spotify Logo" 
          style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
        />
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Spotify
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {itensMenu.map((item, index) => {
          const isActive = location.pathname === item.rota;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={item.nome}
              onClick={() => navigate(item.rota)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: isHovered ? '#1a1a1a' : 'transparent', // Adiciona feedback suave ao passar o mouse
                border: 'none',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'color 0.2s ease, background-color 0.2s ease',
                color: isActive || isHovered ? '#ffffff' : '#b3b3b3',
              }}
            >
              <span style={{ fontSize: '0.95rem', fontWeight: isActive ? '700' : '600' }}>
                {item.nome}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}