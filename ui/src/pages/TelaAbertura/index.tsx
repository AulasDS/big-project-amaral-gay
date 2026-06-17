import { useState } from 'react';
import axios from 'axios';

interface TelaAberturaProps {
  onLoginSucesso: (usuario: any) => void;
}

export default function TelaAbertura({ onLoginSucesso }: TelaAberturaProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleCadastrarEEntrar = (e: React.FormEvent) => {
    e.preventDefault();

    const novoUsuario = {
      nome,
      email,
      dataNascimento
    };

    axios.post('http://localhost:5000/usuario', novoUsuario)
      .then((res) => {
        alert(`Bem-vindo, ${nome}! Perfil criado com sucesso.`);
        
        // 🕵️‍♂️ Garante a captura do ID vindo do Back-end
        const idGerado = res.data?._id || res.data?.id || "id-temporario-" + Date.now();
        const nomeGerado = res.data?.nome || nome;

        // 1. Salva os dados no localStorage para o navegador lembrar da sessão
        localStorage.setItem('userId', idGerado);
        localStorage.setItem('userName', nomeGerado);
        
        // 2. Atualiza o estado local do React
        onLoginSucesso({ _id: idGerado, nome: nomeGerado });

        // 🚀 O SEGREDO DO SUCESSO: Força o recarregamento na rota inicial.
        // Isso faz o App.tsx acordar lendo o localStorage e destravando a tela na hora!
        window.location.href = '/';
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
      zIndex: 9999, // Garante que vai cobrir o app por baixo
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#fff'
    }}>
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
          
          {/* Campo de Nome */}
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

          {/* Campo de Email */}
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

          {/* Campo de Data de Nascimento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Data de Nascimento</label>
            <input 
              type="date" 
              value={dataNascimento} 
              onChange={e => setDataNascimento(e.target.value)} 
              required 
              style={{ 
                background: '#333', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '4px', 
                color: '#fff',
                fontFamily: 'inherit'
              }} 
            />
          </div>

          <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px', borderRadius: '500px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px', transition: 'transform 0.1s' }}>
            Criar Perfil e Ouvir Agora
          </button>
        </form>
      </div>
    </div>
  );
}