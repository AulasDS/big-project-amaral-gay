import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Biblioteca() {
  const [curtidas, setCurtidas] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/biblioteca/${userId}`)
        .then(res => setCurtidas(res.data))
        .catch(err => console.error(err));
    }
  }, [userId]);

  if (!userId) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', textAlign: 'center', padding: '80px 32px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Sua Biblioteca</h2>
        <p style={{ color: '#b3b3b3', margin: '0 auto 24px auto', maxWidth: '400px', lineHeight: '1.5' }}>
          Selecione um perfil de usuário para visualizar sua biblioteca pessoal de músicas curtidas.
        </p>
        <button 
          onClick={() => navigate('/select-perfil')} 
          style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '12px 32px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', transition: 'transform 0.2s ease' }}
        >
          Selecionar Perfil
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', padding: '32px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Sua Biblioteca</h2>
      <p style={{ color: '#b3b3b3', fontSize: '0.95rem', margin: '0 0 32px 0' }}>
        Coleção exclusiva de <span style={{ color: '#1ed760', fontWeight: 'bold' }}>{userName}</span>
      </p>

      {curtidas.length === 0 ? (
        <p style={{ color: '#b3b3b3', fontSize: '0.95rem', backgroundColor: '#181818', padding: '24px', borderRadius: '8px', maxWidth: '600px' }}>
          Você ainda não curtiu nenhuma música. Vá até os detalhes de uma faixa e clique no coração!
        </p>
      ) : (
        /* 🟢 Grid responsivo idêntico ao da Home */
        <div 
          className="section-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '24px' 
          }}
        >
          {curtidas.map(item => {
            const musica = item.musicaId;
            if (!musica) return null; 
            
            return (
              /* 🟢 Card estilizado no padrão Spotify */
              <div 
                key={item._id} 
                className="music-card" 
                onClick={() => navigate(`/musica/${musica._id}`)} 
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: '#181818',
                  padding: '16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#282828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181818')}
              >
                {/* Imagem/Capa da Música */}
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                  <img 
                    src={musica.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300"} 
                    alt={musica.nome} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Textos Informativos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                    {musica.nome}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {musica.artista}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}