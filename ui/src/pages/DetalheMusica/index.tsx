import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // 🟢 Adicionado useLocation
import axios from 'axios';

interface Musica {
  _id: string;
  nome: string;
  artista: string;
  genero: string;
  ano?: number;
  descricao?: string;
  feat?: string;
  audioUrl: string;
  albumId?: string;
  capaUrl?: string; 
}

interface Comentario {
  usuario: string;
  nota: number;
  texto: string;
  data: string;
}

interface DetalheMusicaProps {
  setMusicaAtual: (musica: any, listaDeMusicas?: any[]) => void;
}

export default function DetalheMusica({ setMusicaAtual }: DetalheMusicaProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Instanciado para rastrear a origem da navegação
  
  const [musica, setMusica] = useState<Musica | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  
  const [curtido, setCurtido] = useState(false);
  const userId = localStorage.getItem('userId'); 
  const [nota, setNota] = useState(5);
  const [textoComentario, setTextoComentario] = useState('');
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [isHoveredPlay, setIsHoveredPlay] = useState(false);

  // captura de forma dinâmica se o usuário veio da biblioteca ou de outro lugar
  const rotaOrigem = location.state?.deOndeVeio || '/';

  useEffect(() => {
    axios
      .get(`http://localhost:5000/musica/${id}`)
      .then((res) => {
        setMusica(res.data);
        setComentarios([
          { usuario: 'bigode', nota: 5, texto: 'tico', data: '17/06/2026' },
          { usuario: 'max', nota: 4, texto: 'Muito boa essa faixa, o ritmo é contagiante.', data: '17/06/2026' },
          { usuario: 'amaral', nota: 4, texto: 'Muito boa essa faixa, o ritmo é contagiante.', data: '17/06/2026' },
          { usuario: 'japa', nota: 4, texto: 'Muito boa essa faixa, o ritmo é contagiante.', data: '17/06/2026' },
          { usuario: 'bola8', nota: 4, texto: 'Muito boa essa faixa, o ritmo é contagiante.', data: '17/06/2026' },
        ]);
      })
      .catch((err) => {
        console.error(err);
        setErro('Não foi possível carregar os detalhes desta música.');
      });

    if (userId && id) {
      axios.get(`http://localhost:5000/biblioteca/${userId}`)
        .then((res) => {
          const jaCurtiu = res.data.some(
            (item: any) => item.musicaId?._id === id || item.musicaId === id
          );
          setCurtido(jaCurtiu);
        })
        .catch((err) => console.error("Erro ao checar estado da biblioteca:", err));
    }
  }, [id, userId]);

  // dispara a música para o rodapé do App.tsx
  const handlePlayMusica = () => {
    if (!musica) return;
    
    setMusicaAtual({
      ...musica,
      capaUrl: musica.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
    });
  };

  const handleCurtirMusica = () => {
    if (!userId) {
      alert("Selecione um perfil de usuário para curtir músicas.");
      return;
    }

    if (!curtido) {
      // curtir Música (
      axios.post('http://localhost:5000/biblioteca', { userId, musicaId: id })
        .then(() => {
          setCurtido(true);
        })
        .catch(err => {
          console.error("Erro ao favoritar:", err);
          alert("Não foi possível adicionar à biblioteca.");
        });
    } else {
      // Descurtir Música 
      axios.delete(`http://localhost:5000/biblioteca/${userId}/${id}`)
        .then(() => {
          setCurtido(false);
        })
        .catch(err => {
          console.error("Erro ao remover música da biblioteca:", err);
          alert("Erro ao remover do banco de dados. A música continuará salva.");
        });
    }
  };

  const handleEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoComentario.trim()) return;

    const novoComentario: Comentario = {
      usuario: 'Você',
      nota: nota,
      texto: textoComentario,
      data: new Date().toLocaleDateString('pt-BR')
    };

    setComentarios([novoComentario, ...comentarios]);
    setTextoComentario('');
    alert('Comentário publicado!');
  };

  if (erro) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', padding: '32px', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#ff4444' }}>{erro}</p>
        <button onClick={() => navigate(rotaOrigem)} style={{ backgroundColor: '#232323', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '500px', cursor: 'pointer', fontWeight: 'bold' }}>
          Voltar
        </button>
      </div>
    );
  }

  if (!musica) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', padding: '32px', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#b3b3b3' }}>Carregando faixa...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Botão de Voltar */}
      <div style={{ padding: '24px 32px 0 32px' }}>
        <button 
          onClick={() => navigate(rotaOrigem)} 
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '500px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ← Voltar
        </button>
      </div>

      {/* Seção Hero */}
      <section 
        style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '24px', 
          padding: '24px 32px 40px 32px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
          backgroundColor: '#242424' 
        }}
      >
        <div style={{ width: '232px', height: '232px', minWidth: '232px', boxShadow: '0 4px 60px rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
          <img 
            src={musica.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300"} 
            alt={musica.nome} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Música
          </span>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.04em', lineHeight: '1' }}>
            {musica.nome}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <span style={{ color: '#fff' }}>{musica.artista}</span>
            {musica.feat && <span style={{ color: '#b3b3b3', fontWeight: 'normal' }}>(feat. {musica.feat})</span>}
            <span style={{ color: '#b3b3b3' }}>•</span>
            <span style={{ color: '#b3b3b3' }}>{musica.ano || 2026}</span>
            <span style={{ color: '#b3b3b3' }}>•</span>
            <span style={{ backgroundColor: '#2a2a2a', color: '#1ed760', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
              {musica.genero}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '40px', background: 'linear-gradient(rgba(0,0,0,0.6) 0%, #121212 100%)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          
          <button
            onClick={handlePlayMusica}
            onMouseEnter={() => setIsHoveredPlay(true)}
            onMouseLeave={() => setIsHoveredPlay(false)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#1ed760',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.1s ease, background-color 0.1s ease',
              transform: isHoveredPlay ? 'scale(1.04)' : 'scale(1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px', fill: '#000', marginLeft: '4px' }}>
              <path d="M7.05 3.606l13.49 7.77a.75.75 0 010 1.298l-13.49 7.77a.75.75 0 01-1.125-.65V4.256a.75.75 0 011.125-.65z" />
            </svg>
          </button>

          <button 
            onClick={handleCurtirMusica}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              color: curtido ? '#1ed760' : '#b3b3b3',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
            }}
          >
            {curtido ? '💚' : '🤍'}
          </button>
        </div>

        <div style={{ backgroundColor: '#181818', padding: '24px', borderRadius: '8px', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Comentários Públicos</h3>
          
          <form onSubmit={handleEnviarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>Sua avaliação:</label>
              <select 
                value={nota} 
                onChange={(e) => setNota(Number(e.target.value))}
                style={{ backgroundColor: '#2a2a2a', border: 'none', color: '#1ed760', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Adicione um comentário público..." 
                value={textoComentario} 
                onChange={(e) => setTextoComentario(e.target.value)}
                required
                style={{ flexGrow: 1, backgroundColor: '#2a2a2a', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }}
              />
              <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '0 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Comentar
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {comentarios.map((c, index) => (
              <div key={index} style={{ backgroundColor: '#232323', padding: '14px', borderRadius: '4px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>{c.usuario}</span>
                  <span style={{ color: '#1ed760', fontSize: '0.8rem' }}>{'⭐'.repeat(c.nota)}</span>
                </div>
                <p style={{ margin: '0 0 6px 0', color: '#e1e1e1', lineHeight: '1.4' }}>{c.texto}</p>
                <span style={{ fontSize: '0.75rem', color: '#727272' }}>{c.data}</span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}