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
import SelectPerfil from './pages/SelectPerfil';
import TelaAbertura from './pages/TelaAbertura';
import DetalheMusica from './pages/DetalheMusica';

function App() {
  const [userLogado, setUserLogado] = useState<any>(null);
  const [carregandoToken, setCarregandoToken] = useState(true);
  const navigate = useNavigate();

  const [musicaAtual, setMusicaAtual] = useState<any>(null);
  // 🟢 NOVA FILA DE REPRODUÇÃO: Armazena a lista do álbum/playlist atual para navegação
  const [filaMusicas, setFilaMusicas] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🟢 NOVOS ESTADOS PARA AS FUNCIONALIDADES DO PLAYER
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
      // Mantém a velocidade de reprodução selecionada ao trocar de música
      audioRef.current.playbackRate = playbackRate;

      audioRef.current.play()
        .catch((err) => {
          setIsPlaying(false);
          console.log("Autoplay aguardando interação do usuário:", err);
        });
    }
  }, [musicaAtual]);

  // 🟢 FUNÇÃO ADICIONADA: Gerencia a alteração de faixas vinda de outros componentes
  const alterarMusicaGlobal = (musica: any, listaDeMusicas?: any[]) => {
    setMusicaAtual(musica);
    if (listaDeMusicas && listaDeMusicas.length > 0) {
      setFilaMusicas(listaDeMusicas);
    } else if (filaMusicas.length === 0 || !filaMusicas.some(m => m.audioUrl === musica.audioUrl)) {
      // Cria uma fila de uma única música caso não exista uma lista rolando
      setFilaMusicas([musica]);
    }
  };

  // 🟢 VERSÃO DEFINITIVA: Passa para a próxima música da fila
  const avancarMusica = () => {
    if (!musicaAtual) return;

    // Se a fila veio vazia, tenta buscar da própria música atual ou cria uma lista com ela
    const listaParaUso = filaMusicas.length > 0 ? filaMusicas : [musicaAtual];
    const indiceAtual = listaParaUso.findIndex(m => m.audioUrl === musicaAtual.audioUrl);

    if (indiceAtual !== -1 && indiceAtual < listaParaUso.length - 1) {
      setMusicaAtual(listaParaUso[indiceAtual + 1]);
    } else {
      setMusicaAtual(listaParaUso[0]); // Volta pro começo se for a última
    }
  };

  // 🟢 VERSÃO DEFINITIVA: Volta para a música anterior
  const voltarMusica = () => {
    if (!musicaAtual) return;

    const listaParaUso = filaMusicas.length > 0 ? filaMusicas : [musicaAtual];
    const indiceAtual = listaParaUso.findIndex(m => m.audioUrl === musicaAtual.audioUrl);

    if (indiceAtual !== -1 && indiceAtual > 0) {
      setMusicaAtual(listaParaUso[indiceAtual - 1]);
    } else {
      setMusicaAtual(listaParaUso[listaParaUso.length - 1]); // Vai pra última se for a primeira
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

  // 🟢 ALTERAÇÃO DE VELOCIDADE DE REPRODUÇÃO
  const alterarVelocidade = (velocidade: number) => {
    setPlaybackRate(velocidade);
    if (audioRef.current) {
      audioRef.current.playbackRate = velocidade;
    }
  };

  // 🟢 CLIQUE INTERATIVO NA BARRA DE PROGRESSO
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // Distância do clique a partir da esquerda
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

      {/* 🟢 O elemento HTML5 só renderiza e consome banda se houver uma URL válida de áudio */}
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
          onEnded={() => { // 🟢 CORRIGIDO: De 'onEnding' para 'onEnded'
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

      {/* 🟢 Removidos estilos inline conflitantes para respeitar o CSS global do Grid */}
      <aside className="sidebar-left">
        <NavBar />

        <div style={{
          padding: '16px 8px',
          marginTop: 'auto',              // Garante que ele fique colado no rodapé da barra lateral
          borderTop: '1px solid #1c1c1c', // Uma linha sutil separando o menu do perfil
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
            onClick={deslogar} // 🟢 AGORA CHAMA A FUNÇÃO DESLOGAR CORRETAMENTE
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
              e.currentTarget.style.borderColor = '#ff4a4a'; // 🔴 Muda para um tom avermelhado sutil no hover indicando logout
              e.currentTarget.style.color = '#ff4a4a';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#535353';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🚪 Sair da Conta
          </button>
        </div>
      </aside>

      {/* 🟢 Removidos estilos inline conflitantes para respeitar o CSS global do Grid */}
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/select-perfil' element={<SelectPerfil onSelect={(u: any) => setUserLogado(u)} />} />

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

      {/* 🟢 Removidos estilos inline daqui para assumir as regras flexbox, padding e grid-column do seu App.css */}
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

            {/* 🟢 BOTÃO DE LOOP (REPETIR) */}
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

            {/* 🟢 PROGRESS BAR CLICÁVEL (INTERATIVA) */}
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

          {/* 🟢 SELETOR DE VELOCIDADE DE REPRODUÇÃO */}
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