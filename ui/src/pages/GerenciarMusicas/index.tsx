import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Musica {
  _id: string;
  titulo: string;
  artista: string;
  duracao: string;
}

export default function GerenciarMusicas() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const navigate = useNavigate();

  const carregarMusicas = () => {
    axios.get('http://localhost:5000/musica') // Altere para a sua rota de músicas da API
      .then(res => setMusicas(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    carregarMusicas();
  }, []);

  const deletarMusica = (id: string) => {
    if (window.confirm("Deseja remover esta música?")) {
      axios.delete(`http://localhost:5000/musica/${id}`)
        .then(() => carregarMusicas())
        .catch(err => alert("Erro ao deletar: " + err.message));
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Gerenciar Músicas (Faixas)</h2>
        <button 
          onClick={() => navigate('/inserir-musica')}
          style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Adicionar Nova Música
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#282828', color: '#b3b3b3', fontSize: '0.9rem' }}>
            <th style={{ padding: '16px' }}># Título</th>
            <th style={{ padding: '16px' }}>Artista</th>
            <th style={{ padding: '16px' }}>Duração</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {musicas.map((musica, index) => (
            <tr key={musica._id} style={{ borderBottom: '1px solid #282828', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#242424'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>
                <span style={{ color: '#b3b3b3', marginRight: '12px', fontWeight: 'normal' }}>{index + 1}</span>
                {musica.titulo}
              </td>
              <td style={{ padding: '16px', color: '#b3b3b3' }}>{musica.artista}</td>
              <td style={{ padding: '16px', color: '#b3b3b3' }}>{musica.duracao}</td>
              <td style={{ padding: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => deletarMusica(musica._id)}
                  style={{ background: '#e91429', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}