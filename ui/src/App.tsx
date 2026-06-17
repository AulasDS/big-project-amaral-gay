import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import FormularioCadastro from './pages/FormularioCadastro';
import GerenciarCadastro from './pages/GerenciarCadastro';
import NavBar from './components/Navbar';
import GerenciarMusicas from './pages/GerenciarMusicas';
import FormularioMusica from './pages/FormularioMusica';
import GerenciarPlaylist from './pages/GerenciarPlaylist';
import FormularioPlaylist from './pages/FormularioPlaylist';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import FormularioUsuario from './pages/FormularioUsuario';
import DetalheAlbum from './pages/DetalheAlbum';
import Biblioteca from './pages/Biblioteca';
import SelectPerfil from './pages/SelectPerfil';
import TelaAbertura from './pages/TelaAbertura'; // 👈 Sua nova página de Boas-Vindas importada!

function App() {
  const [userLogado, setUserLogado] = useState<any>(null);
  const navigate = useNavigate();

  // 🎵 ESTADOS E REFERÊNCIAS DO PLAYER DE ÁUDIO 🎵
  const [musicaAtual, setMusicaAtual] = useState<any>({
    nome: "Freek'n You",
    artista: "Jodeci",
    capaUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0);       
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // =========================================================
  // 🟢 OS SEUS USEEFFECTS FICAM JUNTOS AQUI (ANTES DOS MÉTODOS)
  // =========================================================
  
  // 1. useEffect de Inicialização: Verifica se o usuário já tem perfil salvo ao abrir o app
  useEffect(() => {
    const idSalvo = localStorage.getItem('userId');
    const nomeSalvo = localStorage.getItem('userName');
    if (idSalvo && nomeSalvo) {
      setUserLogado({ _id: idSalvo, nome: nomeSalvo });
    }
  }, []);

  // 2. useEffect do Player: Dispara sempre que a música muda
  useEffect(() => {
    if (musicaAtual.audioUrl && audioRef.current) {
      audioRef.current.load();
      setCurrentTime(0);
      
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          console.log("Autoplay inicial aguardando interação do usuário.");
        });
    }
  }, [musicaAtual]);

  // =========================================================
  // 🛠️ MÉTODOS E FUNÇÕES AUXILIARES
  // =========================================================
  
  const togglePlay = () => {
    if (!musicaAtual.audioUrl) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Erro ao tocar:", err));
    }
  };

  const deslogar = () => {
    localStorage.clear();
    setUserLogado(null);
    navigate('/select-perfil');
  };

  const formatarTempo = (segundos: number) => {
    if (isNaN(segundos)) return "0:00";
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // =========================================================
  // 🎨 RETORNO VISUAL DO APLICATIVO
  // =========================================================
  return (
    <div className="spotify-layout" style={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh', 
      color: '#ffffff',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      
      {/* 🔒 BLOQUEIO DA TELA: Se o usuário não estiver logado, a TelaAbertura renderiza fixa por cima de tudo */}
      {!userLogado && (
        <TelaAbertura onLoginSucesso={(usuario) => setUserLogado(usuario)} />
      )}
      
      {/* 💾 Tag HTML5 de Áudio Conectada aos Eventos de Tempo Reais */}
      <audio 
        ref={audioRef} 
        src={musicaAtual.audioUrl} 
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }} 
      />
      
      {/* 🧭 SIDEBAR ESQUERDA (Navegação + Perfil) */}
      <aside className="sidebar-left" style={{
        backgroundColor: '#000000',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderRight: '1px solid #1c1c1c'
      }}>
        <NavBar />
        
        {/* Painel do Usuário Ativo Premium */}
        <div style={{ 
          marginTop: 'auto', 
          padding: '16px', 
          background: '#121212', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          border: '1px solid #282828'
        }}>
          {userLogado ? (
            <>
              <p style={{ fontSize: '0.75rem', color: '#b3b3b3', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ouvindo como</p>
              <h4 style={{ color: '#1ed760', margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>{userLogado.nome}</h4>
              <button 
                onClick={deslogar} 
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #e91429', 
                  color: '#e91429', 
                  padding: '6px 16px', 
                  borderRadius: '500px', 
                  cursor: 'pointer', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s ease, background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(233, 20, 41, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Trocar Perfil
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/select-perfil')} 
              style={{ 
                background: '#1ed760', 
                color: '#000', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '500px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Selecionar Perfil
            </button>
          )}
        </div>
      </aside>

      {/* 🎵 CONTEÚDO PRINCIPAL (As Telas do App) */}
      <main className="main-content" style={{ 
        backgroundColor: '#121212', 
        padding: '32px',
        overflowY: 'auto'
      }}>
        <Routes>
          <Route path='/' element={<Home setMusicaAtual={setMusicaAtual} />} />
          <Route path='/select-perfil' element={<SelectPerfil onSelect={(u: any) => setUserLogado(u)} />} />
          <Route path='/album/:id' element={<DetalheAlbum setMusicaAtual={setMusicaAtual} />} />
          <Route path='/sua-biblioteca' element={<Biblioteca />} />
          
          <Route path='/albuns' element={<GerenciarCadastro />} />
          <Route path='/inserir-album' element={<FormularioCadastro />} />
          <Route path='/musicas' element={<GerenciarMusicas setMusicaAtual={setMusicaAtual} />} />
          <Route path='/inserir-musica' element={<FormularioMusica />} />
          <Route path='/playlists' element={<GerenciarPlaylist />} />
          <Route path='/inserir-playlist' element={<FormularioPlaylist />} />
          <Route path='/usuarios' element={<GerenciarUsuarios />} />
          <Route path='/inserir-usuario' element={<FormularioUsuario />} />
        </Routes>
      </main>

      {/* 💿 SIDEBAR DIREITA (Painel Tocando Agora Dinâmico) */}
      <aside className="sidebar-right" style={{
        backgroundColor: '#000000',
        padding: '24px 16px',
        borderLeft: '1px solid #1c1c1c',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>Tocando agora</h3>
        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
          <img className="now-playing-visual" src={musicaAtual.capaUrl} alt="Foto do Artista" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ marginTop: '4px' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700 }}>{musicaAtual.nome}</h4>
          <p style={{ color: '#b3b3b3', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>{musicaAtual.artista}</p>
        </div>
      </aside>

      {/* 🎛️ CONTROLES DO PLAYER (Barra Inferior Dinâmica Conectada) */}
      <footer className="player-bar" style={{
        backgroundColor: '#181818',
        borderTop: '1px solid #282828',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}>
        {/* Info da Faixa */}
        <div className="track-info" style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '30%' }}>
          <img src={musicaAtual.capaUrl} alt="Capa" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
          <div style={{ overflow: 'hidden' }}>
            <h5 style={{ margin: '0 0 2px 0', fontSize: '0.875rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{musicaAtual.nome}</h5>
            <p style={{ margin: 0, color: '#b3b3b3', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{musicaAtual.artista}</p>
          </div>
        </div>

        {/* Controles Globais do Player */}
        <div className="player-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '40%' }}>
          <div className="buttons" style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '1.1rem', color: '#b3b3b3' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>⏮</span>
            
            <div 
              onClick={togglePlay}
              className="play-btn" 
              style={{ background: '#fff', color: '#000', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.1s' }} 
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'} 
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying ? '⏸' : '▶'}
            </div>
            
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>⏭</span>
          </div>
          
          {/* PROGRESSO TOTALMENTE DINÂMICO E CALCADO NO ARQUIVO MP3 */}
          <div className="playback-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontSize: '0.75rem', color: '#b3b3b3' }}>
            <span>{formatarTempo(currentTime)}</span>
            <div className="progress-bar" style={{ flex: 1, height: '4px', background: '#4f4f4f', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}>
              <div className="progress" style={{ 
                width: `${duration ? (currentTime / duration) * 100 : 0}%`, 
                height: '100%', 
                background: '#1db954', 
                borderRadius: '2px' 
              }}></div>
            </div>
            <span>{formatarTempo(duration)}</span>
          </div>
        </div>

        {/* Volume Ativo Conectado */}
        <div className="volume-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '30%', justifyContent: 'flex-end', color: '#b3b3b3' }}>
          <span style={{ fontSize: '1rem' }}>🔊</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            defaultValue="0.7"
            onChange={(e) => { if(audioRef.current) audioRef.current.volume = Number(e.target.value) }}
            style={{ 
              accentColor: '#1db954', 
              cursor: 'pointer',
              width: '80px',
              height: '4px'
            }} 
          />
        </div>
      </footer>

    </div>
  );
}

export default App;