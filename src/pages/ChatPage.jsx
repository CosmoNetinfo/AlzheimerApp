import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);

    // Recupera utente corrente
    const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{}');
    const currentUserId = user.name || 'Guest';

    // Carica messaggi iniziali
    useEffect(() => {
        fetchMessages();

        // Subscribe a nuovi messaggi in tempo reale
        const channel = supabase
            .channel('messages')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    setMessages(prev => [...prev, {
                        id: payload.new.id,
                        text: payload.new.text,
                        sender: payload.new.sender_id === currentUserId ? 'me' : 'other',
                        senderName: payload.new.sender_name,
                        time: new Date(payload.new.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                    }]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId]);

    const fetchMessages = async () => {
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

        if (!error) {
            setInputText("");
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#EFE7DE', // WhatsApp-like bg
        },
        messageList: {
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        },
        messageBubble: (sender) => ({
            maxWidth: '80%',
            padding: '12px 16px',
            borderRadius: '16px',
            backgroundColor: sender === 'me' ? '#dcf8c6' : '#ffffff',
            alignSelf: sender === 'me' ? 'flex-end' : 'flex-start',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            position: 'relative',
        }),
        messageText: {
            fontSize: '17px',
            lineHeight: '1.4',
        },
        messageTime: {
            fontSize: '11px',
            color: '#999',
            textAlign: 'right',
            marginTop: '4px',
        },
        inputArea: {
            padding: '10px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid #ddd',
        },
        input: {
            flex: 1,
            padding: '12px',
            borderRadius: '24px',
            border: '1px solid #ddd',
            fontSize: '16px',
            outline: 'none',
        },
        sendButton: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#007aff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    };

    if (loading) {
        return <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
            <div>Caricamento chat...</div>
        </div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.messageList}>
                {messages.map(msg => (
                    <div key={msg.id} style={styles.messageBubble(msg.sender)}>
                        {msg.sender === 'other' && <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{msg.senderName}</div>}
                        <div style={styles.messageText}>{msg.text}</div>
                        <div style={styles.messageTime}>{msg.time}</div>
                    </div>
                ))}
            </div>
            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Scrivi un messaggio..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button style={styles.sendButton} onClick={handleSend}>
                    <Send size={24} />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
