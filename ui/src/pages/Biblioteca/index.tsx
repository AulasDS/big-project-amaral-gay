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
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Sua Biblioteca</h2>
        <p style={{ color: '#b3b3b3', margin: '16px 0' }}>Selecione um perfil de usuário para visualizar sua biblioteca pessoal de músicas curtidas.</p>
        <button onClick={() => navigate('/select-perfil')} style={{ backgroundColor: '#1ed760', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Selecionar Perfil</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Sua Biblioteca</h2>
      <p style={{ color: '#b3b3b3', marginBottom: '24px' }}>Coleção exclusiva de <span style={{ color: '#1ed760', fontWeight: 'bold' }}>{userName}</span></p>

      {curtidas.length === 0 ? (
        <p style={{ color: '#b3b3b3' }}>Você ainda não curtiu nenhuma música. Vá até os detalhes de uma faixa e clique no coração!</p>
      ) : (
        <div className="section-grid">
          {curtidas.map(item => {
            // 🟢 Alinhado com o novo modelo focado em músicas
            const musica = item.musicaId;
            if (!musica) return null; // Prevenção caso a música tenha sido deletada do banco
            
            return (
              // 🟢 Navega para os detalhes da música e exibe a imagem ou um fallback padrão do Unsplash
              <div key={item._id} className="music-card" onClick={() => navigate(`/musica/${musica._id}`)} style={{ cursor: 'pointer' }}>
                <img 
                  src={musica.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300"} 
                  alt={musica.nome} 
                />
                <h4>{musica.nome}</h4>
                <p>{musica.artista}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}