import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Interfaces para validação do TypeScript
interface Musica {
  _id: string;
  nome: string;
  artista: string;
  audioUrl: string;
  duracao?: string;
}

interface Album {
  _id: string;
  nome: string;
  artista: string;
  capaUrl?: string;
  ano: number;
  genero: string;
  musicas?: Musica[]; // Lista de músicas que pertencem a este álbum
}

interface DetalheAlbumProps {
  setMusicaAtual: (musica: any) => void;
}

export default function DetalheAlbum({ setMusicaAtual }: DetalheAlbumProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados do álbum específico e suas músicas atreladas
    axios.get(`http://localhost:5000/album/${id}`)
      .then(res => {
        setAlbum(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar detalhes do álbum:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ color: '#b3b3b3', padding: '32px' }}>Carregando álbum...</div>;
  }

  if (!album) {
    return <div style={{ color: '#e91429', padding: '32px' }}>Álbum não encontrado.</div>;
  }

  // Função para tocar o álbum inteiro a partir da primeira faixa
  const tocarAlbumCompleto = () => {
    if (album.musicas && album.musicas.length > 0) {
      const primeiraFaixa = album.musicas[0];
      setMusicaAtual({
        nome: primeiraFaixa.nome,
        artista: primeiraFaixa.artista || album.artista,
        audioUrl: primeiraFaixa.audioUrl,
        capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
      });
    } else {
      alert("Este álbum ainda não possui músicas cadastradas!");
    }
  };

  return (
    <div style={{ padding: '0 0 32px 0', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 🔙 Botão Voltar */}
      <button 
        onClick={() => navigate('/')}
        style={{ background: 'transparent', border: 'none', color: '#b3b3b3', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ⬅ Voltar para o Início
      </button>

      {/* 🏞️ Banner Superior do Álbum (Estilo Spotify Hero) */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '32px' }}>
        <img 
          src={album.capaUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300'} 
          alt={album.nome} 
          style={{ width: '232px', height: '232px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        />
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#fff' }}>ÁLBUM</span>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '8px 0', color: '#fff', letterSpacing: '-0.04em', lineHeight: '1' }}>{album.nome}</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
            {album.artista} • <span style={{ color: '#b3b3b3', fontWeight: '400' }}>{album.ano} • {album.musicas?.length || 0} músicas</span>
          </p>
        </div>
      </div>

      {/* 🟢 Barra de Ações (Botão Play Gigante) */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '24px 0', marginBottom: '20px' }}>
        <button 
          onClick={tocarAlbumCompleto}
          style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1ed760', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.5rem', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ▶
        </button>
      </div>

      {/* 📊 Tabela de Músicas */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Cabeçalho da Tabela */}
        <div style={{ display: 'flex', borderBottom: '1px solid #282828', padding: '8px 16px', color: '#b3b3b3', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div style={{ width: '5%' }}>#</div>
          <div style={{ width: '60%' }}>Título</div>
          <div style={{ width: '35%', textAlign: 'right' }}>Ação</div>
        </div>

        {/* Lista de Faixas reais vindas do Back */}
        {!album.musicas || album.musicas.length === 0 ? (
          <p style={{ color: '#b3b3b3', padding: '24px 16px', fontSize: '0.9rem' }}>Este álbum não tem nenhuma faixa cadastrada ainda.</p>
        ) : (
          album.musicas.map((musica, index) => (
            <div 
              key={musica._id}
              onClick={() => setMusicaAtual({
                nome: musica.nome,
                artista: musica.artista || album.artista,
                audioUrl: musica.audioUrl,
                capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
              })}
              style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Número da faixa */}
              <div style={{ width: '5%', color: '#b3b3b3', fontSize: '0.9rem' }}>{index + 1}</div>
              
              {/* Info da Música */}
              <div style={{ width: '60%' }}>
                <div style={{ color: '#fff', fontWeight: '500', fontSize: '0.95rem' }}>{musica.nome}</div>
                <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{musica.artista || album.artista}</div>
              </div>

              {/* Botão rápido para dar Play individual */}
              <div style={{ width: '35%', textAlign: 'right', color: '#1ed760', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Ouvir Faixa ▶
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}