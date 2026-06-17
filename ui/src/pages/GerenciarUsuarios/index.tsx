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

  // 1. BUSCAR USUÁRIOS DO BACKEND (GET)
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

  // 2. SELECIONAR PERFIL (Regra 3 - Define o usuário ativo no App)
  const handleSelecionarPerfil = (usuario: Usuario) => {
    localStorage.setItem('userId', usuario._id);
    localStorage.setItem('userName', usuario.nome);
    alert(`Perfil alterado para: ${usuario.nome}`);
    
    // Força a página a recarregar ou joga para a Home com o login atualizado
    window.location.href = '/'; 
  };

  // 3. EXCLUIR PERFIL (DELETE)
  const handleExcluirUsuario = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evita que clique no botão acione a seleção do perfil
    
    if (window.confirm("Tem certeza que deseja deletar este perfil de usuário?")) {
      axios.delete(`http://localhost:5000/usuario/${id}`)
        .then(() => {
          alert("Perfil deletado com sucesso!");
          carregarUsuarios(); // Atualiza a lista na tela

          // Se o usuário deletado for o que estava logado, limpa o login
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
      minHeight: '80vh',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      padding: '20px'
    }}>
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.04em' }}>
        Quem está ouvindo?
      </h1>
      <p style={{ color: '#b3b3b3', marginBottom: '40px', fontSize: '1rem' }}>
        Selecione um perfil para navegar ou gerencie as suas contas abaixo.
      </p>

      {loading ? (
        <p style={{ color: '#1ed760', fontWeight: 'bold' }}>Carregando perfis...</p>
      ) : usuarios.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#b3b3b3', marginBottom: '20px' }}>Nenhum perfil cadastrado.</p>
          <button 
            onClick={() => navigate('/inserir-usuario')}
            style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Criar Primeiro Perfil
          </button>
        </div>
      ) : (
        /* Grid de Perfis Estilo Netflix/Spotify */
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '800px'
        }}>
          {usuarios.map((user) => {
            const isHovered = hoveredId === user._id;
            // Pega a primeira letra do nome para o avatar personalizado
            const inicial = user.nome ? user.nome.charAt(0).toUpperCase() : '?';

            return (
              <div
                key={user._id}
                onClick={() => handleSelecionarPerfil(user)}
                onMouseEnter={() => setHoveredId(user._id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: '140px',
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                {/* Avatar Circular */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: isHovered ? '#282828' : '#181818',
                  border: isHovered ? '3px solid #1ed760' : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: isHovered ? '#1ed760' : '#fff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  {inicial}

                  {/* Badge de Tipo (Artista / Ouvinte) */}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: user.tipo === 'Artista' ? '#1db954' : '#333',
                    color: user.tipo === 'Artista' ? '#000' : '#fff',
                    fontSize: '0.65rem',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                  }}>
                    {user.tipo}
                  </span>
                </div>

                {/* Nome do Usuário */}
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: isHovered ? '#1ed760' : '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}>
                  {user.nome}
                </h3>

                {/* E-mail Secundário */}
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '0.75rem',
                  color: '#b3b3b3',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}>
                  {user.email}
                </p>

                {/* Botão de Deletar Discreto */}
                <button
                  onClick={(e) => handleExcluirUsuario(e, user._id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
                    color: '#b3b3b3',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    opacity: isHovered ? 1 : 0.4, // Só acende bem quando o mouse está no card
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#e91429';
                    e.currentTarget.style.color = '#e91429';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#555';
                    e.currentTarget.style.color = '#b3b3b3';
                  }}
                >
                  Excluir Perfil
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Botão Inferior de Atalho para Adicionar Novo Perfil */}
      {!loading && usuarios.length > 0 && (
        <button
          onClick={() => navigate('/inserir-usuario')}
          style={{
            marginTop: '48px',
            backgroundColor: 'transparent',
            color: '#b3b3b3',
            border: '1px solid #b3b3b3',
            padding: '10px 24px',
            borderRadius: '500px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fff';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#b3b3b3';
            e.currentTarget.style.color = '#b3b3b3';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Criar Novo Perfil
        </button>
      )}

    </div>
  );
}