import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Biblioteca() {
  const [curtidas, setCurtidas] = useState<any[]>([]);
  // controla qual aba está ativa: 'musicas' ou 'albuns'
  const [abaAtiva, setAbaAtiva] = useState<'musicas' | 'albuns'>('musicas');
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

  const musicasCurtidas = curtidas.filter(item => item.musicaId);
  const albunsCurtidos = curtidas.filter(item => item.albumId);

  // define qual lista exibir no grid com base na aba clicada
  const itensExibidos = abaAtiva === 'musicas' ? musicasCurtidas : albunsCurtidos;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', padding: '32px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Sua Biblioteca</h2>
      <p style={{ color: '#b3b3b3', fontSize: '0.95rem', margin: '0 0 24px 0' }}>
        Coleção exclusiva de <span style={{ color: '#1ed760', fontWeight: 'bold' }}>{userName}</span>
      </p>

      {/*  Abas Estilo Spotify para alternar entre Músicas e Álbuns */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <button
          onClick={() => setAbaAtiva('musicas')}
          style={{
            backgroundColor: abaAtiva === 'musicas' ? '#fff' : '#232323',
            color: abaAtiva === 'musicas' ? '#000' : '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '500px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Músicas
        </button>
        <button
          onClick={() => setAbaAtiva('albuns')}
          style={{
            backgroundColor: abaAtiva === 'albuns' ? '#fff' : '#232323',
            color: abaAtiva === 'albuns' ? '#000' : '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '500px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Álbuns
        </button>
      </div>

      {itensExibidos.length === 0 ? (
        <p style={{ color: '#b3b3b3', fontSize: '0.95rem', backgroundColor: '#181818', padding: '24px', borderRadius: '8px', maxWidth: '600px' }}>
          {abaAtiva === 'musicas' 
            ? "Você ainda não curtiu nenhuma música. Vá até os detalhes de uma faixa e clique no coração!"
            : "Você ainda não favoritou nenhum álbum. Entre na página de um álbum e clique para salvar!"}
        </p>
      ) : (
        /* Grid responsivo padrão */
        <div 
          className="section-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '24px' 
          }}
        >
          {itensExibidos.map(item => {
            //  mapeia dinamicamente se o objeto alvo é a música ou o álbum atual
            const dadoObjeto = abaAtiva === 'musicas' ? item.musicaId : item.albumId;
            if (!dadoObjeto) return null; 
            
            // Define a rota dinâmica baseada na aba ativa
            const rotaRedirecionamento = abaAtiva === 'musicas' 
              ? `/musica/${dadoObjeto._id}` 
              : `/album/${dadoObjeto._id}`;

            return (
              <div 
                key={item._id} 
                className="music-card" 
                onClick={() => navigate(rotaRedirecionamento, { state: { deOndeVeio: '/biblioteca' } })} 
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
                {/* Imagem/Capa */}
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: abaAtiva === 'musicas' ? '6px' : '4px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                  <img 
                    src={dadoObjeto.capaUrl || dadoObjeto.imagemUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300"} 
                    alt={dadoObjeto.nome || dadoObjeto.titulo} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                    {dadoObjeto.nome || dadoObjeto.titulo}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dadoObjeto.artista || "Álbum"}
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