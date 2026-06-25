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
  const [gerarLetraAutomatico, setGerarLetraAutomatico] = useState(false);
  
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
    <div style={{ 
      backgroundColor: '#121212', 
      minHeight: '100vh', 
      color: '#fff', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      fontFamily: "'Segoe UI', Roboto, sans-serif", 
      padding: '80px 20px 40px 20px', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        
        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>Título da Música</label>
            <input 
              type="text" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              required 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
              placeholder="Insira o título da música" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>Artista / Banda</label>
            <input 
              type="text" 
              value={artista} 
              onChange={e => setArtista(e.target.value)} 
              required 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
              placeholder="Insira o artista ou banda" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>Gênero Musical</label>
            <input 
              type="text" 
              value={genero} 
              onChange={e => setGenero(e.target.value)} 
              required 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
              placeholder="Ex: Pop, Rock, Lo-Fi, etc." 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>URL da Capa</label>
            <input 
              type="text" 
              value={capaUrl} 
              onChange={e => setCapaUrl(e.target.value)} 
              required 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
              placeholder="https://www.site.com/capa.jpg" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>URL do Arquivo de Áudio (.mp3)</label>
            <input 
              type="text" 
              value={audioUrl} 
              onChange={e => setAudioUrl(e.target.value)} 
              required 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
              placeholder="https://www.site.com/musica.mp3" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>Vincular ao Álbum</label>
            <select 
              value={albumId} 
              onChange={e => setAlbumId(e.target.value)} 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff', 
                cursor: 'pointer',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="" style={{ background: '#121212' }}>Nenhum (Single avulso)</option>
              {albuns.map(album => (
                <option key={album._id} value={album._id} style={{ background: '#121212' }}>{album.nome}</option>
              ))}
            </select>
          </div>

          {/* 100% ADICIONADO: Campo Switch/Checkbox para IA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', backgroundColor: '#181818', padding: '12px', borderRadius: '4px', border: '1px solid #282828' }}>
            <input 
              type="checkbox" 
              id="gerarLetra"
              checked={gerarLetraAutomatico}
              onChange={e => setGerarLetraAutomatico(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#1ed760', cursor: 'pointer' }}
            />
            <label htmlFor="gerarLetra" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff', cursor: 'pointer' }}>
              🤖 Transcrever letra automaticamente com IA
            </label>
          </div>

          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#1ed760', 
              color: '#000', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '500px', 
              fontWeight: 'bold', 
              fontSize: '1rem', 
              cursor: 'pointer', 
              marginTop: '16px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}