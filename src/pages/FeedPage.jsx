import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Image as ImageIcon, ThumbsUp, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostText, setNewPostText] = useState('');
    const [dbWorking, setDbWorking] = useState(true);

    const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{"name":"Utente"}');

    // Dati di esempio se il DB non risponde o è vuoto
    const mockPosts = [
        {
            id: 'm1',
            author: 'Maria Rossi',
            text: 'Oggi ho fatto una bellissima passeggiata al parco. Il sole era caldissimo! ☀️',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            likes: 12,
            hasPhoto: true
        },
        {
            id: 'm2',
            author: 'Giovanni Bianchi',
            text: 'Qualcuno sa quando sarà la prossima festa in centro? Mi piacerebbe molto andare.',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            likes: 5,
            hasPhoto: false
        }
    ];

    useEffect(() => {
        fetchPosts();

        // Subscribe a nuovi post in tempo reale (se supabase è configurato)
        let channel;
        try {
            channel = supabase
                .channel('posts')
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'posts' },
                    (payload) => {
                        setPosts(prev => [payload.new, ...prev]);
                    }
                )
                .subscribe();
        } catch (e) {
            console.warn("Supabase Realtime not available");
        }

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                setPosts(mockPosts);
                if (error) setDbWorking(false);
            } else {
                setPosts(data);
                setDbWorking(true);
            }
        } catch (e) {
            setPosts(mockPosts);
            setDbWorking(false);
        }
        setLoading(false);
    };

    const createPost = async () => {
        if (!newPostText.trim()) return;

        const newPostObj = {
            author: user.name + ' ' + (user.surname || ''),
            text: newPostText,
            likes: 0,
            created_at: new Date().toISOString()
        };

        // Ottimistico: aggiungiamo subito alla lista locale
        setPosts(prev => [newPostObj, ...prev]);
        setNewPostText('');

        try {
            const { error } = await supabase
                .from('posts')
                .insert([newPostObj]);
            
            if (error) console.error("Error saving to DB, kept locally");
        } catch (e) {
            console.error("DB Error");
        }
    };

    const styles = {
        container: {
            backgroundColor: '#F0F2F5', // Facebook Light Gray
            minHeight: '100%',
            padding: '12px 0 100px 0',
        },
        createPostCard: {
            backgroundColor: '#fff',
            margin: '0 12px 16px 12px',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        },
        inputRow: {
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid #E4E6EB',
            paddingBottom: '12px',
        },
        avatarSmall: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px',
            flexShrink: 0
        },
        input: {
            flex: 1,
            backgroundColor: '#F0F2F5',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 16px',
            fontSize: '16px',
            outline: 'none',
        },
        actionRow: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        actionBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#65676B',
            fontWeight: '600',
            fontSize: '14px',
            background: 'none',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
        },
        postCard: {
            backgroundColor: '#fff',
            marginBottom: '12px',
            padding: '12px 16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        },
        postHeader: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
        },
        authorInfo: {
            marginLeft: '12px',
        },
        authorName: {
            fontWeight: '700',
            fontSize: '16px',
            color: '#050505',
        },
        postTime: {
            fontSize: '13px',
            color: '#65676B',
        },
        postText: {
            fontSize: '17px',
            lineHeight: '1.4',
            marginBottom: '12px',
            color: '#050505',
        },
        postImagePlaceholder: {
            width: '100%',
            height: '240px',
            backgroundColor: '#F0F2F5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            color: '#B0B3B8'
        },
        postStats: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderTop: '1px solid #E4E6EB',
            color: '#65676B',
            fontSize: '14px',
        },
        postActions: {
            display: 'flex',
            borderTop: '1px solid #E4E6EB',
            paddingtop: '4px',
        },
        postActionBtn: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            color: '#65676B',
            fontWeight: '600',
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    if (loading) {
        return (
            <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Caricamento bacheca...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Box Creazione Post */}
            <div style={styles.createPostCard}>
                <div style={styles.inputRow}>
                    <div style={styles.avatarSmall}>{user.name[0]}</div>
                    <input
                        style={styles.input}
                        placeholder={`A cosa stai pensando, ${user.name}?`}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createPost()}
                    />
                </div>
                <div style={styles.actionRow}>
                    <button style={styles.actionBtn}>
                        <ImageIcon color="#45BD62" size={20} /> Foto
                    </button>
                    <button 
                        style={{ ...styles.actionBtn, color: 'white', backgroundColor: 'var(--color-primary)', padding: '6px 16px', borderRadius: '20px' }}
                        onClick={createPost}
                    >
                        <Send size={16} /> Pubblica
                    </button>
                </div>
            </div>

            {/* Feed dei Post */}
            {posts.map((post, index) => (
                <div key={post.id || index} style={styles.postCard}>
                    <div style={styles.postHeader}>
                        <div style={styles.avatarSmall}>{post.author[0]}</div>
                        <div style={styles.authorInfo}>
                            <div style={styles.authorName}>{post.author}</div>
                            <div style={styles.postTime}>
                                {new Date(post.created_at).toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div style={styles.postText}>{post.text}</div>
                    
                    {post.hasPhoto && (
                        <div style={styles.postImagePlaceholder}>
                             <ImageIcon size={48} />
                        </div>
                    )}

                    <div style={styles.postStats}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ThumbsUp size={16} fill="#1877F2" color="#1877F2" /> {post.likes}
                        </div>
                        <div>3 commenti</div>
                    </div>

                    <div style={styles.postActions}>
                        <button style={styles.postActionBtn}>
                            <ThumbsUp size={20} /> Mi piace
                        </button>
                        <button style={styles.postActionBtn}>
                            <MessageSquare size={20} /> Commenta
                        </button>
                        <button style={styles.postActionBtn}>
                            <Share2 size={20} /> Condividi
                        </button>
                    </div>
                </div>
            ))}

            {!dbWorking && (
                <div style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#999' }}>
                    Modalità offline - I post sono salvati solo sul tuo dispositivo.
                </div>
            )}
        </div>
    );
};

export default FeedPage;
