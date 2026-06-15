import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function InserirProduto() {
  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [ano, setAno] = useState('');
 
  const navigate = useNavigate();

  
  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosDoAlbum = {
      nome,
      artista,
      capaUrl: capaUrl || undefined, // Se deixar em branco, o Mongoose usa o placeholder padrão
      ano: Number(ano)
    };

    axios.post('http://localhost:5000/album&#39;, dadosDoAlbum)
      .then(() => {
        alert("Álbum cadastrado com sucesso no Spotify!");
        navigate('/produtos'); // Volta para a listagem de gerenciar
      })
      .catch(err => alert("Erro ao salvar: " + err.response?.data?.message || err.message));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Cadastrar Álbum no Banco</h2>
     
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
       
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Nome do Álbum</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: Melodrama" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Artista / Banda</label>
          <input type="text" value={artista} onChange={e => setArtista(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: Lorde" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>URL da Imagem de Capa</label>
          <input type="url" value={capaUrl} onChange={e => setCapaUrl(e.target.value)} style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="https://linkdafoto.com/capa.jpg&quot; />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Ano de Lançamento</label>
          <input type="number" value={ano} onChange={e => setAno(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: 2017" />
        </div>

        <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px', borderRadius: '500px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>
          Salvar na Base de Dados
        </button>
      </form>
    </div>
  );
}