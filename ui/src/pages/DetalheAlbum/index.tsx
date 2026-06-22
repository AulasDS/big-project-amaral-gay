import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // 🟢 Adicionado useLocation
import axios from 'axios';

// Interfaces para validação do TypeScript
interface Musica {
  _id: string;
  nome: string;
  artista: string;
  audioUrl: string;
  duracao?: string;
}

interface Review {
  _id: string;
  userId: string | { _id: string; nome: string };
  usuarioNome?: string;
  comentario: string;
  nota: number;
  createdAt: string;
}

interface Album {
  _id: string;
  nome: string;
  artista: string;
  capaUrl?: string;
  ano: number;
  genero: string;
  musicas?: Musica[];
  reviews?: Review[];
}

interface DetalheAlbumProps {
  setMusicaAtual: (musica: any, listaDeMusicas?: any[]) => void;
}

export default function DetalheAlbum({ setMusicaAtual }: DetalheAlbumProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Instanciado para rastrear a origem da navegação

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [curtido, setCurtido] = useState(false);
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState(5);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  // captura de forma dinâmica se o usuário veio da biblioteca ou de outro lugar
  const rotaOrigem = location.state?.deOndeVeio || '/';

  useEffect(() => {
    axios.get(`http://localhost:5000/album/${id}`)
      .then(res => {
        setAlbum(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar detalhes do álbum:", err);
        setLoading(false);
      });

    if (userId && id) {
      axios.get(`http://localhost:5000/biblioteca/${userId}`)
        .then((res) => {
          const jaCurtiu = res.data.some(
            (item: any) => item.albumId?._id === id || item.albumId === id
          );
          setCurtido(jaCurtiu);
        })
        .catch((err) => console.error("Erro ao checar estado da biblioteca:", err));
    }
  }, [id, userId]);

  const handleCurtirAlbum = () => {
    if (!userId) {
      alert("Selecione um perfil de usuário para curtir álbuns.");
      return;
    }

    if (!curtido) {
      const dadosEnvio = {
        userId,
        albumId: id
      };

      axios.post('http://localhost:5000/biblioteca', dadosEnvio)
        .then(() => {
          setCurtido(true);
        })
        .catch(err => {
          console.error("Erro ao favoritar álbum:", err);
          alert("Não foi possível adicionar este álbum à sua biblioteca.");
        });
    } else {
      axios.delete(`http://localhost:5000/biblioteca/${userId}/${id}`)
        .then(() => {
          setCurtido(false);
        })
        .catch(err => {
          console.error("Erro ao remover álbum da biblioteca:", err);
          alert("Erro ao remover do banco de dados. O item continuará salvo.");
        });
    }
  };

  const tocarAlbumCompleto = () => {
    if (album?.musicas && album.musicas.length > 0) {
      const primeiraFaixa = album.musicas[0];
      setMusicaAtual({
        nome: primeiraFaixa.nome,
        artista: primeiraFaixa.artista || album.artista,
        audioUrl: primeiraFaixa.audioUrl,
        capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400"
      }, album.musicas.map(m => ({
        nome: m.nome,
        artista: m.artista || album.artista,
        audioUrl: m.audioUrl,
        capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400"
      })));
    } else {
      alert("Este álbum ainda não possui músicas cadastradas!");
    }
  };

  const handleEnviarReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !userName) {
      alert("Você precisa selecionar um perfil para comentar!");
      return;
    }

    if (!comentario.trim()) return;

    const novaReview = {
      userId: userId,
      albumId: id,
      comentario: comentario,
      nota: nota
    };

    axios.post('http://localhost:5000/review', novaReview)
      .then(res => {
        setComentario('');
        setNota(5);

        if (album) {
          const reviewComNome = {
            ...res.data.data, // Garante pegar a propriedade correta do retorno do backend
            usuarioNome: userName
          };
          const reviewsAtualizadas = album.reviews ? [...album.reviews, reviewComNome] : [reviewComNome];
          setAlbum({ ...album, reviews: reviewsAtualizadas });
        }
      })
      .catch(err => alert("Erro ao enviar comentário: " + (err.response?.data?.message || err.message)));
  };

  const handleDeletarReview = (reviewId: string) => {
    if (window.confirm("Tem certeza que deseja apagar sua crítica?")) {
      axios.delete(`http://localhost:5000/review/${reviewId}/${userId}`)
        .then(() => {
          alert("Crítica removida!");
          if (album && album.reviews) {
            const filtradas = album.reviews.filter(r => r._id !== reviewId);
            setAlbum({ ...album, reviews: filtradas });
          }
        })
        .catch(err => alert("Erro ao deletar: " + (err.response?.data?.message || err.message)));
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#b3b3b3', padding: '32px', fontFamily: 'sans-serif' }}>
        Carregando álbum...
      </div>
    );
  }

  if (!album) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#e91429', padding: '32px', fontFamily: 'sans-serif' }}>
        Álbum não encontrado.
      </div>
    );
  }

  const extrairNomeUsuario = (rev: Review) => {
    if (rev.usuarioNome) return rev.usuarioNome;
    if (rev.userId && typeof rev.userId === 'object' && 'nome' in rev.userId) {
      return rev.userId.nome;
    }
    return "Usuário Premium";
  };

  return (
    <div
      style={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ padding: '24px 32px 0 32px' }}>
        <button
          onClick={() => navigate(rotaOrigem)} // 🟢 ARRUMADO: Retorna para a origem dinâmica correta
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
            src={album.capaUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300'}
            alt={album.nome}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Álbuns
          </span>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.04em', lineHeight: '1' }}>
            {album.nome}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <span style={{ color: '#fff' }}>{album.artista}</span>
            <span style={{ color: '#b3b3b3' }}>•</span>
            <span style={{ color: '#b3b3b3' }}>{album.ano}</span>
            <span style={{ color: '#b3b3b3' }}>•</span>
            <span style={{ color: '#b3b3b3' }}>{album.musicas?.length || 0} músicas</span>
            <span style={{ color: '#b3b3b3' }}>•</span>
            <span style={{ backgroundColor: '#2a2a2a', color: '#1ed760', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
              {album.genero}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '40px', background: 'linear-gradient(rgba(0,0,0,0.6) 0%, #121212 100%)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={tocarAlbumCompleto}
            style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1ed760', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.5rem', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ▶
          </button>

          <button
            onClick={handleCurtirAlbum}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              color: curtido ? '#1ed760' : '#b3b3b3',
              transition: 'transform 0.2s ease',
              padding: 0,
              lineHeight: '1'
            }}
          >
            {curtido ? '💚' : '🤍'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #282828', padding: '8px 16px', color: '#b3b3b3', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div style={{ width: '5%' }}>#</div>
            <div style={{ width: '60%' }}>Título</div>
            <div style={{ width: '35%', textAlign: 'right' }}>ACTION</div>
          </div>

          {!album.musicas || album.musicas.length === 0 ? (
            <p style={{ color: '#b3b3b3', padding: '24px 16px', fontSize: '0.9rem' }}>Este álbum não tem nenhuma faixa cadastrada ainda.</p>
          ) : (
            album.musicas.map((musica, index) => (
              <div
                key={musica._id}
                onClick={() => {
                  setMusicaAtual({
                    nome: musica.nome,
                    artista: musica.artista || album.artista,
                    audioUrl: musica.audioUrl,
                    capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
                  }, album.musicas?.map(m => ({
                    nome: m.nome,
                    artista: m.artista || album.artista,
                    audioUrl: m.audioUrl,
                    capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
                  })));
                }}
                style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ width: '5%', color: '#b3b3b3', fontSize: '0.9rem' }}>{index + 1}</div>
                <div style={{ width: '60%' }}>
                  <div style={{ color: '#fff', fontWeight: '500', fontSize: '0.95rem' }}>{musica.nome}</div>
                  <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{musica.artista || album.artista}</div>
                </div>
                <div style={{ width: '35%', textAlign: 'right', color: '#1ed760', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Ouvir Faixa ▶
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ backgroundColor: '#181818', padding: '24px', borderRadius: '8px', maxWidth: '700px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Críticas e Avaliações</h3>

          {userId && userName ? (
            <form onSubmit={handleEnviarReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>Sua avaliação como <strong>{userName}</strong>:</label>
                <select
                  value={nota}
                  onChange={e => setNota(Number(e.target.value))}
                  style={{ backgroundColor: '#2a2a2a', border: 'none', color: '#1ed760', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  placeholder="Deixe sua opinião ou resenha pública sobre o álbum..."
                  required
                  style={{ flexGrow: 1, backgroundColor: '#2a2a2a', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                />
                <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '0 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Publicar
                </button>
              </div>
            </form>
          ) : (
            <div style={{ background: '#232323', padding: '16px', borderRadius: '4px', marginBottom: '32px', color: '#b3b3b3', fontSize: '0.9rem' }}>
              ⚠️ <strong>Modo de Leitura:</strong> Selecione um perfil na barra lateral esquerda para poder publicar uma crítica deste álbum.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {!album.reviews || album.reviews.length === 0 ? (
              <p style={{ color: '#b3b3b3', fontSize: '0.9rem', fontStyle: 'italic' }}>Nenhuma avaliação foi deixada por aqui ainda. Seja o primeiro!</p>
            ) : (
              album.reviews.map((rev) => {
                // identifica dinamicamente se a review pertence ao usuário logado
                const donoDaReview = typeof rev.userId === 'object' ? rev.userId?._id : rev.userId;
                const ehDono = donoDaReview === userId;

                return (
                  <div key={rev._id} style={{ backgroundColor: '#232323', padding: '14px', borderRadius: '4px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                      <strong style={{ color: '#1ed760', fontSize: '0.85rem' }}>
                        {extrairNomeUsuario(rev)}
                      </strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#1ed760', fontSize: '0.8rem' }}>{'⭐'.repeat(rev.nota)}</span>
                        
                        {ehDono && (
                          <button 
                            onClick={() => handleDeletarReview(rev._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                            title="Apagar meu comentário"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: '0 0 6px 0', color: '#e1e1e1', lineHeight: '1.4' }}>{rev.comentario}</p>
                    <div style={{ color: '#727272', fontSize: '0.75rem', textTransform: 'lowercase' }}>
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('pt-BR') : 'agora mesmo'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </section>
    </div>
  );
}