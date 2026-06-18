import { useState, useEffect } from 'react';
import axios from 'axios';

// 🟢 Adicionada a interface para receber a função de reprodução idêntica ao álbum
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
          <div style={{ display: 'flex', borderBottom: '1px solid #282828', padding: '8px 16px', color: '#b3b3b3', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <div style={{ width: '5%' }}>#</div>
            <div style={{ width: '75%' }}>Título</div>
            <div style={{ width: '20%', textAlign: 'right' }}>Ação</div>
          </div>

          {/* Renderização das Linhas das Músicas */}
          {musicas.map((musica, index) => (
            <div
              key={musica._id}
              /* 🟢 Ao clicar na linha, dispara o player global exatamente igual ao DetalheAlbum */
              onClick={() => setMusicaAtual({
                nome: musica.nome,
                artista: musica.artista,
                audioUrl: musica.audioUrl,
                capaUrl: musica.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
              })}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Número da faixa */}
              <div style={{ width: '5%', color: '#b3b3b3', fontSize: '0.9rem' }}>{index + 1}</div>
              
              {/* Info da Música */}
              <div style={{ width: '60%' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 500, color: '#fff' }}>{musica.nome}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#b3b3b3' }}>{musica.artista}</p>
              </div>

              {/* Duração */}
              <div style={{ width: '15%', color: '#b3b3b3', fontSize: '0.9rem' }}>
                {musica.duracao || musica.minutagem}
              </div>
              
              {/* 🟢 Botão rápido para dar Play individual no mesmo padrão visual do álbum */}
              <div style={{ width: '20%', textAlign: 'right', color: '#1ed760', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Ouvir Faixa ▶
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}