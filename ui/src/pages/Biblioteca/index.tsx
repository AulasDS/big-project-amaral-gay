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
        <p style={{ color: '#b3b3b3', margin: '16px 0' }}>Selecione um perfil de usuário para visualizar sua biblioteca pessoal de álbuns curtidos.</p>
        <button onClick={() => navigate('/select-perfil')} style={{ backgroundColor: '#1ed760', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Selecionar Perfil</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Sua Biblioteca</h2>
      <p style={{ color: '#b3b3b3', marginBottom: '24px' }}>Coleção exclusiva de <span style={{ color: '#1ed760', fontWeight: 'bold' }}>{userName}</span></p>

      {curtidas.length === 0 ? (
        <p style={{ color: '#b3b3b3' }}>Você ainda não curtiu nenhum álbum. Vá até a Home e clique em "Curtir Álbum"!</p>
      ) : (
        <div className="section-grid">
          {curtidas.map(item => {
            const album = item.albumId;
            if (!album) return null; // Prevenção caso o álbum tenha sido deletado
            return (
              <div key={item._id} className="music-card" onClick={() => navigate(`/album/${album._id}`)} style={{ cursor: 'pointer' }}>
                <img src={album.capaUrl} alt={album.nome} />
                <h4>{album.nome}</h4>
                <p>{album.artista}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}