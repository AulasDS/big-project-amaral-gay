import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 📋 Interface para mapear os dados que vêm do seu banco MongoDB
interface Album {
  _id: string;
  nome: string;
  artista: string;
  capaUrl?: string;
  ano: number;
  genero: string;
}

// 🛠️ Interface adicionada para o TypeScript aceitar a função de controle do player global
interface HomeProps {
  setMusicaAtual: (musica: any) => void;
}

export default function Home({ setMusicaAtual }: HomeProps) {
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [generoSelecionado, setGeneroSelecionado] = useState('Geral');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para definir a saudação baseada na hora do dia
  const obterSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Buscar álbuns do backend toda vez que o gênero selecionado mudar
  useEffect(() => {
    const url = generoSelecionado === 'Geral' 
      ? 'http://localhost:5000/album' 
      : `http://localhost:5000/album?genero=${generoSelecionado}`;

    axios.get(url)
      .then(res => setAlbuns(res.data))
      .catch(err => console.error("Erro ao buscar álbuns:", err));
  }, [generoSelecionado]);

  return (
    <div style={{
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#fff',
      padding: '32px',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      
      {/* 🌤️ Cabeçalho de Boas-Vindas */}
      <header style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.04em' }}>
            {obterSaudacao()}
          </h1>

          {/* ⚡ ATALHO DE TESTE: Envia um som direto para o rodapé do App.tsx */}
          <button 
            onClick={() => setMusicaAtual({
              nome: "Freek'n You (Fast Mix)",
              artista: "Jodeci & SoundHelix",
              audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              capaUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
            })}
            style={{ 
              backgroundColor: '#1ed760', 
              color: '#000', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '500px', 
              fontSize: '0.85rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 215, 96, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ▶ Testar Player na Home
          </button>
        </div>

        {/* 🏷️ Filtros de Gênero */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Geral', 'Rock', 'Pop', 'Sertanejo'].map((gen) => {
            const isActive = generoSelecionado === gen;
            return (
              <button
                key={gen}
                onClick={() => setGeneroSelecionado(gen)}
                style={{
                  backgroundColor: isActive ? '#fff' : '#232323',
                  color: isActive ? '#000' : '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '500px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, background-color 0.2s ease',
                }}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#232323')}
              >
                {gen}
              </button>
            );
          })}
        </div>
      </header>

      {/* 🎵 Seção de Conteúdo */}
      <main>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {generoSelecionado === 'Geral' ? 'Navegar por todos os álbuns' : `Melhores álbuns de ${generoSelecionado}`}
        </h2>

        {albuns.length === 0 ? (
          <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Nenhum álbum encontrado nesta categoria.</p>
        ) : (
          /* 🎴 Grade Responsiva de Cards */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '24px'
          }}>
            {albuns.map((album) => {
              const isHovered = hoveredId === album._id;
              return (
                <div
                  key={album._id}
                  onClick={() => navigate(`/album/${album._id}`)}
                  onMouseEnter={() => setHoveredId(album._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    backgroundColor: isHovered ? '#282828' : '#181818',
                    padding: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Container da Imagem */}
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    borderRadius: '6px', 
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.6)'
                  }}>
                    <img
                      src={album.capaUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop'}
                      alt={album.nome}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Informações do Álbum */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {album.nome}
                    </h3>
                    
                    <p style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      color: '#b3b3b3',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {album.artista}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#b3b3b3' }}>
                        {album.ano}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#2a2a2a',
                        color: '#1ed760',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        {album.genero}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}