import { useState, useEffect } from 'react';
import axios from 'axios';

interface TelaAberturaProps {
  onLoginSucesso: (usuario: any) => void;
}

export default function TelaAbertura({ onLoginSucesso }: TelaAberturaProps) {
  // 🟢 Estados para a listagem e seleção de perfis salvos
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Estados para o formulário de cadastro de novo perfil
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // 🟢 BUSCA OS PERFIS EXISTENTES NO BANCO (Requisito Técnico: GET)
  useEffect(() => {
    axios.get('http://localhost:5000/usuario')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Erro ao carregar usuários salvos:", err));
  }, []);

  // 🟢 REALIZA O FAKE LOGIN (Garda os IDs no localStorage e ativa no React)
  const realizarFakeLogin = (user: any) => {
    const idGerado = user._id || user.id;
    const nomeGerado = user.nome;

    localStorage.setItem('userId', idGerado);
    localStorage.setItem('userName', nomeGerado);
    
    onLoginSucesso({ _id: idGerado, nome: nomeGerado });
    window.location.href = '/';
  };

  const handleCadastrarEEntrar = (e: React.FormEvent) => {
    e.preventDefault();

    const novoUsuario = { nome, email, dataNascimento };

    axios.post('http://localhost:5000/usuario', novoUsuario)
      .then((res) => {
        alert(`Bem-vindo, ${nome}! Perfil criado com sucesso.`);
        realizarFakeLogin(res.data);
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao criar perfil: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      
      {/* SELEÇÃO DE PERFIL ESTILO NETFLIX / SPOTIFY ("Quem está ouvindo?") */}
      {!exibirFormulario ? (
        <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Quem está ouvindo?</h1>
          <p style={{ color: '#b3b3b3', fontSize: '1rem', marginBottom: '40px' }}>Selecione um perfil salvo para carregar suas preferências.</p>
          
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            {usuarios.map((user) => {
              const isHovered = hoveredId === user._id;
              return (
                <div 
                  key={user._id} 
                  onClick={() => realizarFakeLogin(user)}
                  onMouseEnter={() => setHoveredId(user._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ 
                    cursor: 'pointer', 
                    textAlign: 'center',
                    width: '130px',
                  }}
                >
                  {/* Avatar Circular Dinâmico */}
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    backgroundColor: isHovered ? '#282828' : '#181818', 
                    margin: '0 auto 16px auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '3rem',
                    border: isHovered ? '2px solid #1ed760' : '2px solid #282828',
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                  }}>
                    👤
                  </div>
                  <h4 style={{ 
                    color: isHovered ? '#1ed760' : '#fff', 
                    margin: 0, 
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{user.nome}</h4>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => setExibirFormulario(true)}
            style={{
              background: 'transparent',
              border: '1px solid #727272',
              color: '#727272',
              padding: '10px 24px',
              borderRadius: '500px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#727272'; e.currentTarget.style.color = '#727272'; }}
          >
            Adicionar Novo Perfil
          </button>
        </div>
      ) : (
        /* FORMULÁRIO DE CADASTRO (CASO QUEIRA CRIAR PERFIL NOVO) */
        <div style={{ 
          backgroundColor: '#121212', 
          padding: '40px', 
          borderRadius: '12px', 
          width: '100%', 
          maxWidth: '400px', 
          border: '1px solid #282828', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.8)' 
        }}>
          <h1 style={{ color: '#1ed760', fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>Spotify</h1>
          <p style={{ color: '#b3b3b3', textAlign: 'center', fontSize: '0.95rem', marginBottom: '32px' }}>Crie seu perfil de ouvinte para entrar</p>

          <form onSubmit={handleCadastrarEEntrar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Seu Nome de Usuário</label>
              <input 
                type="text" 
                value={nome} 
                onChange={e => setNome(e.target.value)} 
                required 
                style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} 
                placeholder="Ex: João Silva" 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Seu Gmail de Usuário</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} 
                placeholder="Ex: joao@gmail.com" 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Data de Nascimento</label>
              <input 
                type="date" 
                value={dataNascimento} 
                onChange={e => setDataNascimento(e.target.value)} 
                required 
                style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff', fontFamily: 'inherit' }} 
              />
            </div>

            <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px', borderRadius: '500px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>
              Criar Perfil e Ouvir Agora
            </button>

            <button 
              type="button" 
              onClick={() => setExibirFormulario(false)}
              style={{ background: 'transparent', border: 'none', color: '#b3b3b3', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}
            >
              Voltar para Seleção de Perfis
            </button>
          </form>
        </div>
      )}
    </div>
  );
}