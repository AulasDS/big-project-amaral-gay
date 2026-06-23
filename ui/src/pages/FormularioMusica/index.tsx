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
  const [genero, setGenero] = useState(''); 
  const [capaUrl, setCapaUrl] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); 
  const [albuns, setAlbuns] = useState<Album[]>([]);
  
  // Estados para controle do Whisper via Backend
  const [gerarLetraAutomatico, setGerarLetraAutomatico] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate();

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
    setCarregando(true);

    const dadosDaMusica = {
      nome: titulo,
      artista,
      genero: genero.trim(),
      capaUrl,
      albumId: albumId === "" ? defaultAlbum : albumId, 
      audioUrl,
      gerarLetraAutomatico // Informa ao backend se deve rodar a IA
    };

    axios.post('http://localhost:5000/musica', dadosDaMusica)
      .then(() => {
        alert("Música salva com sucesso!");
        navigate('/'); 
      })
      .catch(err => alert("Erro ao salvar: " + (err.response?.data?.message || err.message)))
      .finally(() => setCarregando(false));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '#8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', color: '#fff' }}>Adicionar Música</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Título */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Título da Música</label>
          <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: Starboy" />
        </div>

        {/* Artista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Artista / Banda</label>
          <input type="text" value={artista} onChange={e => setArtista(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: The Weeknd" />
        </div>

        {/* Gênero Musical */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Gênero Musical</label>
          <input 
            type="text" 
            value={genero} 
            onChange={e => setGenero(e.target.value)} 
            required 
            style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} 
            placeholder="Ex: Pop, Rock, Lo-Fi, etc." 
          />
        </div>

        {/* URL da Capa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>URL da Capa</label>
          <input type="text" value={capaUrl} onChange={e => setCapaUrl(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="https://www.site.com/capa.jpg" />
        </div>

        {/* URL do Áudio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>URL do Arquivo de Áudio (.mp3)</label>
          <input type="text" value={audioUrl} onChange={e => setAudioUrl(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="https://www.site.com/musica.mp3" />
        </div>

        {/* Vincular ao Álbum */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Vincular ao Álbum</label>
          <select value={albumId} onChange={e => setAlbumId(e.target.value)} style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            <option value="">Nenhum (Single avulso)</option>
            {albuns.map(album => (
              <option key={album._id} value={album._id}>{album.nome}</option>
            ))}
          </select>
        </div>

        {/* Checkbox Ativador de Transcrição por IA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#242424', padding: '12px', borderRadius: '4px', marginTop: '4px' }}>
          <input 
            type="checkbox" 
            id="gerarLetra"
            checked={gerarLetraAutomatico} 
            onChange={e => setGerarLetraAutomatico(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#1ed760', cursor: 'pointer' }}
          />
          <label htmlFor="gerarLetra" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            ✨ Transcrever letra automaticamente usando IA (Whisper)
          </label>
        </div>

        <button 
          type="submit" 
          disabled={carregando}
          style={{ 
            backgroundColor: carregando ? '#1aa34a' : '#1ed760', 
            color: '#000', 
            border: 'none', 
            padding: '14px', 
            borderRadius: '500px', 
            fontWeight: 'bold', 
            fontSize: '1rem', 
            cursor: carregando ? 'not-allowed' : 'pointer', 
            marginTop: '12px',
            opacity: carregando ? 0.7 : 1
          }}
        >
          {carregando ? 'Processando áudio com IA...' : 'Lançar Faixa'}
        </button>
      </form>
    </div>
  );
}