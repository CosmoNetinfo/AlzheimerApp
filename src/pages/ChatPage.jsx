import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [viewportHeight, setViewportHeight] = useState(window.visualViewport ? window.visualViewport.height : window.innerHeight);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    // Gestione altezza dinamica e rilevamento tastiera
    useEffect(() => {
        const handleResize = () => {
             // L'altezza visuale corrente
            const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            setViewportHeight(currentHeight);
            
            // Se l'altezza disponibile è significativamente minore dell'altezza dello schermo, la tastiera è aperta
            // (Usiamo una soglia di 150px che è meno di qualsiasi tastiera virtuale)
            const screenHeight = window.screen.height;
            // Nota: su mobile window.innerHeight cambia, window.screen.height no
            // Se la differenza è grande (> 20%), probabile tastiera
            if (currentHeight < window.outerHeight * 0.75) {
                setIsKeyboardOpen(true);
            } else {
                setIsKeyboardOpen(false);
            }
            
            // Scrolla in basso quando cambia l'altezza (es. tastiera si apre)
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            }, 100);
        };

        // Ascolta sia resize standard che visualViewport (più preciso su mobile moderni)
        window.visualViewport?.addEventListener('resize', handleResize);
        window.addEventListener('resize', handleResize);
        
        // Initial check
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!loading) scrollToBottom();
    }, [messages, loading]);

    const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{"name":"Utente"}');
    const currentUserId = user.id || (user.name + (user.surname || ''));

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
        return () => { supabase.removeChannel(channel); };
    }, [currentUserId]);

    const fetchMessages = async () => {
        try {
            const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
            if (data) {
                setMessages(data.map(msg => ({
                    id: msg.id,
                    text: msg.text,
                    sender: msg.sender_id === currentUserId ? 'me' : 'other',
                    senderName: msg.sender_name,
                    time: new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                })));
            }
        } catch (e) {}
        setLoading(false);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const textToSend = inputText;
        setInputText(""); 

        const { error } = await supabase.from('messages').insert([{
            text: textToSend,
            sender_name: user.name + ' ' + (user.surname || ''),
            sender_id: currentUserId
        }]);

        if (error) {
            setInputText(textToSend);
            alert("Errore invio");
        } else {
            // Force scroll after send
            setTimeout(scrollToBottom, 50);
        }
    };

    const styles = {
        // Container principale: forzato a occupare ESATTAMENTE l'altezza visibile
        container: {
            height: isKeyboardOpen ? `${viewportHeight}px` : `calc(${viewportHeight}px - 60px)`, // Togli 60px se c'è l'header
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-bg-primary)',
            position: 'fixed', 
            top: isKeyboardOpen ? 0 : '60px', // Se tastiera aperta, full screen. Se chiusa, sotto header
            left: 0,
            right: 0,
            overflow: 'hidden',
            zIndex: 900
        },
        messageList: {
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingBottom: '20px'
        },
        inputArea: {
            flexShrink: 0, 
            padding: '10px 16px',
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            // LOGICA CRUCIALE AGGIORNATA: 
            // - Tastiera APERTA: padding 0 (attaccato)
            // - Tastiera CHIUSA: padding 80px (60px TabBar + 20px spazio) per non finire sotto i menu
            paddingBottom: isKeyboardOpen ? '10px' : 'calc(85px + env(safe-area-inset-bottom))',
            transition: 'padding-bottom 0.2s ease-out' 
        },
        input: {
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid #ccc',
            fontSize: '16px',
            outline: 'none',
            backgroundColor: '#f9f9f9',
            minHeight: '44px'
        },
        sendButton: {
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0
        },
        bubble: (sender) => ({
            maxWidth: '80%',
            padding: '10px 14px',
            borderRadius: '16px',
            backgroundColor: sender === 'me' ? 'var(--color-primary)' : 'white',
            color: sender === 'me' ? 'white' : 'black',
            alignSelf: sender === 'me' ? 'flex-end' : 'flex-start',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            borderBottomRightRadius: sender === 'me' ? '4px' : '16px',
            borderBottomLeftRadius: sender === 'me' ? '16px' : '4px'
        })
    };

    if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'20px'}}>Caricamento...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.messageList}>
                 {messages.length === 0 && <div style={{textAlign:'center', color:'#999', marginTop:'30%'}}>Nessun messaggio</div>}
                 {messages.map(msg => (
                    <div key={msg.id} style={styles.bubble(msg.sender)}>
                        {msg.sender === 'other' && <div style={{fontSize:'12px', fontWeight:'700', color:'var(--color-primary)', marginBottom:'2px'}}>{msg.senderName}</div>}
                        <div style={{wordBreak:'break-word'}}>{msg.text}</div>
                        <div style={{fontSize:'10px', opacity:0.7, textAlign:'right', marginTop:'2px'}}>{msg.time}</div>
                    </div>
                 ))}
                 <div ref={messagesEndRef} />
            </div>
            
            <div style={styles.inputArea}>
                <input 
                    style={styles.input}
                    placeholder="Scrivi..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button style={styles.sendButton} onClick={handleSend}><Send size={20}/></button>
            </div>
        </div>
    );
};

export default ChatPage;
