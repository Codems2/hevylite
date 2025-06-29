// src/pages/Today.tsx
import { useEffect, useState } from 'react';
import styles from './Today.module.css';

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

export default function Today() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [started, setStarted] = useState(false);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(`training-${today}`);
    if (data) {
      setExercises(JSON.parse(data));
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const startWorkout = () => {
    if (started) return;
    setStarted(true);
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    setTimer(interval);
  };

  const handleSetChange = (
    exIndex: number,
    setIndex: number,
    field: keyof Set,
    value: number
  ) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const saveWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('training-history') || '[]');

    history.unshift({
      date: today,
      duration: formatTime(duration),
      exercises,
    });

    localStorage.setItem('training-history', JSON.stringify(history));

    if (timer) clearInterval(timer);

    alert('Entrenamiento guardado. Duración: ' + formatTime(duration));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏋️ Entrenamiento de Hoy</h1>
      <p className={styles.timer}>⏱ Tiempo: {formatTime(duration)}</p>

      <button className={styles.secondaryButton} onClick={startWorkout} disabled={started}>
        ▶️ Comenzar entrenamiento
      </button>

      {exercises.map((ex, i) => (
        <div key={i} className={styles.card}>
          <h3>{ex.name}</h3>
          {ex.tempo && <p>Tempo: {ex.tempo}</p>}
          {ex.observaciones && <p className={styles.note}>📝 {ex.observaciones}</p>}

          {ex.sets.map((set, j) => (
            <div key={j} className={styles.setRow}>
              <div className={styles.inputGroup}>
                <label>Reps</label>
                <input
                  className={styles.input}
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(i, j, 'reps', parseInt(e.target.value))
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Peso (kg)</label>
                <input
                  className={styles.input}
                  type="number"
                  value={set.weight}
                  onChange={(e) =>
                    handleSetChange(i, j, 'weight', parseFloat(e.target.value))
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <label>RIR</label>
                <input
                  className={styles.input}
                  type="number"
                  value={set.rir}
                  onChange={(e) =>
                    handleSetChange(i, j, 'rir', parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {exercises.length > 0 && (
        <button
          className={`${styles.primaryButton} ${!started ? styles.disabledButton : ''}`}
          onClick={saveWorkout}
          disabled={!started}
        >
          💾 Guardar Entrenamiento
        </button>
      )}
    </div>
  );
}
