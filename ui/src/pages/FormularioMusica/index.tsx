import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Album {
  _id: string;
  nome: string;
}

export default function FormularioMusica() {
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [duracao, setDuracao] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); // 👈 Novo estado para o link do áudio
  const [albuns, setAlbuns] = useState<Album[]>([]);
  
  const navigate = useNavigate();

  // Busca os álbuns para preencher o campo de seleção (select)
  useEffect(() => {
    axios.get('http://localhost:5000/album')
      .then(res => setAlbuns(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    // Monta os dados traduzindo 'titulo' para 'nome' para casar com o Model do banco
    const dadosDaMusica = {
      nome: titulo, // 👈 Traduzindo título para nome
      artista,
      duracao,
      albumId: albumId || undefined,
      audioUrl      // 👈 Enviando o link da música
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Duração (MM:SS)</label>
          <input type="text" value={duracao} onChange={e => setDuracao(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: 3:50" />
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