import { useEffect, useState } from 'react';
import axios from 'axios'; // Se não usar axios, pode usar fetch

interface Album {
  _id: string;
  nome: string;
  artista: string;
  capaUrl: string;
  ano: number;
}

export default function Home() {
  const [albuns, setAlbuns] = useState<Album[]>([]);

  // Busca os álbuns reais salvos no seu banco de dados através da API
  useEffect(() => {
    axios.get('http://localhost:5000/album') // Ajuste a porta da sua API se necessário
      .then(response => setAlbuns(response.data))
      .catch(err => console.error("Erro ao buscar álbuns", err));


      
  }, []);
  

  return (
    <>
      {/* Banner Principal de Destaque */}
      <div className="hero-banner">
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Álbum</span>
          <h2 style={{ fontSize: '3rem', margin: '8px 0' }}></h2>
          <p style={{ color: '#b3b3b3' }}>Novo single do Donathan!</p>
          <button style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '12px 32px', borderRadius: '500px', fontWeight: 'bold', marginTop: '24px', cursor: 'pointer' }}>
            Ouça agora
          </button>
        </div>
      </div>

      {/* Seção 2: Grid Rápido de "Boa noite" */}
      <h3 style={{ margin: '32px 0 16px 0', fontSize: '1.8rem', fontWeight: '700' }}>Boa noite</h3>
      <div className="quick-grid">
        <div className="quick-card">
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&q=80" alt="Mix" />
          <span style={{ fontWeight: 'bold', paddingRight: '16px' }}>As mais tocadas</span>
        </div>
        <div className="quick-card">
          <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80" alt="DJ" />
          <span style={{ fontWeight: 'bold', paddingRight: '16px' }}>MAX </span>
        </div>
        <div className="quick-card">
          <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" alt="Sertanejo" />
          <span style={{ fontWeight: 'bold', paddingRight: '16px' }}>JAPONES ANOS 2000</span>
        </div>
      </div>

      {/* Seção 3: Seus Álbuns Vindos do Banco de Dados */}
      <h3 style={{ margin: '40px 0 16px 0', fontSize: '1.5rem', fontWeight: '700' }}>Seus Álbuns cadastrados</h3>
      <div className="section-grid">
        {albuns.length === 0 ? (
          // Cards falsos caso seu banco esteja vazio no início
          <>
            <div className="music-card">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Capa" />
              <h4>Radar de Novidades</h4>
              <p>Os principais lançamentos da semana</p>
            </div>
            <div className="music-card">
              <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" alt="Capa" />
              <h4>Eletrônica Roots</h4>
              <p>O melhor do house underground</p>
            </div>
          </>
        ) : (
          // Renderiza os álbuns que você cadastrou pelo painel admin
          albuns.map(album => (
            <div className="music-card" key={album._id}>
              <img src={album.capaUrl || "https://via.placeholder.com/180"} alt={album.nome} />
              <h4>{album.nome}</h4>
              <p>{album.artista} • {album.ano}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
