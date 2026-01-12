import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
    };

    useEffect(() => {
        window.addEventListener('resize', scrollToBottom);
        if (!loading) {
            scrollToBottom();
        }
        return () => window.removeEventListener('resize', scrollToBottom);
    }, [messages, loading]);

    // Recupera utente corrente
    const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{"name":"Utente"}');
    const currentUserId = user.name + (user.surname || '');

    // Carica messaggi e setup Realtime
    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel('messages')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const msg = payload.new;
                    setMessages(prev => {
                        if (prev.find(m => m.id === msg.id)) return prev;
                        return [...prev, {
                            id: msg.id,
                            text: msg.text,
                            sender: msg.sender_id === currentUserId ? 'me' : 'other',
                            senderName: msg.sender_name,
                            time: new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                        }];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId]);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (!error && data) {
                setMessages(data.map(msg => ({
                    id: msg.id,
                    text: msg.text,
                    sender: msg.sender_id === currentUserId ? 'me' : 'other',
                    senderName: msg.sender_name,
                    time: new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                })));
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert([{
                text: inputText,
                sender_name: user.name + ' ' + (user.surname || ''),
                sender_id: currentUserId
            }]);

        if (error) {
            alert("Errore invio: " + error.message);
        } else {
            setInputText("");
        }
    };

    // Stili ottimizzati per Mobile Keyboard
    const styles = {
        wrapper: {
            height: '100dvh', // Usa altezza viewport dinamica
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-bg-primary)',
            overflow: 'hidden' // Impedisce scroll del body
        },
        messageList: {
            flex: 1, // Occupa tutto lo spazio disponibile
            overflowY: 'auto', // Scrolla internamente se necessario
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            scrollBehavior: 'smooth'
        },
        messageBubble: (sender) => ({
            maxWidth: '85%',
            padding: '12px 16px',
            borderRadius: '18px',
            backgroundColor: sender === 'me' ? 'var(--color-primary)' : 'white',
            color: sender === 'me' ? 'white' : 'var(--color-text-primary)',
            alignSelf: sender === 'me' ? 'flex-end' : 'flex-start',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            borderBottomRightRadius: sender === 'me' ? '4px' : '18px',
            borderBottomLeftRadius: sender === 'me' ? '18px' : '4px',
            wordBreak: 'break-word'
        }),
        messageText: { fontSize: '15px', lineHeight: '1.4' },
        messageTime: (sender) => ({
            fontSize: '10px',
            color: sender === 'me' ? 'rgba(255,255,255,0.7)' : '#999',
            textAlign: 'right',
            marginTop: '4px',
        }),
        // Input area NON più fixed, ma parte del flex layout
        inputArea: {
            flexShrink: 0, // Non si riduce mai
            padding: '12px 16px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid #eee',
            // Padding extra per distanziare dalla TabBar (se presente) o dal bordo inferiore
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', 
            marginBottom: '60px' // Spazio per la TabBar fissa (che ha z-index alto)
        },
        input: {
            flex: 1,
            padding: '12px 20px',
            borderRadius: '24px',
            border: '1px solid #E4E6EB',
            backgroundColor: '#F0F2F5',
            fontSize: '15px',
            outline: 'none',
        },
        sendButton: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer'
        }
    };

    if (loading) {
        return <div style={{display:'flex', justifyContent:'center', padding:'20px', color:'var(--color-primary)'}}>Caricamento chat...</div>;
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.messageList}>
                {messages.length === 0 ? (
                    <div style={{textAlign:'center', color:'#888', marginTop: '20px', fontSize: '14px'}}>La chat è vuota.</div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} style={styles.messageBubble(msg.sender)}>
                            {msg.sender === 'other' && (
                                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '2px' }}>
                                    {msg.senderName}
                                </div>
                            )}
                            <div style={styles.messageText}>{msg.text}</div>
                            <div style={styles.messageTime(msg.sender)}>{msg.time}</div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Scrivi qui..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={scrollToBottom} // Scrolla quando si apre la tastiera
                />
                <button style={styles.sendButton} onClick={handleSend}>
                    <Send size={18} fill="white" />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
