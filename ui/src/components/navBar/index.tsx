import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Serve para sabermos em qual página o usuário está
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 📋 Lista de itens do menu atualizada com os links de músicas
  const itensMenu = [
    { nome: 'Início', rota: '/', icone: '🏠' },
    { nome: 'Biblioteca', rota: '/biblioteca', icone: '📚' },
    { nome: 'Músicas', rota: '/musicas', icone: '🎵' },            // 👈 Navega para a lista de reprodução
    { nome: 'Criar Música', rota: '/inserir-musica', icone: '✨' }, // 👈 Navega para o formulário que criamos
    { nome: 'Criar Álbum', rota: '/inserir-album', icone: '➕' },
    { nome: 'Criar Perfil', rota: '/inserir-usuario', icone: '👤' },
    { nome: 'Gerenciar Perfis', rota: '/usuarios', icone: '⚙️' },
  ];

  return (
    <nav style={{
      width: '240px',
      backgroundColor: '#000000',
      height: '100vh',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'fixed', // Deixa a barra fixa na esquerda
      left: 0,
      top: 0,
      boxSizing: 'border-box',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      borderRight: '1px solid #1c1c1c'
    }}>
      
      {/* Logo / Título do Projeto com Logótipo Oficial */}
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
          style={{ 
            width: '32px', 
            height: '32px',
            objectFit: 'contain'
          }} 
        />

        <h2 style={{ 
          color: '#fff', 
          margin: 0, 
          fontSize: '1.3rem', 
          fontWeight: '800',
          letterSpacing: '-0.03em'
        }}>
          Spotify
        </h2>
      </div>

      {/* Links de Navegação */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {itensMenu.map((item, index) => {
          // Verifica se o usuário está exatamente nessa página para acender o menu
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
                backgroundColor: 'transparent',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'color 0.2s ease, background-color 0.2s ease',
                // Se estiver ativo ou com o mouse em cima, fica branco. Se não, fica cinza.
                color: isActive || isHovered ? '#ffffff' : '#b3b3b3',
              }}
            >
              <span style={{ 
                fontSize: '1.2rem',
                // Dá um toque verde no ícone se a página estiver ativa
                filter: isActive ? 'drop-shadow(0 0 2px #1ed760)' : 'none' 
              }}>
                {item.icone}
              </span>
              
              <span style={{ 
                fontSize: '0.95rem', 
                fontWeight: isActive ? '700' : '600' 
              }}>
                {item.nome}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rodapé da Navbar */}
      <div style={{ padding: '0 16px', color: '#727272', fontSize: '0.75rem' }}>
        <p style={{ margin: 0 }}>© 2026 Spotify Project</p>
      </div>

    </nav>
  );
}