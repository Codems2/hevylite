// src/pages/History.tsx
import { useEffect, useState } from 'react';
import styles from './History.module.css';

type Set = {
  reps: number;
  weight: number;
  rir: number;
};

type Exercise = {
  name: string;
  tempo: string;
  observaciones?: string;
  sets: Set[];
};

type Session = {
  date: string;
  duration: string;
  exercises: Exercise[];
};

export default function History() {
  const [history, setHistory] = useState<Session[]>([]);
  const [menuVisible, setMenuVisible] = useState<number | null>(null); // Controla qué menú está abierto

  useEffect(() => {
    const data = localStorage.getItem('training-history');
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  const deleteSession = (index: number) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1); // Eliminamos el entrenamiento del historial
    setHistory(updatedHistory);
    localStorage.setItem('training-history', JSON.stringify(updatedHistory)); // Actualizamos el localStorage
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Historial de Entrenamientos</h1>
      {history.length === 0 && <p>No hay entrenamientos registrados.</p>}

      {history.map((session, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{session.date}</h3>
            <button
              className={styles.menuButton}
              onClick={() => setMenuVisible(menuVisible === i ? null : i)} // Alternamos el menú
            >
              ⋮
            </button>
          </div>
          <p>🕒 Duración: {session.duration}</p>
          {Array.isArray(session.exercises) ? (
            session.exercises.map((ex, j) => (
              <div key={j} className={styles.exerciseBlock}>
                <h4>{ex.name}</h4>
                {ex.tempo && <p>Tempo: {ex.tempo}</p>}
                {ex.observaciones && <p className={styles.note}>📝 {ex.observaciones}</p>}
                {ex.sets.map((set, k) => (
                  <p key={k}>🔁 {set.reps} reps - {set.weight}kg - RIR {set.rir}</p>
                ))}
              </div>
            ))
          ) : (
            <p>No hay ejercicios registrados.</p>
          )}
          {menuVisible === i && (
            <div className={styles.menu}>
              <button
                className={styles.deleteButton}
                onClick={() => deleteSession(i)}
              >
                🗑️ Eliminar entrenamiento
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
