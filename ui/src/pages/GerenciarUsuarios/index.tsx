import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  tipo: string; // Ex: 'Ouvinte' ou 'Artista'
}

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const navigate = useNavigate();

  const carregarUsuarios = () => {
    axios.get('http://localhost:5000/usuario') // Altere para a sua rota de usuários da API
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const deletarUsuario = (id: string) => {
    if (window.confirm("Deseja deletar este usuário?")) {
      axios.delete(`http://localhost:5000/usuario/${id}`)
        .then(() => carregarUsuarios())
        .catch(err => alert("Erro ao deletar: " + err.message));
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Gerenciar Usuários</h2>
        <button 
          onClick={() => navigate('/inserir-usuario')}
          style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Novo Usuário
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#282828', color: '#b3b3b3', fontSize: '0.9rem' }}>
            <th style={{ padding: '16px' }}>Nome de Exibição</th>
            <th style={{ padding: '16px' }}>E-mail</th>
            <th style={{ padding: '16px' }}>Tipo de Conta</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario._id} style={{ borderBottom: '1px solid #282828', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#242424'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>{usuario.nome}</td>
              <td style={{ padding: '16px', color: '#b3b3b3' }}>{usuario.email}</td>
              <td style={{ padding: '16px' }}>
                <span style={{ 
                  backgroundColor: usuario.tipo === 'Artista' ? '#1ed760' : '#333', 
                  color: usuario.tipo === 'Artista' ? '#000' : '#fff',
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {usuario.tipo}
                </span>
              </td>
              <td style={{ padding: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => deletarUsuario(usuario._id)}
                  style={{ background: '#e91429', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}