import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SelectPerfil({ onSelect }: { onSelect: (u: any) => void }) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/usuario')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  }, []);

  const logarComo = (user: any) => {
    localStorage.setItem('userId', user._id);
    localStorage.setItem('userName', user.nome);
    // 🟢 ÚNICA ALTERAÇÃO: Salva o tipo em minúsculo para a Navbar identificar
    localStorage.setItem('userTipo', (user.tipo || 'ouvinte').toLowerCase());
    onSelect(user);
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Quem está ouvindo?</h1>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {usuarios.map(user => (
          <div 
            key={user._id} 
            onClick={() => logarComo(user)}
            style={{ cursor: 'pointer', padding: '20px', background: '#1a1a1a', borderRadius: '8px', width: '150px', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#282828', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              👤
            </div>
            <h4 style={{ color: '#fff' }}>{user.nome}</h4>
            <span style={{ fontSize: '0.75rem', color: '#1ed760' }}>{user.tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}