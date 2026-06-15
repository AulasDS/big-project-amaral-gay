import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FormularioPlaylist() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const navigate = useNavigate();

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosDaPlaylist = {
      nome,
      descricao
    };

    axios.post('http://localhost:5000/playlist', dadosDaPlaylist)
      .then(() => {
        alert("Playlist criada com sucesso!");
        navigate('/playlists');
      })
      .catch(err => alert("Erro ao criar: " + (err.response?.data?.message || err.message)));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Criar Nova Playlist</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Nome da Playlist</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: Minhas Favoritas" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Descrição</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff', resize: 'none', height: '100px' }} placeholder="Dê uma descrição bacana para a sua playlist..." />
        </div>

        <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px', borderRadius: '500px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>
          Criar
        </button>
      </form>
    </div>
  );
}