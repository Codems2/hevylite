// src/pages/Routines.tsx
import { useState } from 'react';
import styles from './Routines.module.css';

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

export default function Routines() {
  const [routine, setRoutine] = useState<Exercise[]>([]);
  const [routineName, setRoutineName] = useState('');
  const [showRoutineName, setShowRoutineName] = useState(false);

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
    field: keyof Set, // Aseguramos que `field` sea una clave válida de `Set`
    value: string | number // Permitimos que `value` sea de tipo `string | number`
  ) => {
    const updated = [...routine];
    if (field === 'weight' || field === 'rir') {
      updated[exIndex].sets[setIndex][field] = parseFloat(value as string); // Convertimos a número si es necesario
    } else {
      updated[exIndex].sets[setIndex][field] = value as string; // Asignamos como string para 'reps'
    }
    setRoutine(updated);
  };

  const addExercise = () => {
    setRoutine([
      ...routine,
      {
        name: '',
        tempo: '',
        observaciones: '',
        sets: [{ reps: '', weight: 0, rir: 0 }],
      },
    ]);
    setShowRoutineName(true);
  };

  const addSet = (index: number) => {
    const updated = [...routine];
    updated[index].sets.push({ reps: '', weight: 0, rir: 0 });
    setRoutine(updated);
  };

  const saveRoutine = () => {
    if (!routineName.trim()) {
      alert('Por favor, asigna un nombre al entrenamiento antes de guardar.');
      return;
    }
    if (routine.some((exercise) => exercise.name.trim() === '' || exercise.sets.length === 0)) {
      alert('Por favor, completa todos los campos de los ejercicios antes de guardar.');
      return;
    }

    const newRoutine: Routine = {
      name: routineName,
      exercises: routine,
    };

    const existingRoutines = JSON.parse(localStorage.getItem('training-routines') || '[]');
    existingRoutines.push(newRoutine);
    localStorage.setItem('training-routines', JSON.stringify(existingRoutines));

    alert(`Entrenamiento "${routineName}" guardado correctamente.`);
    setRoutine([]);
    setRoutineName('');
    setShowRoutineName(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 Crear Entrenamiento</h1>

      {showRoutineName && (
        <input
          className={styles.input}
          type="text"
          placeholder="Nombre del entrenamiento"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />
      )}

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
                  type="text"
                  value={set.reps}
                  placeholder="Ejemplo: 6-8"
                  onChange={(e) => handleSetChange(i, j, 'reps', e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Peso (kg)</label>
                <input
                  className={styles.input}
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleSetChange(i, j, 'weight', e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>RIR</label>
                <input
                  className={styles.input}
                  type="number"
                  value={set.rir}
                  onChange={(e) => handleSetChange(i, j, 'rir', e.target.value)}
                />
              </div>
            </div>
          ))}

          <button className={styles.secondaryButton} onClick={() => addSet(i)}>
            ➕ Añadir serie
          </button>
        </div>
      ))}

      <button className={styles.primaryButton} onClick={addExercise}>
        ➕ Añadir ejercicio
      </button>

      {routine.length > 0 && (
        <button className={styles.primaryButton} onClick={saveRoutine}>
          💾 Guardar entrenamiento
        </button>
      )}
    </div>
  );
}
