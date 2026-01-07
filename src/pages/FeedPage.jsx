import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Share2, Image as ImageIcon, ThumbsUp, Send, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostText, setNewPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [dbWorking, setDbWorking] = useState(true);
    const fileInputRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('alzheimer_user') || '{"name":"Utente"}');

    // Dati di esempio
    const mockPosts = [
        {
            id: 'm1',
            author: 'Maria Rossi',
            text: 'Oggi ho fatto una bellissima passeggiata al parco. Il sole era caldissimo! ☀️',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            likes: 12,
            image: null
        },
        {
            id: 'm2',
            author: 'Giovanni Bianchi',
            text: 'Qualcuno sa quando sarà la prossima festa in centro? Mi piacerebbe molto andare.',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            likes: 5,
            image: null
        }
    ];

    useEffect(() => {
        fetchPosts();

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const createPost = async () => {
        if (!newPostText.trim() && !selectedImage) return;

        const newPostObj = {
            author: user.name + ' ' + (user.surname || ''),
            text: newPostText,
            likes: 0,
            created_at: new Date().toISOString(),
            image: selectedImage // Salviamo l'immagine come base64 nel DB per semplicità (attenzione ai limiti di dimensione)
        };

        // Ottimistico
        setPosts(prev => [newPostObj, ...prev]);
        setNewPostText('');
        setSelectedImage(null);

        try {
            const { error } = await supabase
                .from('posts')
                .insert([newPostObj]);
            
            if (error) {
                console.error("Error saving to DB, kept locally:", error);
                // Se l'errore è dovuto alla dimensione dell'immagine (base64 troppo lunga), 
                // in un'app reale useremmo Supabase Storage.
            }
        } catch (e) {
            console.error("DB Error:", e);
        }
    };

    const styles = {
        container: {
            backgroundColor: '#F0F2F5',
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
        previewContainer: {
            position: 'relative',
            margin: '10px 0',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #ddd'
        },
        previewImage: {
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            display: 'block'
        },
        removeImage: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '50%',
            padding: '4px',
            border: 'none',
            cursor: 'pointer'
        },
        actionRow: {
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #E4E6EB',
            paddingTop: '12px',
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
            padding: '12px 0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        },
        postHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
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
            padding: '0 16px',
            marginBottom: '12px',
            color: '#050505',
        },
        postImage: {
            width: '100%',
            maxHeight: '500px',
            objectFit: 'cover',
            marginBottom: '12px',
            backgroundColor: '#f0f2f5'
        },
        postStats: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 16px',
            color: '#65676B',
            fontSize: '14px',
        },
        postActions: {
            display: 'flex',
            borderTop: '1px solid #E4E6EB',
            margin: '0 16px',
            paddingTop: '4px',
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

                {selectedImage && (
                    <div style={styles.previewContainer}>
                        <img src={selectedImage} alt="Preview" style={styles.previewImage} />
                        <button style={styles.removeImage} onClick={() => setSelectedImage(null)}>
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div style={styles.actionRow}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button style={styles.actionBtn} onClick={() => fileInputRef.current.click()}>
                        <ImageIcon color="#45BD62" size={20} /> Foto
                    </button>
                    <button 
                        style={{ 
                            ...styles.actionBtn, 
                            color: 'white', 
                            backgroundColor: (newPostText.trim() || selectedImage) ? 'var(--color-primary)' : '#ccc', 
                            padding: '6px 16px', 
                            borderRadius: '20px',
                            cursor: (newPostText.trim() || selectedImage) ? 'pointer' : 'not-allowed'
                        }}
                        onClick={createPost}
                        disabled={!newPostText.trim() && !selectedImage}
                    >
                        <Send size={16} /> Pubblica
                    </button>
                </div>
            </div>

            {/* Feed dei Post */}
            {posts.map((post, index) => (
                <div key={post.id || index} style={styles.postCard}>
                    <div style={styles.postHeader}>
                        <div style={styles.avatarSmall}>{post.author?.[0] || 'U'}</div>
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
                    
                    {post.text && <div style={styles.postText}>{post.text}</div>}
                    
                    {post.image && (
                        <img src={post.image} alt="Post" style={styles.postImage} />
                    )}

                    <div style={styles.postStats}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ThumbsUp size={16} fill="#1877F2" color="#1877F2" /> {post.likes || 0}
                        </div>
                        <div>{Math.floor(Math.random() * 5)} commenti</div>
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
