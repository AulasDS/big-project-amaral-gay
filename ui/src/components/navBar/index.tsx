<<<<<<< HEAD
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    Spotify
                </Link>

                {/* Links de Navegação */}
                <div className={styles.menu}>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/">Home</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/produtos/">Produtos</Link>
                        </li>
                        
                        {/* 👇 NOVOS LINKS ADICIONADOS AQUI 👇 */}
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/clientes">Clientes</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/compras">Compras</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
=======
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    Spotify
                </Link>

                <div className={styles.menu}>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
<<<<<<< HEAD
                            <Link className={styles.navLink} to="/">Home</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/produtos/">Musicas</Link>
=======
                            <Link className={styles.navLink} to="/">Início</Link>
>>>>>>> master
                        </li>
                        
                        {/* Álbuns */}
                        <li className={styles.navItem}>
<<<<<<< HEAD
                            <Link className={styles.navLink} to="/clientes">Cantores</Link>
=======
                            <Link className={styles.navLink} to="/albuns">Álbuns</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/inserir-album">Inserir Álbum</Link>
                        </li>

                        {/* Músicas */}
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/musicas">Músicas</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/inserir-musica">Inserir Música</Link>
                        </li>

                        {/* Playlists */}
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/playlists">Playlists</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/inserir-playlist">Criar Playlist</Link>
                        </li>

                        {/* 👇 ADICIONADO: Seção de Usuários 👇 */}
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/usuarios">Usuários</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link className={styles.navLink} to="/inserir-usuario">Novo Usuário</Link>
>>>>>>> master
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
>>>>>>> bigode
}