import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';

/** Colori attivi dalla palette */
const MOOD_ACTIVE_COLORS = {
  happy: '#22c55e',
  neutral: '#eab308',
  sad: '#ef4444',
};

/** Label per la sezione resoconto */
const moodPalette = {
  happy: 'Felice',
  neutral: 'Neutro',
  sad: 'Triste',
};

const moods = [
  { id: 'happy', icon: Smile, label: 'Felice' },
  { id: 'neutral', icon: Meh, label: 'Neutro' },
  { id: 'sad', icon: Frown, label: 'Triste' },
];

/**
 * Stato del Paziente: stato sollevato al padre (ListPage).
 * Props: mood (valore dal padre), setMood (funzione per aggiornare il padre).
 */
const MoodTracker = ({ userRole, mood, setMood, moodToast, reduceMotion = false }) => {
  const isNurse = userRole === 'healthcare';
  const isPatient = userRole === 'patient';

  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    setSelectedMood(mood ?? null);
  }, [mood]);

  const handleSaveMood = (id) => {
    if (isNurse) return;
    setSelectedMood(id);
    setMood?.(id);
  };

  useEffect(() => {
    console.log('Dato inviato alla sezione resoconto:', mood);
  }, [mood]);

  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: 'var(--card-radius-lg)',
      padding: 'var(--content-padding-y)',
      boxShadow: 'var(--card-shadow)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
    },
    title: { fontWeight: 'bold', fontSize: '18px' },
    resoconto: {
      fontSize: '15px',
      fontWeight: '600',
      color: 'var(--color-primary)',
      marginTop: '12px',
      marginBottom: '4px',
    },
    toast: { fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', marginTop: '8px', display: 'block' },
    debugMood: { fontSize: '12px', color: '#16a34a', fontWeight: '600', marginTop: '4px', display: 'block' },
    hint: { fontSize: '12px', color: '#6B7280', marginTop: '8px' },
    link: { fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', marginTop: '10px', textDecoration: 'none', display: 'inline-block' },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        {isPatient ? 'Come ti senti?' : 'Stato del Paziente'}
      </h3>

      <div className="mood-tracker-buttons" role="group" aria-label="Seleziona umore">
        {moods.map((m) => {
          const Icon = m.icon;
          const isSelected = (selectedMood ?? mood) === m.id;
          const activeColor = MOOD_ACTIVE_COLORS[m.id];
          return (
            <button
              key={m.id}
              type="button"
              className={`mood-btn ${isSelected ? 'active' : ''}`}
              data-mood={m.id}
              disabled={isNurse}
              onClick={() => handleSaveMood(m.id)}
              aria-label={m.label}
              aria-pressed={isSelected}
              style={{
                position: 'relative',
                zIndex: 100,
                pointerEvents: 'auto',
                opacity: isNurse && !isSelected && mood ? 0.5 : 1,
              }}
            >
              <Icon
                size={48}
                color={isSelected ? activeColor : '#cbd5e1'}
                strokeWidth={1.75}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {/* Sezione resoconto: legge da moodHistory (prop mood sincronizzato dal padre) */}
      <div style={styles.resoconto}>
        {mood ? moodPalette[mood] : 'Nessun dato'}
      </div>
      {/* Debug: conferma che il dato arriva (temporaneo, in rosso) */}
      <div style={styles.debugMood}>
        Ultimo umore ricevuto: {mood ? moodPalette[mood] : '—'}
      </div>

      {moodToast && (
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.toast}
        >
          {moodToast}
        </motion.span>
      )}
      <span style={styles.hint}>
        {isPatient ? "Tocca l'emozione che provi ora" : "L'ultimo umore registrato dal paziente"}
      </span>
      <Link to="/report-umore" style={styles.link}>
        Vedi report umore →
      </Link>
    </div>
  );
};

export default MoodTracker;
