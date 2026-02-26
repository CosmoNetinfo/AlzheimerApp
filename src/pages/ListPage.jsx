import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
    Bell, 
    Calendar, 
    Plus, 
    Heart,
    Trash2,
    CheckCircle2,
    Settings,
    Apple,
    Footprints,
    Brain,
    Droplets
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { wellnessQuotes, getDayOfYear } from '../data/quotes';
import { addMoodEntry, getMoodHistory, getLatestMood } from '../utils/moodHistory';
import ClinicalDashboard from '../components/ClinicalDashboard';
import MoodTracker from '../components/MoodTracker';

const initialTasks = [
    { id: 1, text: 'Prendere medicine mattina', time: '08:00', completed: false },
    { id: 2, text: 'Riposo', time: '12:00', completed: false },
    { id: 3, text: 'Passeggiata', time: '15:30', completed: false },
    { id: 4, text: 'Bere un bicchiere d\'acqua', time: '10:00', completed: false },
    { id: 5, text: 'Chiudere la porta a chiave', time: '21:00', completed: false },
];

const QUOTE_ICON_COLOR = '#D97706';

/** Converte "HH:MM" o "H:MM" in minuti dall'inizio del giorno per ordinare per orario */
function timeToMinutes(timeStr) {
  if (!timeStr || timeStr === '--:--') return Infinity;
  const parts = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!parts) return Infinity;
  return parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
}

const categoryIcons = {
  nutrizione: Apple,
  movimento: Footprints,
  mente: Brain,
  idratazione: Droplets,
};

const ListPage = () => {
    const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{}');
    const isPatient = user.role === 'patient';
    const isHealthcare = user.role === 'healthcare';
    const reduceMotion = useReducedMotion();
    
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('alzheimer_tasks');
        if (!saved) return initialTasks;
        try {
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed) || parsed.length === 0) return initialTasks;
            // Se sono le vecchie 4 attività predefinite, passa alle 5 nuove
            const isOldDefaults = parsed.length === 4 && parsed.some(t => t.text === 'Prendere farmaci mattino');
            return isOldDefaults ? initialTasks : parsed;
        } catch {
            return initialTasks;
        }
    });
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskTime, setNewTaskTime] = useState("");
    const [showManage, setShowManage] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [currentMood, setCurrentMood] = useState(() => getLatestMood()); // sync con moodHistory (localStorage)
    const [loadingMood, setLoadingMood] = useState(true);
    const [moodToast, setMoodToast] = useState(null);

    // Frase del giorno: indice = giorno dell'anno (1-365)
    const dailyQuoteData = useMemo(() => {
        const dayOfYear = getDayOfYear();
        const index = Math.min(dayOfYear - 1, wellnessQuotes.length - 1);
        return wellnessQuotes[index];
    }, []);

    // Salva ogni volta che i task cambiano
    useEffect(() => {
        localStorage.setItem('alzheimer_tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Fetch Mood from Supabase
    useEffect(() => {
        const fetchMood = async () => {
            try {
                // Fetch the patient's profile to get the mood. 
                // If current user is patient, we use their ID. 
                // If not, we search for the first patient (demo-logic) or we'd need a multi-user association.
                const profileId = isPatient ? (user.id || (user.name + (user.surname || ''))) : null;
                
                let query = supabase.from('profiles').select('current_mood');
                if (profileId) {
                    query = query.eq('id', profileId);
                } else {
                    // If caregiver, find any patient's mood (simplified for this app structure)
                    query = query.eq('role', 'patient').limit(1);
                }

                const { data, error } = await query.single();
                if (!error && data) {
                    setCurrentMood(data.current_mood);
                }
            } catch (e) {
                console.error("error fetching mood", e);
            } finally {
                setLoadingMood(false);
            }
        };
        fetchMood();
    }, [isPatient, user.id, user.name, user.surname]);

    const handleMoodSelect = async (mood) => {
        setCurrentMood(mood);
        addMoodEntry(mood);
        if (isPatient) {
            const ora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            setMoodToast(`Umore delle ${ora} registrato con successo!`);
            try {
                const profileId = user.id || (user.name + (user.surname || ''));
                await supabase.from('profiles').upsert([{
                    id: profileId,
                    current_mood: mood,
                    name: user.name,
                    surname: user.surname,
                    role: user.role
                }]);
            } catch (e) {
                console.error("Error saving mood", e);
            }
        }
    };

    useEffect(() => {
        if (!moodToast) return;
        const t = setTimeout(() => setMoodToast(null), 3000);
        return () => clearTimeout(t);
    }, [moodToast]);

    useEffect(() => {
        const onMoodSaved = () => setCurrentMood(getLatestMood());
        window.addEventListener('patientMoodSaved', onMoodSaved);
        return () => window.removeEventListener('patientMoodSaved', onMoodSaved);
    }, []);

    useEffect(() => {
        const check = () => {
            let hasPerm = false;
            if (window.OneSignal && window.OneSignal.Notifications) {
                hasPerm = window.OneSignal.Notifications.permission === true;
            } else if (window.Notification) {
                hasPerm = window.Notification.permission === 'granted';
            }
            setNotificationsEnabled(hasPerm);
        };
        check();
    }, []);

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const addTask = () => {
        if (!newTaskText.trim()) return;
        const newTask = {
            id: Date.now(),
            text: newTaskText,
            time: newTaskTime || new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
            completed: false
        };
        setTasks([newTask, ...tasks]);
        setNewTaskText("");
        setNewTaskTime("");
        setShowManage(false);
    };

    const deleteTask = (id) => {
        if (window.confirm("Vuoi cancellare questa attività?")) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const styles = {
        container: {
            padding: 'var(--content-padding-y) var(--content-padding-x)',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            overflowX: 'hidden',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--section-gap)',
        },
        greeting: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1A1A1A',
        },
        settingsLink: {
            color: '#9CA3AF',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: 'var(--card-radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--card-shadow)',
        },
        agendaCard: {
            background: 'var(--color-primary)',
            borderRadius: 'var(--card-radius-lg)',
            padding: 'var(--content-padding-y) 20px',
            color: 'white',
            marginBottom: 'var(--section-gap)',
            boxShadow: '0 4px 16px rgba(146, 72, 122, 0.25), 0 2px 6px rgba(0, 0, 0, 0.06)',
        },
        agendaDateRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '15px',
            fontWeight: '600',
            opacity: 0.95,
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
        },
        cardTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
        },
        taskItem: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--card-radius)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            cursor: 'pointer',
        },
        taskLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: 0,
            flex: 1,
        },
        taskIcon: {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        taskText: {
            fontWeight: '600',
            fontSize: '16px',
            wordBreak: 'break-word',
            minWidth: 0,
            color: 'white',
        },
        completedText: {
            textDecoration: 'line-through',
            opacity: 0.7,
        },
        taskTime: {
            fontSize: '14px',
            opacity: 0.95,
            fontWeight: '600',
            color: 'var(--color-primary-dark)',
        },
        manageBtn: {
            backgroundColor: 'white',
            color: 'var(--color-primary-dark)',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '15px',
            marginTop: '10px',
            width: 'fit-content',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        },
        secondaryCards: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 'var(--section-gap)',
            marginBottom: 'var(--section-gap)',
        },
        whiteCard: {
            backgroundColor: 'white',
            borderRadius: 'var(--card-radius-lg)',
            padding: 'var(--content-padding-y)',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        },
        quoteCard: {
            backgroundColor: 'rgba(234, 172, 139, 0.25)',
            borderRadius: 'var(--card-radius-lg)',
            padding: 'var(--content-padding-y)',
            border: '1px solid rgba(234, 172, 139, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 0,
            maxWidth: '100%',
        },
        quoteRow: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            position: 'relative',
            zIndex: 1,
            minWidth: 0,
        },
        quoteIconWrap: {
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            marginTop: '2px',
        },
        quoteText: {
            color: 'var(--color-primary)',
            fontSize: '16px',
            fontStyle: 'italic',
            lineHeight: '1.6',
            margin: 0,
            flex: 1,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
        },
        quoteLabel: {
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
        },
        inputArea: {
            backgroundColor: 'white',
            padding: 'var(--content-padding-y)',
            borderRadius: 'var(--card-radius)',
            boxShadow: 'var(--card-shadow)',
            marginTop: 'var(--section-gap)',
            marginBottom: 'var(--section-gap)',
            maxWidth: '100%',
            boxSizing: 'border-box',
        },
        input: {
            width: '100%',
            maxWidth: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            marginBottom: '10px',
            fontSize: '16px',
            boxSizing: 'border-box',
        }
    };

    return (
        <div style={styles.container}>
            {/* Header: saluto e impostazioni */}
            <div style={styles.header}>
                <div style={styles.greeting}>Ciao, {user.name || 'lol'}!</div>
                <Link to="/impostazioni" style={styles.settingsLink} aria-label="Impostazioni">
                    <Settings size={20} />
                </Link>
            </div>

            {/* Notification Alert */}
            {!notificationsEnabled && (
                <div style={{ margin: '0 0 20px 0', padding: '16px', backgroundColor: '#FFF4E5', border: '1px solid #FFE58F', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bell style={{ color: '#E67E22' }} size={24} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 'bold', color: '#856404', fontSize: '15px' }}>Avvisi Disattivati</div>
                    </div>
                </div>
            )}

            {/* Operatore sanitario: solo ClinicalDashboard (niente Pillola, niente Agenda) */}
            {isHealthcare && (
                <div className="last-scroll-block">
                    <ClinicalDashboard />
                </div>
            )}

            {/* Paziente / Caregiver: Pillola, Agenda, Stato del Paziente */}
            {!isHealthcare && (
            <>
            {/* Agenda di Oggi: data + calendario e attività */}
            <div style={styles.agendaCard}>
                <div style={styles.agendaDateRow}>
                    <Calendar size={20} />
                    <span>{new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div style={styles.cardTitle}>
                    <CheckCircle2 size={24} />
                    <span>Agenda di Oggi</span>
                </div>

                <AnimatePresence mode="popLayout">
                {[...tasks]
                  .filter(t => !t.completed || showManage)
                  .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
                  .map((task, i) => (
                    <motion.div 
                        key={task.id} 
                        layout={!reduceMotion}
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : i * 0.03 }}
                        className="agenda-item-row"
                        style={styles.taskItem}
                        onClick={() => toggleTask(task.id)}
                    >
                        <div className="agenda-item-left" style={styles.taskLeft}>
                            <div className="plus-icon-container" style={styles.taskIcon}>
                                {task.completed ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                            </div>
                            <span style={{
                                ...styles.taskText,
                                ...(task.completed ? styles.completedText : {})
                            }}>
                                {task.text}
                            </span>
                        </div>
                        <div style={styles.taskTime}>{task.time || '--:--'}</div>
                        {showManage && (
                            <Trash2 
                                size={18} 
                                color="#fff" 
                                style={{ marginLeft: '10px' }} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(task.id);
                                }} 
                            />
                        )}
                    </motion.div>
                ))}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <div 
                        style={styles.manageBtn} 
                        onClick={() => setShowManage(!showManage)}
                    >
                        {showManage ? "Salva Modifiche" : "Gestisci Attività"}
                    </div>
                </div>
            </div>

            {/* Add Task Area */}
            <AnimatePresence>
            {showManage && (
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? false : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    style={styles.inputArea}
                >
                    <h4 style={{ margin: '0 0 10px 0' }}>Nuova Attività</h4>
                    <input
                        style={styles.input}
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Cosa devi fare?"
                    />
                    <input
                        type="time"
                        style={styles.input}
                        value={newTaskTime}
                        onChange={(e) => setNewTaskTime(e.target.value)}
                    />
                    <button 
                        style={{ ...styles.manageBtn, backgroundColor: 'var(--color-primary)', color: 'white', width: '100%', marginTop: '10px' }}
                        onClick={addTask}
                    >
                        Aggiungi
                    </button>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Secondary Cards Row (ultimo blocco: padding-bottom su mobile per superare la navbar) */}
            <div className="last-scroll-block" style={styles.secondaryCards}>
                {/* Mood Card: setMood = handleMoodSelect (salva umore + aggiorna resoconto) */}
                <motion.div
                    style={{ ...styles.whiteCard, pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.1 }}
                >
                    <MoodTracker
                        userRole={user.role}
                        mood={currentMood}
                        setMood={handleMoodSelect}
                        moodToast={moodToast}
                        reduceMotion={!!reduceMotion}
                    />
                </motion.div>

                {/* Pillola di Benessere: frase del giorno + icona per categoria (responsive su mobile) */}
                <motion.div 
                    className="quote-card-responsive"
                    style={styles.quoteCard}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.15 }}
                >
                    <span style={styles.quoteLabel}>Pillola di Benessere</span>
                    <div style={styles.quoteRow}>
                        {dailyQuoteData && (() => {
                            const IconComponent = categoryIcons[dailyQuoteData.category] || Heart;
                            return (
                                <span style={styles.quoteIconWrap} aria-hidden>
                                    <IconComponent size={24} color={QUOTE_ICON_COLOR} />
                                </span>
                            );
                        })()}
                        <p className="quote-text-responsive" style={styles.quoteText}>
                            "{dailyQuoteData?.text ?? ''}"
                        </p>
                    </div>
                </motion.div>
            </div>
            </>
            )}
        </div>
    );
};

export default ListPage;
