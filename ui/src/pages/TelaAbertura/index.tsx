import { useState } from 'react';
import axios from 'axios';

interface TelaAberturaProps {
  onLoginSucesso: (usuario: any) => void;
}

export default function TelaAbertura({ onLoginSucesso }: TelaAberturaProps) {
  // Controle de Abas: 'login' (Entrar) ou 'cadastro' (Inscrever-se)
  const [abaAtiva, setAbaAtiva] = useState<'login' | 'cadastro'>('login');

  // Estados dos campos de entrada
  const [nomeLogin, setNomeLogin] = useState(''); // 🟢 Alterado de emailLogin para nomeLogin
  const [nome, setNome] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Auxiliar para realizar o Fake Login e atualizar o app
  const salvarSessaoELogar = (user: any) => {
    const idGerado = user._id || user.id;
    const nomeGerado = user.nome;

    localStorage.setItem('userId', idGerado);
    localStorage.setItem('userName', nomeGerado);
    localStorage.setItem('userTipo', (user.tipo || 'ouvinte').toLowerCase());

    onLoginSucesso({ _id: idGerado, nome: nomeGerado });
    window.location.href = '/';
  };

  // 1. ENTRAR EM PERFIL EXISTENTE VIA NOME DE USUÁRIO (Fake Login / GET)
  const handleLoginExistente = (e: React.FormEvent) => {
    e.preventDefault();

    axios.get('http://localhost:5000/usuario')
      .then(res => {
        const usuarios: any[] = res.data;
        
        // 🟢 Procura EXATAMENTE pelo nome digitado (ignorando espaços vazios e maiúsculas/minúsculas)
        const usuarioEncontrado = usuarios.find(
          u => u.nome?.toLowerCase().trim() === nomeLogin.toLowerCase().trim()
        );

        if (usuarioEncontrado) {
          alert(`Bem-vindo de volta, ${usuarioEncontrado.nome}!`);
          salvarSessaoELogar(usuarioEncontrado);
        } else {
          alert("Nenhum perfil encontrado com este nome de usuário. Que tal se inscrever?");
          setAbaAtiva('cadastro');
          setNome(nomeLogin); // Preenche o nome no cadastro automaticamente para facilitar
        }
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao buscar perfis no servidor.");
      });
  };

  // 2. CRIAR UM NOVO PERFIL (POST)
  const handleCadastrarEEntrar = (e: React.FormEvent) => {
    e.preventDefault();

    const novoUsuario = {
      nome,
      email: emailCadastro,
      dataNascimento
    };

    axios.post('http://localhost:5000/usuario', novoUsuario)
      .then((res) => {
        alert(`Conta criada com sucesso! Bem-vindo, ${nome}.`);
        // 🟢 Repassa o 'data' de dentro do seu controller
        salvarSessaoELogar(res.data.data);
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
      backgroundColor: '#121212',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#fff',
      padding: '24px',
      boxSizing: 'border-box'
    }}>

      {/* Logo do Spotify centralizado */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <svg viewBox="0 0 167.5 167.5" style={{ width: '45px', height: '45px', fill: '#fff' }}>
          <path d="M83.7 0C37.5 0 0 37.5 0 83.7c0 46.3 37.5 83.7 83.7 83.7 46.3 0 83.7-37.5 83.7-83.7C167.5 37.5 130 0 83.7 0zm38.4 120.8c-1.5 2.5-4.8 3.3-7.3 1.8-20.1-12.3-45.4-15.1-75.2-8.3-2.9.7-5.8-1.2-6.5-4.1-.7-2.9 1.2-5.8 4.1-6.5 32.6-7.5 60.6-4.3 83.1 9.5 2.5 1.5 3.3 4.8 1.8 7.6zm10.2-22.8c-1.9 3.1-6 4.1-9.1 2.2-23-14.2-58.1-18.3-85.3-10-3.5 1.1-7.2-1-8.3-4.5-1.1-3.5 1-7.2 4.5-8.3 31.2-9.5 70-4.9 96 11.1 3.1 1.9 4.1 6 2.2 9.5zm.8-23.7C105 57.2 51.7 55.4 20.8 64.8c-4.8 1.5-9.9-1.3-11.4-6.1-1.5-4.8 1.3-9.9 6.1-11.4 35.5-10.8 94.6-8.8 131.7 13.2 4.3 2.6 5.8 8.2 3.2 12.5-2.5 4.3-8.2 5.8-12.5 3.2z" />
        </svg>
      </div>

      <div style={{ width: '100%', maxWidth: '324px' }}>

        {abaAtiva === 'login' ? (
          /* ================= ABRE INTERFACE DE LOGIN ================= */
          <form onSubmit={handleLoginExistente} style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px', letterSpacing: '-0.04em' }}>
              Olá de novo
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Nome de usuário</label>
              <input
                type="text" // 🟢 Corrigido de "email" para "text" para aceitar qualquer caractere livremente
                value={nomeLogin}
                onChange={e => setNomeLogin(e.target.value)}
                required
                placeholder="Insira seu nome de usuário"
                style={{
                  backgroundColor: '#121212',
                  border: '1px solid #727272',
                  borderRadius: '4px',
                  padding: '14px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
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
                marginTop: '12px',
                transition: 'transform 0.1s'
              }}
            >
              Continuar
            </button>

            <div style={{ borderBottom: '1px solid #292929', margin: '32px 0 24px 0' }}></div>

            <p style={{ color: '#b3b3b3', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
              Não tem uma conta?{' '}
              <span
                onClick={() => setAbaAtiva('cadastro')}
                style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Inscrever-se
              </span>
            </p>
          </form>
        ) : (
          /* ================= ABRE INTERFACE DE CADASTRO ================= */
          <form onSubmit={handleCadastrarEEntrar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.04em' }}>
              Inscrever-se
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Seu Nome de Usuário</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Ex: João Silva"
                style={{ backgroundColor: '#121212', border: '1px solid #727272', borderRadius: '4px', padding: '14px', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Seu Gmail de Usuário</label>
              <input
                type="email"
                value={emailCadastro}
                onChange={e => setEmailCadastro(e.target.value)}
                required
                placeholder="nome@gmail.com"
                style={{ backgroundColor: '#121212', border: '1px solid #727272', borderRadius: '4px', padding: '14px', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Data de Nascimento</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={e => {
                  const valor = e.target.value;
                  const partes = valor.split('-');

                  if (partes[0] && partes[0].length > 4) {
                    const anoCortado = partes[0].slice(0, 4);
                    setDataNascimento(`${anoCortado}-${partes[1] || ''}-${partes[2] || ''}`);
                  } else {
                    setDataNascimento(valor);
                  }
                }}
                required
                max="2026-12-31"
                style={{
                  backgroundColor: '#121212',
                  border: '1px solid #727272',
                  borderRadius: '4px',
                  padding: '14px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
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
                marginTop: '12px'
              }}
            >
              Criar Perfil e Entrar
            </button>

            <div style={{ borderBottom: '1px solid #292929', margin: '16px 0' }}></div>

            <p style={{ color: '#b3b3b3', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
              Já tem um perfil?{' '}
              <span
                onClick={() => setAbaAtiva('login')}
                style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Faça login por aqui
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}