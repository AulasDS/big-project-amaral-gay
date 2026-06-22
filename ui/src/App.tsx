import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import FormularioCadastro from './pages/FormularioCadastro';
import GerenciarCadastro from './pages/GerenciarCadastro';
import NavBar from './components/navBar';
import GerenciarMusicas from './pages/GerenciarMusicas';
import FormularioMusica from './pages/FormularioMusica';
import GerenciarPlaylist from './pages/GerenciarPlaylist';
import FormularioPlaylist from './pages/FormularioPlaylist';
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

  const [musicaAtual, setMusicaAtual] = useState<any>(null);
  // nova fila de reproducao armazena a lista do album ou playlist atual para navegacao
  const [filaMusicas, setFilaMusicas] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // novos estados para as funcionalidades do player
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

  useEffect(() => {
    if (musicaAtual?.audioUrl && audioRef.current) {
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(true);
      // mantem a velocidade de reproducao selecionada ao trocar de musica
      audioRef.current.playbackRate = playbackRate;

      audioRef.current.play()
        .catch((err) => {
          setIsPlaying(false);
          console.log("Autoplay aguardando interação do usuário:", err);
        });
    }
  }, [musicaAtual]);

  // funcao adicionada gerencia a alteracao de faixas vinda de outros componentes
  const alterarMusicaGlobal = (musica: any, listaDeMusicas?: any[]) => {
    setMusicaAtual(musica);
    if (listaDeMusicas && listaDeMusicas.length > 0) {
      setFilaMusicas(listaDeMusicas);
    } else if (filaMusicas.length === 0 || !filaMusicas.some(m => m.audioUrl === musica.audioUrl)) {
      // cria uma fila de uma unica musica caso nao exista uma lista rolando
      setFilaMusicas([musica]);
    }
  };

  // versao definitiva passa para a proxima musica da fila
  const avancarMusica = () => {
    if (!musicaAtual) return;

    // se a fila veio vazia tenta buscar da propria musica atual ou cria uma lista com ela
    const listaParaUso = filaMusicas.length > 0 ? filaMusicas : [musicaAtual];
    const indiceAtual = listaParaUso.findIndex(m => m.audioUrl === musicaAtual.audioUrl);

    if (indiceAtual !== -1 && indiceAtual < listaParaUso.length - 1) {
      setMusicaAtual(listaParaUso[indiceAtual + 1]);
    } else {
      setMusicaAtual(listaParaUso[0]); // volta pro comeco se for a ultima
    }
  };

  // versao definitiva volta para a musica anterior
  const voltarMusica = () => {
    if (!musicaAtual) return;

    const listaParaUso = filaMusicas.length > 0 ? filaMusicas : [musicaAtual];
    const indiceAtual = listaParaUso.findIndex(m => m.audioUrl === musicaAtual.audioUrl);

    if (indiceAtual !== -1 && indiceAtual > 0) {
      setMusicaAtual(listaParaUso[indiceAtual - 1]);
    } else {
      setMusicaAtual(listaParaUso[listaParaUso.length - 1]); // vai pra ultima se for a primeira
    }
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

  // alteracao de velocidade de reproducao
  const alterarVelocidade = (velocidade: number) => {
    setPlaybackRate(velocidade);
    if (audioRef.current) {
      audioRef.current.playbackRate = velocidade;
    }
  };

  // clique interativo na barra de progresso
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // distancia do clique a partir da esquerda
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

      {/* o elemento html5 so renderiza e consome banda se houver uma url valida de audio */}
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
          onEnded={() => { // corrigido de onending para onended
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

      {/* removidos estilos inline conflitantes para respeitar o css global do grid */}
      <aside className="sidebar-left">
        <NavBar />

        <div style={{
          padding: '16px 8px',
          marginTop: 'auto',              // garante que ele fique colado no rodape da barra lateral
          borderTop: '1px solid #1c1c1c', // uma linha sutil separando o menu do perfil
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{
            color: '#b3b3b3',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Ouvindo como
          </span>

          <span style={{
            color: '#1ed760',
            fontSize: '1.1rem',
            fontWeight: '700'
          }}>
            {userLogado?.nome || 'Perfil'}
          </span>

          <button
            onClick={deslogar} // agora chama a funcao deslogar corretamente
            style={{
              backgroundColor: 'transparent',
              color: '#fff',
              border: '1px solid #535353',
              padding: '6px 16px',
              borderRadius: '500px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff4a4a'; // muda para um tom avermelhado sutil no hover indicando logout
              e.currentTarget.style.color = '#ff4a4a';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#535353';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
             Sair da Conta
          </button>
        </div>
      </aside>

      {/* removidos estilos inline conflitantes para respeitar o css global do grid */}
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home />} />

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
          <Route path='/playlists' element={<GerenciarPlaylist />} />
          <Route path='/inserir-playlist' element={<FormularioPlaylist />} />
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

      {/* removidos estilos inline daqui para assumir as regras flexbox padding e grid column do seu app css */}
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

            {/* botao de loop repetir */}
            <span
              onClick={() => setIsLooping(!isLooping)}
              style={{
                cursor: 'pointer',
                transition: 'color 0.2s',
                color: isLooping ? '#1db954' : '#b3b3b3',
                fontSize: '1rem'
              }}
              title={isLooping ? "Desativar repetição" : "Repetir música"}
            >
              🔁
            </span>

            <span onClick={voltarMusica}>⏮</span>

            <div onClick={togglePlay} className="play-btn">
              {isPlaying ? '⏸' : '▶'}
            </div>

            <span onClick={avancarMusica}>⏭</span>
          </div>

          <div className="playback-bar">
            <span>{formatarTempo(currentTime)}</span>

            {/* progress bar clicavel interativa */}
            <div className="progress-bar" onClick={handleProgressBarClick}>
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

        <div className="volume-controls">

          {/* seletor de velocidade de reproducao */}
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
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="0.7"
            onChange={(e) => { if (audioRef.current) audioRef.current.volume = Number(e.target.value) }}
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