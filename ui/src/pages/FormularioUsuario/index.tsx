import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FormularioUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipo, setTipo] = useState('ouvinte');
  
  const navigate = useNavigate();

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosDoUsuario = {
      nome,
      email,
      dataNascimento,
      tipo
    };

    axios.post('http://localhost:5000/usuario', dadosDoUsuario)
      .then(() => {
        alert("Usuário cadastrado com sucesso!");
        navigate('/usuarios'); 
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao criar usuário: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#fff',
      padding: '40px 24px',
      boxSizing: 'border-box'
    }}>

      <div style={{ width: '100%', maxWidth: '324px' }}>
        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.04em' }}>
            Criar Perfil
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Seu Nome de Usuário</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              placeholder="Ex: João Silva"
              style={{ backgroundColor: '#121212', border: '1px solid #727272', borderRadius: '4px', padding: '14px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Seu Gmail de Usuário</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="nome@gmail.com"
              style={{ backgroundColor: '#121212', border: '1px solid #727272', borderRadius: '4px', padding: '14px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
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
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Tipo de Perfil</label>
            <select 
              value={tipo} 
              onChange={e => setTipo(e.target.value)} 
              style={{ 
                backgroundColor: '#121212', 
                border: '1px solid #727272', 
                borderRadius: '4px', 
                padding: '14px', 
                color: '#fff', 
                fontSize: '0.95rem', 
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ouvinte">Ouvinte (Free/Premium)</option>
              <option value="artista">Artista (Criador de Conteúdo)</option>
            </select>
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
            Cadastrar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}