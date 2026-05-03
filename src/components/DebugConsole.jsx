import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DebugConsole = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        userId: 'Non loggato',
        lastSignal: 'Nessuno',
        authState: 'In controllo...',
        onlineProfiles: 0
    });

    const [errors, setErrors] = useState(() => JSON.parse(localStorage.getItem('debug_errors') || '[]'));

    useEffect(() => {
        const interval = setInterval(() => {
            const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{}');
            const lastActive = localStorage.getItem('last_active_signal');
            
            setStats(prev => ({
                ...prev,
                userId: user.id || 'Nessuno',
                lastSignal: lastActive ? new Date(parseInt(lastActive)).toLocaleTimeString() : 'Mai'
            }));
        }, 2000);

        const updateErrors = () => {
            setErrors(JSON.parse(localStorage.getItem('debug_errors') || '[]'));
        };

        window.addEventListener('debug_error_added', updateErrors);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setStats(prev => ({ ...prev, authState: event }));
        });

        return () => {
            clearInterval(interval);
            window.removeEventListener('debug_error_added', updateErrors);
            subscription.unsubscribe();
        };
    }, []);

    const toggle = () => setIsOpen(!isOpen);

    if (!isOpen) {
        return (
            <div 
                onClick={toggle}
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 9999,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
            >
                🪲
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '280px',
            maxHeight: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 9999,
            padding: '15px',
            fontFamily: 'monospace',
            fontSize: '12px',
            overflowY: 'auto',
            border: '2px solid var(--color-primary)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ color: 'var(--color-primary)' }}>MEMORA DEBUG</strong>
                <button onClick={toggle} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>❌</button>
            </div>
            
            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                <div><strong>User ID:</strong> {stats.userId.substring(0, 15)}...</div>
                <div><strong>Auth:</strong> {stats.authState}</div>
                <div><strong>Signal:</strong> {stats.lastSignal}</div>
            </div>

            {errors.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#ef4444' }}>🚨 ULTIMI ERRORI:</strong>
                    <div style={{ 
                        marginTop: '5px', 
                        maxHeight: '150px', 
                        overflowY: 'auto', 
                        backgroundColor: '#fef2f2', 
                        padding: '5px', 
                        borderRadius: '4px',
                        border: '1px solid #fee2e2'
                    }}>
                        {errors.map((err, i) => (
                            <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #fecaca', paddingBottom: '4px' }}>
                                <div style={{ color: '#b91c1c', fontWeight: 'bold' }}>[{err.time}] {err.type}</div>
                                <div style={{ color: '#4b5563', wordBreak: 'break-all' }}>{err.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                    onClick={() => {
                        const body = `LOG ERRORI MEMORA:\n\n${errors.map(e => `[${e.time}] ${e.type}: ${e.message}`).join('\n')}\n\nUser ID: ${stats.userId}`;
                        window.location.href = `mailto:admindany@gmail.com?subject=REPORT ERRORE MEMORA&body=${encodeURIComponent(body)}`;
                    }}
                    style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    📧 Invia Report a Admin
                </button>

                <button 
                    onClick={() => { localStorage.removeItem('debug_errors'); setErrors([]); }}
                    style={{ width: '100%', padding: '5px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Svuota Log Errori
                </button>

                <button 
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    style={{ width: '100%', marginTop: '5px', padding: '5px', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', color: '#b91c1c' }}
                >
                    Resetta Tutto (Cache)
                </button>
            </div>
        </div>
    );
};

export default DebugConsole;
