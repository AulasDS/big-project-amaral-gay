import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import FormularioCadastro from './pages/FormularioCadastro';
import GerenciarCadastro from './pages/GerenciarCadastro';
import NavBar from './components/navBar';
import TopBar from './components/topBar';
import GerenciarMusicas from './pages/GerenciarMusicas';
import FormularioMusica from './pages/FormularioMusica';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import FormularioUsuario from './pages/FormularioUsuario';
import DetalheAlbum from './pages/DetalheAlbum';
import Biblioteca from './pages/Biblioteca';
import TelaAbertura from './pages/TelaAbertura';
import DetalheMusica from './pages/DetalheMusica';

function App() {
  const [userLogado, setUserLogado] = useState<any>(null);
  const [carregandoToken, setCarregandoToken] = useState(true);
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = useState('');
  const [musicaAtual, setMusicaAtual] = useState<any>(null);
  const [filaMusicas, setFilaMusicas] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  useEffect(() => {
    const idSalvo = localStorage.getItem('userId');
    const nomeSalvo = localStorage.getItem('userName');
    const tipoSalvo = localStorage.getItem('userTipo');

    if (idSalvo && nomeSalvo) {
      setUserLogado({ _id: idSalvo, nome: nomeSalvo, tipo: tipoSalvo || 'ouvinte' });
    }
    setCarregandoToken(false);
  }, []);

  // 🟢 CORREÇÃO 1: Adicionado o playbackRate nas dependências para não resetar nas trocas de faixa
  useEffect(() => {
    if (musicaAtual?.audioUrl && audioRef.current) {
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(true);
      audioRef.current.playbackRate = playbackRate; // Fixa a velocidade na nova música

      audioRef.current.play()
        .catch((err) => {
          setIsPlaying(false);
          console.log("Autoplay aguardando interação do usuário:", err);
        });
    }
  }, [musicaAtual, playbackRate]);

  const alterarVelocidade = (novaVelocidade: number) => {
    setPlaybackRate(novaVelocidade);

    // Força a aplicação imediata no elemento HTML de áudio em tempo real
    if (audioRef.current) {
      audioRef.current.playbackRate = novaVelocidade;
    }
  };

  const alterarMusicaGlobal = (musica: any, listaDeMusicas?: any[]) => {
    setMusicaAtual(musica);
    if (listaDeMusicas && listaDeMusicas.length > 0) {
      setFilaMusicas(listaDeMusicas);
    } else if (filaMusicas.length === 0 || !filaMusicas.some(m => m.audioUrl === musica.audioUrl)) {
      setFilaMusicas([musica]);
    }
  };

  const avancarMusica = () => {
    if (!musicaAtual || filaMusicas.length === 0) return;

    // Converte os IDs para String para evitar qualquer erro de tipagem/comparação do MongoDB
    const idAtual = String(musicaAtual._id || musicaAtual.id || "");
    const indiceAtual = filaMusicas.findIndex(m => String(m._id || m.id || "") === idAtual);

    console.log("Avançar - Índice Atual:", indiceAtual, "Total na Fila:", filaMusicas.length);

    let proximaMusica;
    // Se achou o índice e não é a última música
    if (indiceAtual !== -1 && indiceAtual < filaMusicas.length - 1) {
      proximaMusica = filaMusicas[indiceAtual + 1];
    } else {
      proximaMusica = filaMusicas[0]; // Volta para a primeira
    }

    if (audioRef.current) audioRef.current.pause();
    setMusicaAtual(proximaMusica);
    setIsPlaying(true);
  };

  const voltarMusica = () => {
    if (!musicaAtual || filaMusicas.length === 0) return;

    // Converte os IDs para String para evitar qualquer erro de tipagem/comparação do MongoDB
    const idAtual = String(musicaAtual._id || musicaAtual.id || "");
    const indiceAtual = filaMusicas.findIndex(m => String(m._id || m.id || "") === idAtual);

    console.log("Voltar - Índice Atual:", indiceAtual, "Total na Fila:", filaMusicas.length);

    let musicaAnterior;
    // Se achou o índice e ele é maior que 0 (não é a primeira música)
    if (indiceAtual > 0) {
      musicaAnterior = filaMusicas[indiceAtual - 1];
    } else {
      musicaAnterior = filaMusicas[filaMusicas.length - 1]; // Vai para a última da fila
    }

    if (audioRef.current) audioRef.current.pause();
    setMusicaAtual(musicaAnterior);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!musicaAtual?.audioUrl) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Erro ao tocar:", err));
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const widthTotal = rect.width;
    const novoTempo = (clickX / widthTotal) * duration;

    audioRef.current.currentTime = novoTempo;
    setCurrentTime(novoTempo);
  };

  const deslogar = () => {
    localStorage.clear();
    setUserLogado(null);
    navigate('/login');
  };

  const formatarTempo = (segundos: number) => {
    if (isNaN(segundos)) return "0:00";
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (carregandoToken) {
    return <div style={{ backgroundColor: '#000000', minHeight: '100vh' }} />;
  }

  if (!userLogado) {
    return (
      <Routes>
        <Route path="/login" element={<TelaAbertura onLoginSucesso={(usuario) => { setUserLogado(usuario); navigate('/'); }} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="spotify-layout">

      {musicaAtual?.audioUrl && (
        <audio
          ref={audioRef}
          src={musicaAtual.audioUrl}
          autoPlay
          loop={isLooping}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onEnded={() => {
            if (isLooping) return;
            if (filaMusicas.length > 1) {
              avancarMusica();
            } else {
              setIsPlaying(false);
              setCurrentTime(0);
            }
          }}
        />
      )}

      <TopBar userLogado={userLogado} deslogar={deslogar} pesquisa={pesquisa} setPesquisa={setPesquisa} />

      <aside className="sidebar-left">
        <NavBar />
      </aside>

      <div className="app-body-container">

        <div className="app-main-columns">

          <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <Routes>
              <Route path='/' element={<Home pesquisa={pesquisa} />} />
              <Route
                path='/album/:id'
                element={
                  <DetalheAlbum
                    setMusicaAtual={(m, lista) => alterarMusicaGlobal(m, lista)}
                  />
                }
              />
              <Route path='/biblioteca' element={<Biblioteca />} /> 
              <Route path='/albuns' element={<GerenciarCadastro />} />
              <Route path='/inserir-album' element={<FormularioCadastro />} />
              <Route path='/musicas' element={<GerenciarMusicas setMusicaAtual={alterarMusicaGlobal} />} />
              <Route path='/inserir-musica' element={<FormularioMusica />} />
              <Route path='/usuarios' element={<GerenciarUsuarios />} />
              <Route path='/inserir-usuario' element={<FormularioUsuario />} />
              <Route path="/musica/:id" element={<DetalheMusica setMusicaAtual={alterarMusicaGlobal} />} />
            </Routes>
          </main>

          <aside className="sidebar-right">
            <h3>Tocando agora</h3>
            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
              <img className="now-playing-visual" src={musicaAtual?.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"} alt="Foto do Artista" />
            </div>
            <div style={{ marginTop: '4px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700 }}>{musicaAtual?.nome || "Nenhuma faixa selecionada"}</h4>
              <p style={{ color: '#b3b3b3', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>{musicaAtual?.artista || "-"}</p>
            </div>
          </aside>

        </div>
      </div>

      <footer className="player-bar">
        <div className="track-info">
          <img src={musicaAtual?.capaUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"} alt="Capa" />
          <div style={{ overflow: 'hidden' }}>
            <h5>{musicaAtual?.nome || "Sem música"}</h5>
            <p>{musicaAtual?.artista || "-"}</p>
          </div>
        </div>

        <div className="player-controls">
          <div className="buttons">
            <span onClick={() => setIsLooping(!isLooping)} style={{ cursor: 'pointer', transition: 'color 0.2s', color: isLooping ? '#1db954' : '#b3b3b3', fontSize: '1rem' }} title={isLooping ? "Desativar repetição" : "Repetir música"}>🔁</span>
            <span onClick={voltarMusica} style={{ cursor: 'pointer' }}>⏮</span>
            <div onClick={togglePlay} className="play-btn">{isPlaying ? '⏸' : '▶'}</div>
            <span onClick={avancarMusica} style={{ cursor: 'pointer' }}>⏭</span>
          </div>
          <div className="playback-bar">
            <span>{formatarTempo(currentTime)}</span>
            <div className="progress-bar" onClick={handleProgressBarClick}>
              <div className="progress" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, height: '100%', background: '#1db954', borderRadius: '2px' }}></div>
            </div>
            <span>{formatarTempo(duration)}</span>
          </div>
        </div>

        <div className="volume-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: '#282828', padding: '2px 8px', borderRadius: '4px' }}>
            <span style={{ color: '#b3b3b3', fontWeight: 600 }}>Vel:</span>
            <select
              value={playbackRate}
              onChange={(e) => alterarVelocidade(Number(e.target.value))}
              style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', outline: 'none' }}
            >
              <option value="0.5" style={{ background: '#181818' }}>0.5x</option>
              <option value="1.0" style={{ background: '#181818' }}>1.0x</option>
              <option value="1.5" style={{ background: '#181818' }}>1.5x</option>
              <option value="2.0" style={{ background: '#181818' }}>2.0x</option>
            </select>
          </div>
          <span>🔊</span>
          <input type="range" min="0" max="1" step="0.05" defaultValue="0.7" onChange={(e) => { if (audioRef.current) audioRef.current.volume = Number(e.target.value) }} style={{ accentColor: '#1db954', cursor: 'pointer', width: '80px', height: '4px' }} />
        </div>
      </footer>

    </div>
  );
}

export default App;