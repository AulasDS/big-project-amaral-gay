import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Musica {
  _id: string;
  nome: string;
  artista: string;
  genero: string;
  audioUrl: string;
  capaUrl?: string; 
  albumId?: string;
}

interface Album {
  _id: string;
  nome: string;
  artista: string;
  capaUrl?: string;
  ano: number;
  genero: string;
}

export default function Home() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [albuns, setAlbuns] = useState<Album[]>([]); 
  
  const [generosDisponiveis, setGenerosDisponiveis] = useState<string[]>(['Álbuns', 'Geral']);
  const [generoSelecionado, setGeneroSelecionado] = useState('Geral');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const obterSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  useEffect(() => {
    axios.get('http://localhost:5000/musica')
      .then((res) => {
        const dados: Musica[] = res.data;
        const generosUnicos = Array.from(
          new Set(dados.map(m => m.genero ? m.genero.trim() : '').filter(g => g !== ''))
        );
        setGenerosDisponiveis(['Álbuns', 'Geral', ...generosUnicos]);
      })
      .catch((err) => console.error('Erro ao listar gêneros:', err));
  }, []);

  useEffect(() => {
    if (generoSelecionado === 'Álbuns') {
      axios
        .get('http://localhost:5000/album')
        .then((res) => setAlbuns(res.data))
        .catch((err) => console.error('Erro ao buscar álbuns:', err));
    } else {
      const url =
        generoSelecionado === 'Geral'
          ? 'http://localhost:5000/musica'
          : `http://localhost:5000/musica?genero=${generoSelecionado}`;

      axios
        .get(url)
        .then((res) => setMusicas(res.data))
        .catch((err) => console.error('Erro ao buscar músicas:', err));
    }
  }, [generoSelecionado]);

  return (
    <div
      style={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#fff',
        padding: '32px',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif'",
      }}
    >
      <header style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.04em' }}>
            {obterSaudacao()}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {generosDisponiveis.map((gen) => {
            const isActive = generoSelecionado === gen;

            return (
              <button
                key={gen}
                onClick={() => setGeneroSelecionado(gen)}
                style={{
                  backgroundColor: isActive ? '#1ed760' : '#232323',
                  color: isActive ? '#000' : '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '500px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
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

      <main style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {generoSelecionado === 'Álbuns' 
            ? 'Todos os Álbuns' 
            : generoSelecionado === 'Geral' 
            ? 'Navegar por todas as músicas' 
            : `Melhores faixas de ${generoSelecionado}`}
        </h2>

        {generoSelecionado === 'Álbuns' ? (
          albuns.length === 0 ? (
            <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Nenhum álbum encontrado.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
              {albuns.map((album) => {
                const isHovered = hoveredId === album._id;

                return (
                  <div
                    key={album._id}
                    onClick={() => navigate(`/album/${album._id}`, { state: { deOndeVeio: '/' } })}
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
                      gap: '12px',
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden' }}>
                      <img
                        src={album.capaUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300'}
                        alt={album.nome}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isHovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.3s ease' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {album.nome}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {album.artista}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#b3b3b3' }}>{album.ano}</span>
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#2a2a2a', color: '#1ed760', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          {album.genero}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          musicas.length === 0 ? (
            <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Nenhuma música encontrada neste gênero.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
              {musicas.map((musica) => {
                const isHovered = hoveredId === musica._id;

                return (
                  <div
                    key={musica._id}
                    onClick={() => navigate(`/musica/${musica._id}`)}
                    onMouseEnter={() => setHoveredId(musica._id)}
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
                      gap: '12px',
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden' }}>
                      <img
                        /* 🟢 Alterado aqui para renderizar dinamicamente a capaUrl da música vinda do Back-end */
                        src={musica.capaUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300'}
                        alt={musica.nome}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isHovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.3s ease' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {musica.nome}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {musica.artista}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#2a2a2a', color: '#1ed760', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          {musica.genero}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}