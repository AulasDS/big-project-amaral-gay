import { useState, useEffect } from 'react';
import axios from 'axios';

export default function GerenciarMusicas() {
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
          <div style={{ display: 'flex', padding: '0 16px', color: '#b3b3b3', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span style={{ width: '40px' }}>#</span>
            <span style={{ flex: 1 }}>Título</span>
            <span>Duração</span>
          </div>

          {/* Renderização das Linhas das Músicas */}
          {musicas.map((musica, index) => (
            <div
              key={musica._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '4px',
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

              <span style={{ color: '#b3b3b3', fontSize: '0.9rem', marginRight: '20px' }}>{musica.duracao || musica.minutagem}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}