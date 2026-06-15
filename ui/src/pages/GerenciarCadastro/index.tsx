import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Album {
  _id: string;
  nome: string;
  artista: string;
  ano: number;
}

export default function ListaProdutos() {
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const navigate = useNavigate();

  const carregarAlbuns = () => {
    axios.get('http://localhost:5000/album')
      .then(res => setAlbuns(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    carregarAlbuns();
  }, []);

  const deletarAlbum = (id: string) => {
    if (window.confirm("Deseja mesmo remover este álbum?")) {
      axios.delete(`http://localhost:5000/album/${id}`)
        .then(() => carregarAlbuns())
        .catch(err => alert("Erro ao deletar: " + err.message));
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Gerenciar Álbuns (Músicas)</h2>
        <button 
          onClick={() => navigate('/inserir-produto')}
          style={{ backgroundColor: '#1ed760', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '500px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Adicionar Novo Álbum
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#282828', color: '#b3b3b3', fontSize: '0.9rem' }}>
            <th style={{ padding: '16px' }}>Título do Álbum</th>
            <th style={{ padding: '16px' }}>Artista / Banda</th>
            <th style={{ padding: '16px' }}>Ano de Lançamento</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {albuns.map(album => (
            <tr key={album._id} style={{ borderBottom: '1px solid #282828', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#242424'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>{album.nome}</td>
              <td style={{ padding: '16px', color: '#b3b3b3' }}>{album.artista}</td>
              <td style={{ padding: '16px', color: '#b3b3b3' }}>{album.ano}</td>
              <td style={{ padding: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => navigate(`/editar-produto/${album._id}`)}
                  style={{ background: 'none', border: '1px solid #b3b3b3', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => deletarAlbum(album._id)}
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