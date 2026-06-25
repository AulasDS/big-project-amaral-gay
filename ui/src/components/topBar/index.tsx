import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TopBarProps {
  userLogado: any;
  deslogar: () => void;
  pesquisa: string;
  setPesquisa: (valor: string) => void;
}

export default function TopBar({ userLogado, deslogar, pesquisa, setPesquisa }: TopBarProps) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);


  const [hoverTrocar, setHoverTrocar] = useState(false);
  const [hoverSair, setHoverSair] = useState(false);

  const inicialNome = userLogado?.nome ? userLogado.nome.charAt(0).toUpperCase() : 'U';

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // 🟢 Corrigido: Mudado de justify-content para justifyContent
      padding: '0 24px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* 1. BOTÕES VOLTAR E AVANÇAR */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => navigate(-1)}
          title="Voltar"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#0a0a0a',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
        >
          ‹
        </button>
        <button
          onClick={() => navigate(1)}
          title="Avançar"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#0a0a0a',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
        >
          ›
        </button>
      </div>

      {/* 2. BARRA DE PESQUISA */}
      <div style={{ flex: 1, maxWidth: '364px', margin: '0 16px', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b3b3b3', fontSize: '1.1rem' }}>

        </span>
        <input
          type="text"
          placeholder="O que você quer ouvir?"
          value={pesquisa}
          // 🟢 Remove espaços inúteis do início se o usuário digitar sem querer
          onChange={(e) => {
            const valor = e.target.value;
            // Se o usuário só digitar espaços, limpa. Se não, passa o texto normal
            setPesquisa(valor.trimStart() === '' ? '' : valor);
          }}
          style={{
            width: '100%',
            backgroundColor: '#242424',
            border: 'none',
            borderRadius: '500px',
            padding: '12px 12px 12px 40px',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '500',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 3. FOTO DE PERFIL / MENU DROP-DOWN */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setMenuAberto(!menuAberto)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#282828',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '1rem',
            border: '2px solid transparent',
            transition: 'transform 0.2s'
          }}
          title={userLogado?.nome || "Perfil"}
        >
          {inicialNome}
        </div>

        {menuAberto && (
          <div style={{
            position: 'absolute',
            top: '44px',
            right: 0,
            backgroundColor: '#282828',
            borderRadius: '4px',
            padding: '4px',
            minWidth: '160px',
            boxShadow: '0 16px 24px rgba(0,0,0,0.5)',
            zIndex: 101
          }}>
            <div style={{
              padding: '10px 12px',
              fontSize: '0.85rem',
              color: '#fff',
              borderBottom: '1px solid #3e3e3e',
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {userLogado?.nome}
            </div>

            <button
              onClick={() => {
                setMenuAberto(false);
                navigate('/usuarios');
              }}
              onMouseEnter={() => setHoverTrocar(true)}
              onMouseLeave={() => setHoverTrocar(false)}
              style={{
                width: '100%',
                backgroundColor: hoverTrocar ? '#3e3e3e' : 'transparent',
                border: 'none',
                color: '#eaeaea',
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: '2px',
                transition: 'background-color 0.2s'
              }}
            >
              Trocar de conta
            </button>

            <button
              onClick={() => {
                setMenuAberto(false);
                deslogar();
              }}
              onMouseEnter={() => setHoverSair(true)}
              onMouseLeave={() => setHoverSair(false)}
              style={{
                width: '100%',
                backgroundColor: hoverSair ? '#3e3e3e' : 'transparent',
                border: 'none',
                color: '#eaeaea',
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: '2px',
                transition: 'background-color 0.2s'
              }}
            >
              Sair da conta
            </button>
          </div>
        )}
      </div>

    </header>
  );
}