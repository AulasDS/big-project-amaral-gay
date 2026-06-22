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
      capaUrl: capaUrl || undefined, 
      ano: Number(ano)
    };

    axios.post('http://localhost:5000/album', dadosDoAlbum)
      .then(() => {
        alert("Álbum cadastrado com sucesso no Spotify!");
        navigate('/produtos'); 
      })
      .catch(err => alert("Erro ao salvar: " + err.response?.data?.message || err.message));
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
        
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '32px', 
          textAlign: 'center',
          letterSpacing: '-0.04em'
        }}>
        </h2>
        
        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>Nome do Álbum</label>
            <input 
              type="text" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
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
              placeholder="Insira o nome do álbum" 
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
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>URL da Imagem de Capa</label>
            <input 
              type="url" 
              value={capaUrl} 
              onChange={e => setCapaUrl(e.target.value)} 
              style={{ 
                background: '#121212', 
                border: '1px solid #727272', 
                padding: '14px', 
                borderRadius: '4px', 
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
              placeholder="https://linkdafoto.com/capa.jpg" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>Ano de Lançamento</label>
            <input 
              type="number" 
              value={ano} 
              onChange={e => setAno(e.target.value)} 
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
              placeholder="Insira o ano de lançamento" 
            />
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