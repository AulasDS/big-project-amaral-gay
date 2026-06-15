import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import FormularCadastro from './pages/FormularCadastro';
import GerenciarCadastro from './pages/GerenciarCadastro';
import NavBar from './components/navBar';
import GerenciarMusicas from './pages/GerenciarMusicas';
import FormularioMusica from './pages/FormularioMusica';
import GerenciarPlaylists from './pages/GerenciarPlaylist';
import FormularioPlaylist from './pages/FormularioPlaylist';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import FormularioUsuario from './pages/FormularioUsuario';

function App() {
  return (
    <div className="spotify-layout">
      
      <aside className="sidebar-left">
        <NavBar />
      </aside>

      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          
          <Route path='/albuns' element={<GerenciarCadastro />} />
          <Route path='/inserir-album' element={<FormularCadastro />} />

          <Route path='/musicas' element={<GerenciarMusicas />} />
          <Route path='/inserir-musica' element={<FormularioMusica />} />

          <Route path='/playlists' element={<GerenciarPlaylists />} />
          <Route path='/inserir-playlist' element={<FormularioPlaylist />} />

          <Route path='/usuarios' element={<GerenciarUsuarios />} />
          <Route path='/inserir-usuario' element={<FormularioUsuario />} />
        </Routes>
      </main>

      {/* ... Sua barra lateral direita e footer permanecem idênticos aqui ... */}
      <aside className="sidebar-right">
        <h3>Tocando agora</h3>
        <img className="now-playing-visual" src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" alt="Foto do Artista" />
        <div style={{ marginTop: '12px' }}>
          <h4>Freek'n You</h4>
          <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Jodeci</p>
        </div>
      </aside>

      <footer className="player-bar">
        <div className="track-info">
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&q=80" alt="Capa" />
          <div>
            <h5 style={{ margin: 0 }}>Freek'n You</h5>
            <p style={{ margin: 0, color: '#b3b3b3', fontSize: '0.8rem' }}>Jodeci</p>
          </div>
        </div>
        <div className="player-controls">
          <div className="buttons">
            <span>⏮</span>
            <div className="play-btn">▶</div>
            <span>⏭</span>
          </div>
          <div className="playback-bar">
            <span>0:47</span>
            <div className="progress-bar"><div className="progress"></div></div>
            <span>5:19</span>
          </div>
        </div>
        <div className="volume-controls">
          <span>🔊</span>
          <div className="volume-slider"></div>
        </div>
      </footer>
    </div>
  )
}

export default App;