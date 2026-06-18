import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  userId: string;       // 🟢 Atualizado para bater com seu Schema
  usuarioNome?: string;  // Usado para exibir o nome no Front-end
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
  musicas?: Musica[]; // Lista de músicas que pertencem a este álbum
  reviews?: Review[]; // Lista de comentários/avaliações do álbum
}

interface DetalheAlbumProps {
  setMusicaAtual: (musica: any) => void;
}

export default function DetalheAlbum({ setMusicaAtual }: DetalheAlbumProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estados principais da página
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para o formulário de novos comentários
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState(5);
  
  // Captura as informações do usuário que selecionou o perfil na sidebar
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    // Busca os dados do álbum específico e suas músicas/reviews atreladas
    axios.get(`http://localhost:5000/album/${id}`)
      .then(res => {
        setAlbum(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar detalhes do álbum:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ color: '#b3b3b3', padding: '32px' }}>Carregando álbum...</div>;
  }

  if (!album) {
    return <div style={{ color: '#e91429', padding: '32px' }}>Álbum não encontrado.</div>;
  }

  // Função para tocar o álbum inteiro a partir da primeira faixa
  const tocarAlbumCompleto = () => {
    if (album.musicas && album.musicas.length > 0) {
      const primeiraFaixa = album.musicas[0];
      setMusicaAtual({
        nome: primeiraFaixa.nome,
        artista: primeiraFaixa.artista || album.artista,
        audioUrl: primeiraFaixa.audioUrl,
        capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
      });
    } else {
      alert("Este álbum ainda não possui músicas cadastradas!");
    }
  };

  // Função para enviar o comentário/crítica para o backend
  const handleEnviarReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !userName) {
      alert("Você precisa selecionar um perfil para comentar!");
      return;
    }

    if (!comentario.trim()) return;

    // 🟢 Objeto alterado para bater 100% com o mongoose.Schema da sua Review
    const novaReview = {
      userId: userId,     
      albumId: id,        
      comentario: comentario,
      nota: nota
    };

    // Envia a avaliação para a rota correspondente no backend
    axios.post('http://localhost:5000/review', novaReview)
      .then(res => {
        alert("Crítica enviada com sucesso!");
        setComentario('');
        setNota(5);
        
        if (album) {
          // Injeta temporariamente o nome do usuário ativo na resposta para renderizar na tela na hora
          const reviewComNome = {
            ...res.data,
            usuarioNome: userName
          };

          const reviewsAtualizadas = album.reviews ? [...album.reviews, reviewComNome] : [reviewComNome];
          setAlbum({ ...album, reviews: reviewsAtualizadas });
        }
      })
      .catch(err => alert("Erro ao enviar comentário: " + (err.response?.data?.message || err.message)));
  };

  return (
    <div style={{ padding: '0 0 32px 0', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 🔙 Botão Voltar */}
      <button 
        onClick={() => navigate('/')}
        style={{ background: 'transparent', border: 'none', color: '#b3b3b3', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ⬅ Voltar para o Início
      </button>

      {/* 🏞️ Banner Superior do Álbum (Estilo Spotify Hero) */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '32px' }}>
        <img 
          src={album.capaUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300'} 
          alt={album.nome} 
          style={{ width: '232px', height: '232px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        />
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#fff' }}>ÁLBUM</span>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '8px 0', color: '#fff', letterSpacing: '-0.04em', lineHeight: '1' }}>{album.nome}</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
            {album.artista} • <span style={{ color: '#b3b3b3', fontWeight: '400' }}>{album.ano} • {album.musicas?.length || 0} músicas</span> • <span style={{ color: '#1ed760', fontWeight: 'bold' }}>Gênero: {album.genero}</span>
          </p>
        </div>
      </div>

      {/* 🟢 Barra de Ações (Botão Play Gigante) */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '24px 0', marginBottom: '20px' }}>
        <button 
          onClick={tocarAlbumCompleto}
          style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1ed760', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.5rem', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ▶
        </button>
      </div>

      {/* 📊 Tabela de Músicas */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Cabeçalho da Tabela */}
        <div style={{ display: 'flex', borderBottom: '1px solid #282828', padding: '8px 16px', color: '#b3b3b3', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div style={{ width: '5%' }}>#</div>
          <div style={{ width: '60%' }}>Título</div>
          <div style={{ width: '35%', textAlign: 'right' }}>Ação</div>
        </div>

        {/* Lista de Faixas reais vindas do Back */}
        {!album.musicas || album.musicas.length === 0 ? (
          <p style={{ color: '#b3b3b3', padding: '24px 16px', fontSize: '0.9rem' }}>Este álbum não tem nenhuma faixa cadastrada ainda.</p>
        ) : (
          album.musicas.map((musica, index) => (
            <div 
              key={musica._id}
              onClick={() => setMusicaAtual({
                nome: musica.nome,
                artista: musica.artista || album.artista,
                audioUrl: musica.audioUrl,
                capaUrl: album.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"
              })}
              style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Número da faixa */}
              <div style={{ width: '5%', color: '#b3b3b3', fontSize: '0.9rem' }}>{index + 1}</div>
              
              {/* Info da Música */}
              <div style={{ width: '60%' }}>
                <div style={{ color: '#fff', fontWeight: '500', fontSize: '0.95rem' }}>{musica.nome}</div>
                <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{musica.artista || album.artista}</div>
              </div>

              {/* Botão rápido para dar Play individual */}
              <div style={{ width: '35%', textAlign: 'right', color: '#1ed760', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Ouvir Faixa ▶
              </div>
            </div>
          ))
        )}
      </div>

      {/* 💬 SEÇÃO DE AVALIAÇÕES E COMENTÁRIOS */}
      <div style={{ marginTop: '48px', borderTop: '1px solid #282828', paddingTop: '32px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '24px', fontWeight: 'bold' }}>Críticas e Avaliações</h2>

        {/* Formulário de Envio (Só aparece se houver usuário selecionado no localStorage) */}
        {userId && userName ? (
          <form onSubmit={handleEnviarReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', maxWidth: '600px' }}>
            <label style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Deixe sua opinião sobre o álbum como <strong>{userName}</strong>:</label>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Sua Nota:</span>
              <select 
                value={nota} 
                onChange={e => setNota(Number(e.target.value))} 
                style={{ background: '#282828', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {'⭐'.repeat(n)}</option>)}
              </select>
            </div>

            <textarea 
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="O que você achou deste álbum? Escreva sua resenha ou opinião aqui..."
              required
              style={{ background: '#282828', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', minHeight: '90px', fontFamily: 'sans-serif', resize: 'vertical', fontSize: '0.9rem' }}
            />
            
            <button 
              type="submit" 
              style={{ background: '#1ed760', color: '#000', border: 'none', fontWeight: 'bold', padding: '12px 24px', borderRadius: '500px', cursor: 'pointer', alignSelf: 'flex-end', fontSize: '0.9rem', transition: 'transform 0.1s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Publicar Avaliação
            </button>
          </form>
        ) : (
          <div style={{ background: '#181818', border: '1px solid #282828', padding: '16px', borderRadius: '8px', marginBottom: '32px', maxWidth: '600px', color: '#b3b3b3', fontSize: '0.9rem' }}>
            ⚠️ <strong>Modo de Leitura:</strong> Selecione ou cadastre um perfil na barra lateral esquerda para poder digitar uma crítica e dar notas para este álbum.
          </div>
        )}

        {/* Lista de Comentários Renderizados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
          {!album.reviews || album.reviews.length === 0 ? (
            <p style={{ color: '#b3b3b3', fontSize: '0.9rem', fontStyle: 'italic' }}>Nenhuma avaliação foi deixada por aqui ainda. Seja o primeiro a opinar!</p>
          ) : (
            album.reviews.map((rev) => (
              <div key={rev._id} style={{ background: '#121212', border: '1px solid #282828', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  {/* Se o backend fizer .populate('userId'), usamos rev.userId.nome. Caso contrário, exibe o fallback temporário do Front */}
                  <strong style={{ color: '#1ed760', fontSize: '0.95rem' }}>
                    {rev.usuarioNome || (rev.userId as any).nome || "Usuário Premium"}
                  </strong>
                  <span style={{ fontSize: '0.85rem' }}>{'⭐'.repeat(rev.nota)}</span>
                </div>
                <p style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{rev.comentario}</p>
                <div style={{ color: '#535353', fontSize: '0.75rem', textAlign: 'right' }}>
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('pt-BR') : 'Agora mesmo'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}