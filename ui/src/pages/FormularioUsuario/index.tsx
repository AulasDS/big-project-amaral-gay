import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FormularioUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('Ouvinte');
  
  const navigate = useNavigate();

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosDoUsuario = {
      nome,
      email,
      tipo
    };

    // 💡 CORRIGIDO: Enviando o objeto completo com nome, email e tipo!
    axios.post('http://localhost:5000/usuario', dadosDoUsuario)
      .then(() => {
        alert("Usuário cadastrado com sucesso!");
        navigate('/usuarios'); // Te joga para a lista de gerenciar perfis
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao criar usuário: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Criar Perfil de Usuário</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Nome de Exibição</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: João Silva" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff' }} placeholder="Ex: joao@email.com" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b3b3b3' }}>Tipo de Perfil</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ background: '#333', border: 'none', padding: '12px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            <option value="Ouvinte">Ouvinte (Free/Premium)</option>
            <option value="Artista">Artista (Criador de Conteúdo)</option>
          </select>
        </div>

        <button type="submit" style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '14px', borderRadius: '500px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>
          Cadastrar Perfil
        </button>
      </form>
    </div>
  );
}