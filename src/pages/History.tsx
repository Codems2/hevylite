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

  useEffect(() => {
    const data = localStorage.getItem('training-history');
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Historial de Entrenamientos</h1>
      {history.length === 0 && <p>No hay entrenamientos registrados.</p>}

      {history.map((session, i) => (
        <div key={i} className={styles.card}>
          <h3>{session.date}</h3>
          <p>🕒 Duración: {session.duration}</p>
          {session.exercises.map((ex, j) => (
            <div key={j} className={styles.exerciseBlock}>
              <h4>{ex.name}</h4>
              {ex.tempo && <p>Tempo: {ex.tempo}</p>}
              {ex.observaciones && <p className={styles.note}>📝 {ex.observaciones}</p>}
              {ex.sets.map((set, k) => (
                <p key={k}>🔁 {set.reps} reps - {set.weight}kg - RIR {set.rir}</p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
