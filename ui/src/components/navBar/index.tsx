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
}