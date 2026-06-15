import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Playlist {
  _id: string;
  nome: string;
  descricao: string;
}

export default function GerenciarPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const navigate = useNavigate();

  const carregarPlaylists = () => {
    axios.get('http://localhost:5000/playlist') // Altere para a sua rota de playlists da API
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    carregarPlaylists();
  }, []);

  const deletarPlaylist = (id: string) => {
    if (window.confirm("Deseja deletar esta playlist?")) {
      axios.delete(`http://localhost:5000/playlist/${id}`)
        .then(() => carregarPlaylists())
        .catch(err => alert("Erro ao deletar: " + err.message));
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Suas Playlists</h2>
        <button 
          onClick={() => navigate('/inserir-playlist')}
          style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Criar Playlist
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#282828', color: '#b3b3b3', fontSize: '0.9rem' }}>
            <th style={{ padding: '16px' }}>Nome</th>
            <th style={{ padding: '16px' }}>Descrição</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist._id} style={{ borderBottom: '1px solid #282828', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#242424'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>{playlist.nome}</td>
              <td style={{ padding: '16px', color: '#b3b3b3' }}>{playlist.descricao || 'Sem descrição.'}</td>
              <td style={{ padding: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => deletarPlaylist(playlist._id)}
                  style={{ background: '#e91429', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}