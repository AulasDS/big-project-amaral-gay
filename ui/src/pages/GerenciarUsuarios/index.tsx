import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
}

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const carregarUsuarios = () => {
    setLoading(true);
    axios.get('http://localhost:5000/usuario')
      .then(res => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar usuários:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSelecionarPerfil = (usuario: Usuario) => {
    localStorage.setItem('userId', usuario._id);
    localStorage.setItem('userName', usuario.nome);
    localStorage.setItem('userTipo', (usuario.tipo || 'ouvinte').toLowerCase());
    
    window.location.href = '/'; 
  };

  const handleExcluirUsuario = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // evita disparar a selecao do perfil ao deletar
    
    if (window.confirm("Tem certeza que deseja deletar este perfil de usuário?")) {
      axios.delete(`http://localhost:5000/usuario/${id}`)
        .then(() => {
          carregarUsuarios(); // atualiza a lista na tela

          if (localStorage.getItem('userId') === id) {
            localStorage.clear();
          }
        })
        .catch(err => {
          console.error("Erro ao deletar usuário:", err);
          alert("Erro ao deletar usuário do banco.");
        });
    }
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', // alterado de center para flex-start para subir o conteudo
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      padding: '80px 20px 40px 20px', // adicionado mais espaco apenas no topo para alinhar mais acima
      boxSizing: 'border-box'
    }}>
      
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Quem está ouvindo?
      </h1>
      <p style={{ color: '#a7a7a7', marginBottom: '40px', fontSize: '0.9rem' }}>
        Selecione um perfil para navegar ou gerencie as suas contas abaixo.
      </p>

      {loading ? (
        <p style={{ color: '#1ed760', fontWeight: 'bold' }}>Carregando perfis...</p>
      ) : usuarios.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#a7a7a7', marginBottom: '20px' }}>Nenhum perfil cadastrado.</p>
          <button 
            onClick={() => navigate('/inserir-usuario')}
            style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px 32px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Criar Primeiro Perfil
          </button>
        </div>
      ) : (
        /* grid de cards verticais baseado na imagem do spotify */
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '900px',
          justifyContent: 'center'
        }}>
          {usuarios.map((user) => {
            const isHovered = hoveredId === user._id;
            const inicial = user.nome ? user.nome.charAt(0).toUpperCase() : '?';

            return (
              <div
                key={user._id}
                onClick={() => handleSelecionarPerfil(user)}
                onMouseEnter={() => setHoveredId(user._id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: isHovered ? '#282828' : '#181818',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '180px',
                  height: '260px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.3s ease',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              >
                {/* botao de excluir discreto no canto superior direito do card */}
                <button
                  onClick={(e) => handleExcluirUsuario(e, user._id)}
                  title="Excluir Perfil"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isHovered ? '#a7a7a7' : 'transparent', // so aparece visivel no hover do card
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e91429'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a7a7a7'}
                >
                  ✕
                </button>

                {/* avatar circular centralizado com efeito radial discreto ao fundo */}
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  backgroundColor: '#282828',
                  backgroundImage: isHovered 
                    ? 'radial-gradient(circle, #3e3e3e 0%, #282828 70%)' 
                    : 'radial-gradient(circle, #202020 0%, #181818 70%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: isHovered ? '#1ed760' : '#fff',
                  transition: 'all 0.3s ease',
                  marginTop: '20px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
                }}>
                  {inicial}
                </div>

                {/* container de textos alinhado embaixo e a esquerda */}
                <div style={{
                  marginTop: 'auto',
                  width: '100%',
                  textAlign: 'left',
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user.nome}
                  </h3>
                  
                  <span style={{
                    color: '#b3b3b3',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {user.tipo}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* botao de atalho inferior para adicionar perfil */}
      {!loading && usuarios.length > 0 && (
        <button
          onClick={() => navigate('/inserir-usuario')}
          style={{
            marginTop: '50px',
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid #727272',
            padding: '12px 32px',
            borderRadius: '500px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fff';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#727272';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Criar Novo Perfil
        </button>
      )}

    </div>
  );
}