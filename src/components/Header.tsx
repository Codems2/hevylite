import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <span className={styles.logo}>🔥 HevyLite</span>
      <nav className={styles.nav}>
        <Link to="/today" className={pathname === '/today' ? styles.active : styles.link}>
          Hoy
        </Link>
        <Link to="/routines" className={pathname === '/routines' ? styles.active : styles.link}>
          Rutinas
        </Link>
        <Link to="/history" className={pathname === '/history' ? styles.active : styles.link}>
          Historial
        </Link>
      </nav>
    </header>
  );
}