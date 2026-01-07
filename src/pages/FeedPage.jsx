import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Share2, Image as ImageIcon, ThumbsUp, Send, X, MoreHorizontal, Edit2, Check, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostText, setNewPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [dbWorking, setDbWorking] = useState(true);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editingText, setEditingText] = useState('');
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
                    { event: '*', schema: 'public', table: 'posts' },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setPosts(prev => [payload.new, ...prev]);
                        } else if (payload.eventType === 'UPDATE') {
                            setPosts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
                        } else if (payload.eventType === 'DELETE') {
                            setPosts(prev => prev.filter(p => p.id !== payload.old.id));
                        }
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
            image: selectedImage
        };

        setPosts(prev => [newPostObj, ...prev]);
        setNewPostText('');
        setSelectedImage(null);

        try {
            const { error } = await supabase
                .from('posts')
                .insert([newPostObj]);
            if (error) console.error("Error saving to DB");
        } catch (e) {
            console.error("DB Error");
        }
    };

    const startEditing = (post) => {
        setEditingPostId(post.id);
        setEditingText(post.text);
    };

    const cancelEditing = () => {
        setEditingPostId(null);
        setEditingText('');
    };

    const saveEdit = async (postId) => {
        if (!editingText.trim()) return;

        // Update locale
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, text: editingText } : p));
        setEditingPostId(null);

        try {
            const { error } = await supabase
                .from('posts')
                .update({ text: editingText })
                .eq('id', postId);
            
            if (error) console.error("Error updating DB");
        } catch (e) {
             console.error("DB Error");
        }
    };

    const deletePost = async (postId) => {
        if (!window.confirm("Vuoi davvero eliminare questo post?")) return;

        setPosts(prev => prev.filter(p => p.id !== postId));

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);
            if (error) console.error("Error deleting from DB");
        } catch (e) {
            console.error("DB Error");
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
            justifyContent: 'space-between'
        },
        authorInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
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
        editArea: {
            padding: '0 16px',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        editInput: {
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--color-primary)',
            fontSize: '16px',
            outline: 'none'
        },
        editActions: {
            display: 'flex',
            gap: '8px'
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
        },
        iconBtn: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#65676B',
            padding: '4px'
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
                        <div style={styles.authorInfo}>
                            <div style={styles.avatarSmall}>{post.author?.[0] || 'U'}</div>
                            <div>
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
                        
                        {/* Tasto Modifica solo per i post (simulando che siano i suoi) */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button style={styles.iconBtn} onClick={() => startEditing(post)} title="Modifica">
                                <Edit2 size={18} />
                            </button>
                            <button style={{ ...styles.iconBtn, color: '#FF3B30' }} onClick={() => deletePost(post.id)} title="Elimina">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {editingPostId === post.id ? (
                        <div style={styles.editArea}>
                            <textarea
                                style={styles.editInput}
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                rows={3}
                            />
                            <div style={styles.editActions}>
                                <button 
                                    style={{ ...styles.actionBtn, backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px' }}
                                    onClick={() => saveEdit(post.id)}
                                >
                                    <Check size={16} /> Salva
                                </button>
                                <button 
                                    style={{ ...styles.actionBtn, backgroundColor: '#eee', padding: '4px 12px' }}
                                    onClick={cancelEditing}
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                    ) : (
                        post.text && <div style={styles.postText}>{post.text}</div>
                    )}
                    
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
