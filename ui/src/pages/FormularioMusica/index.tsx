import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Album {
  _id: string;
  nome: string;
}

export default function FormularioMusica() {
  const [defaultAlbum, setDefaultAlbum] = useState('');
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); // 👈 Novo estado para o link do áudio
  const [albuns, setAlbuns] = useState<Album[]>([]);
  
  const navigate = useNavigate();

  // Busca os álbuns para preencher o campo de seleção (select)
  useEffect(() => {
  axios.get('http://localhost:5000/album')
    .then(res => {
      setAlbuns(res.data);

      const padrao = res.data.find(
        (a: any) => a.nome === "Músicas Recomendadas"
      );

      if (padrao) {
        setDefaultAlbum(padrao._id);
      }
    })
    .catch(err => console.error(err));
}, []);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

  const dadosDaMusica = {
    nome: titulo,
    artista,
    albumId: albumId === "" ? defaultAlbum : albumId, // 👈 TEM QUE SER O ID REAL
    audioUrl
  };

    axios.post('http://localhost:5000/musica', dadosDaMusica)
      .then(() => {
        alert("Música salva com sucesso!");
        navigate('/musicas');
      })
      .catch(err => alert("Erro ao salvar: " + (err.response?.data?.message || err.message)));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', color: '#fff' }}>Adicionar Música</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Título da Música</label>
          <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: Starboy" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Artista / Banda</label>
          <input type="text" value={artista} onChange={e => setArtista(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: The Weeknd" />
        </div>

        {/* 🔊 NOVO CAMPO: URL do arquivo de áudio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>URL do Arquivo de Áudio (.mp3)</label>
          <input type="text" value={audioUrl} onChange={e => setAudioUrl(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="https://www.site.com/musica.mp3" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Vincular ao Álbum</label>
          <select value={albumId} onChange={e => setAlbumId(e.target.value)} style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            <option value="">Nenhum (Single avulso)</option>
            {albuns.map(album => (
              <option key={album._id} value={album._id}>{album.nome}</option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px', borderRadius: '500px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>
          Lançar Faixa
        </button>
      </form>
    </div>
  );
}