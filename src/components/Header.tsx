import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        document.body.style.paddingBottom = '60px'; // Ajusta el espacio para el header en móvil
      } else {
        document.body.style.paddingBottom = '0'; // Restablece el espacio en versiones web
      }
    };

    handleResize(); // Ejecuta al cargar
    window.addEventListener('resize', handleResize); // Escucha cambios de tamaño

    return () => {
      window.removeEventListener('resize', handleResize); // Limpia el evento al desmontar
    };
  }, []);

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