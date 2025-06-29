// src/pages/Routines.tsx
import {useState } from 'react';
import styles from './Routines.module.css';

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

export default function Routines() {
  const [routine, setRoutine] = useState<Exercise[]>([]);

  const handleExerciseChange = (
    index: number,
    field: 'name' | 'tempo' | 'observaciones',
    value: string
  ) => {
    const updated = [...routine];
    updated[index][field] = value;
    setRoutine(updated);
  };

  const handleSetChange = (
    exIndex: number,
    setIndex: number,
    field: keyof Set,
    value: number
  ) => {
    const updated = [...routine];
    updated[exIndex].sets[setIndex][field] = value;
    setRoutine(updated);
  };

  const addExercise = () => {
    setRoutine([
      ...routine,
      {
        name: '',
        tempo: '',
        observaciones: '',
        sets: [{ reps: 0, weight: 0, rir: 0 }],
      },
    ]);
  };

  const addSet = (index: number) => {
    const updated = [...routine];
    updated[index].sets.push({ reps: 0, weight: 0, rir: 0 });
    setRoutine(updated);
  };

  const saveRoutine = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`training-${today}`, JSON.stringify(routine));
    alert('Rutina guardada para hoy');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 Crear Rutina</h1>

      {routine.map((exercise, i) => (
        <div key={i} className={styles.card}>
          <input
            className={styles.input}
            placeholder="Nombre del ejercicio"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(i, 'name', e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Tempo (ej. 3-0-1)"
            value={exercise.tempo}
            onChange={(e) => handleExerciseChange(i, 'tempo', e.target.value)}
          />

          <textarea
            className={styles.input}
            placeholder="Observaciones del entrenador"
            value={exercise.observaciones}
            onChange={(e) => handleExerciseChange(i, 'observaciones', e.target.value)}
          />

          {exercise.sets.map((set, j) => (
            <div key={j} className={styles.setRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Repeticiones</label>
                <input
                  className={styles.input}
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(i, j, 'reps', parseInt(e.target.value))
                  }
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.inputGroup_hidden}`}>
                <label className={styles.inputLabel}>Peso (kg)</label>
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
                <label className={styles.inputLabel}>RIR</label>
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

          <button
            className={styles.secondaryButton}
            onClick={() => addSet(i)}
          >
            ➕ Añadir serie
          </button>
        </div>
      ))}

      <button className={styles.primaryButton} onClick={addExercise}>
        ➕ Añadir ejercicio
      </button>

      {routine.length > 0 && (
        <button className={styles.primaryButton} onClick={saveRoutine}>
          💾 Guardar rutina
        </button>
      )}
    </div>
  );
}
