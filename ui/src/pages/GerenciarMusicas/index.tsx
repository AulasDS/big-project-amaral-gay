import { useState, useEffect } from 'react';
import axios from 'axios';

interface GerenciarMusicasProps {
  setMusicaAtual: (musica: any) => void;
}

export default function GerenciarMusicas({ setMusicaAtual }: GerenciarMusicasProps) {
  const [musicas, setMusicas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/musica')
      .then(res => {
        setMusicas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar músicas:", err);
        setLoading(false);
      });
  }, []);

  const handleTocarMusica = (musica: any) => {
    // Mescla os dados do banco para o formato aceito pelo Player do seu App.tsx
    setMusicaAtual({
      nome: musica.nome,
      artista: musica.artista,
      audioUrl: musica.audioUrl,
      // Se tiver capaUrl usa, senão coloca uma imagem padrão escura estilizada
      capaUrl: musica.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
    });
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Músicas Cadastradas</h1>

      {loading ? (
        <p style={{ color: '#1ed760', fontWeight: 'bold' }}>Carregando faixas...</p>
      ) : musicas.length === 0 ? (
        <p style={{ color: '#b3b3b3' }}>Nenhuma faixa foi lançada no sistema ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Cabeçalho simples da tabela */}
          <div style={{ display: 'flex', padding: '0 16px', color: '#b3b3b3', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span style={{ width: '40px' }}>#</span>
            <span style={{ flex: 1 }}>Título</span>
            <span>Duração</span>
          </div>

          {/* Renderização das Linhas das Músicas */}
          {musicas.map((musica, index) => (
            <div
              key={musica._id}
              onClick={() => handleTocarMusica(musica)} // 🔥 Ativa o player de áudio do App.tsx!
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ width: '40px', color: '#b3b3b3' }}>{index + 1}</span>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 500 }}>{musica.nome}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#b3b3b3' }}>{musica.artista}</p>
              </div>

              <span style={{ color: '#b3b3b3', fontSize: '0.9rem', marginRight: '20px' }}>{musica.duracao}</span>
              <div style={{ color: '#1ed760', fontSize: '1.2rem' }}>▶</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}