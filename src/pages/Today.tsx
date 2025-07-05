// src/pages/Today.tsx
import { useEffect, useState } from 'react';
import styles from './Today.module.css';

type Set = {
  reps: string;
  weight: number;
  rir: number;
};

type Exercise = {
  name: string;
  tempo: string;
  observaciones?: string;
  sets: Set[];
};

type Routine = {
  name: string;
  exercises: Exercise[];
};

export default function Today() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [duration, setDuration] = useState(0); // Temporizador en segundos
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null); // Controla qué menú está abierto

  useEffect(() => {
    const data = localStorage.getItem('training-routines');
    if (data) {
      setRoutines(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (activeRoutine && !timer) {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      setTimer(interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeRoutine, timer]);

  const startRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
  };

  const deleteRoutine = (index: number) => {
    const updatedRoutines = [...routines];
    updatedRoutines.splice(index, 1); // Eliminamos el entrenamiento
    setRoutines(updatedRoutines);
    localStorage.setItem('training-routines', JSON.stringify(updatedRoutines)); // Actualizamos el localStorage
    setMenuVisible(null); // Cerramos el menú
  };

  const handleSetChange = (
    exIndex: number,
    setIndex: number,
    field: keyof Set,
    value: string | number
  ) => {
    if (!activeRoutine) return;

    const updatedRoutine = { ...activeRoutine };
    const updatedExercises = [...updatedRoutine.exercises];
    const updatedSets = [...updatedExercises[exIndex].sets];

    if (field === 'weight' || field === 'rir') {
      updatedSets[setIndex][field] = parseFloat(value as string);
    } else {
      updatedSets[setIndex][field] = value as string;
    }

    updatedExercises[exIndex].sets = updatedSets;
    updatedRoutine.exercises = updatedExercises;

    setActiveRoutine(updatedRoutine);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const finishRoutine = () => {
    if (!activeRoutine) return;

    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('training-history') || '[]');

    history.unshift({
      date: today,
      duration: formatTime(duration),
      exercises: activeRoutine.exercises,
    });

    localStorage.setItem('training-history', JSON.stringify(history));

    if (timer) clearInterval(timer);
    setTimer(null);
    setActiveRoutine(null);
    setDuration(0);

    alert(`Entrenamiento "${activeRoutine.name}" guardado en el historial.`);
  };

  return (
    <div className={styles.container}>
      {!activeRoutine ? (
        <>
          <h1 className={styles.title}>🏋️ Entrenamientos Disponibles</h1>
          {routines.map((routine, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{routine.name}</h3>
                <button
                  className={styles.menuButton}
                  onClick={() => setMenuVisible(menuVisible === i ? null : i)}
                >
                  ⋮
                </button>
              </div>
              {menuVisible === i && (
                <div className={styles.menu}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteRoutine(i)}
                  >
                    🗑️ Eliminar entrenamiento
                  </button>
                </div>
              )}
              <button
                className={styles.primaryButton}
                onClick={() => startRoutine(routine)}
              >
                ▶️ Comenzar entrenamiento
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          <h1 className={styles.title}>🏋️ {activeRoutine.name}</h1>
          <p className={styles.timer}>⏱ Tiempo: {formatTime(duration)}</p>
          {activeRoutine.exercises.map((exercise, i) => (
            <div key={i} className={styles.card}>
              <h3>{exercise.name}</h3>
              {exercise.tempo && <p>Tempo: {exercise.tempo}</p>}
              {exercise.observaciones && <p className={styles.note}>📝 {exercise.observaciones}</p>}
              {exercise.sets.map((set, j) => (
                <div key={j} className={styles.setRow}>
                  <div className={styles.inputGroup}>
                    <label>Reps</label>
                    <p>{set.reps}</p>
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
                    <p>{set.rir}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button className={styles.primaryButton} onClick={finishRoutine}>
            💾 Terminar entrenamiento
          </button>
        </>
      )}
    </div>
  );
}
