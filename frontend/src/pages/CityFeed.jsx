import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { MapPin, Heart, MessageCircle, Share2, Send, X, Globe, TrendingUp } from 'lucide-react';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
  return Math.floor(diff / 86400000) + ' days ago';
}

export default function CityFeed() {
  const { user } = useAuth();
  const { cityPosts, addCityPost, toggleLike, addComment } = useAppData();

  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const handlePost = () => {
    if (!postText.trim()) return;
    addCityPost({
      author: user.name,
      initials: user.name.split(' ').map(n => n[0]).join(''),
      society: user.society,
      city: user.city,
      content: postText
    });
    setPostText('');
    setShowPostModal(false);
  };

  const handleLike = (postId) => toggleLike(postId, user.id, 'city');

  const handleComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, { author: user.name, text }, 'city');
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="header-avatar" style={{ background: '#1565C0' }}><Globe size={20} /></div>
          <div>
            <div className="header-title">{user?.city} City Feed</div>
            <div className="header-location"><TrendingUp size={12} /> Open community for all {user?.city} residents</div>
          </div>
        </div>
      </div>

      {/* Post Composer */}
      <div style={{ padding: '12px 16px', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="post-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>{user?.name?.charAt(0)}</div>
        <button onClick={() => setShowPostModal(true)} style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-dark)', background: 'var(--bg)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)' }}>
          What's happening in {user?.city}?
        </button>
      </div>

      {/* City Posts */}
      <div className="section-header">
        <span className="section-title">🌆 {user?.city} Feed</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cityPosts.length} posts</span>
      </div>

      {cityPosts.map(post => {
        const isLiked = post.likes.includes(user.id);
        const showComments = expandedComments[post.id];
        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">{post.initials}</div>
              <div className="post-meta">
                <div className="post-author">{post.author}
                  <span className="badge badge-green" style={{ marginLeft: 8, fontSize: '0.65rem' }}>{post.society}</span>
                </div>
                <div className="post-location-time"><MapPin size={11} /> {post.city} · {timeAgo(post.time)}</div>
              </div>
            </div>
            <div className="post-body">{post.content}</div>
            <div className="post-actions">
              <button className="post-action" onClick={() => handleLike(post.id)} style={isLiked ? { color: 'var(--danger)' } : {}}>
                <Heart size={16} fill={isLiked ? 'var(--danger)' : 'none'} /> {post.likes.length}
              </button>
              <button className="post-action" onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}>
                <MessageCircle size={16} /> {post.comments.length}
              </button>
              <button className="post-action" style={{ marginLeft: 'auto' }}><Share2 size={16} /></button>
            </div>

            {showComments && (
              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>{c.author.charAt(0)}</div>
                    <div>
                      <span style={{ fontWeight: 600 }}>{c.author}</span>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>{c.text}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input type="text" placeholder="Write a comment..." value={commentInputs[post.id] || ''} onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-dark)', fontSize: '0.85rem', fontFamily: 'var(--font)', outline: 'none' }}
                  />
                  <button onClick={() => handleComment(post.id)} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Post Modal */}
      {showPostModal && (
        <div className="sos-overlay" onClick={() => setShowPostModal(false)}>
          <div className="sos-modal" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid #1565C0', textAlign: 'left' }}>
            <button onClick={() => setShowPostModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="var(--text-muted)" /></button>
            <h3 style={{ marginBottom: '4px' }}>New City Post</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Visible to everyone in {user.city}</p>
            <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder={`What's happening in ${user.city}?`} rows={4} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', marginBottom: '12px' }} autoFocus />
            <button onClick={handlePost} className="btn btn-primary" style={{ background: '#1565C0' }} disabled={!postText.trim()}>Post to {user.city} Feed</button>
          </div>
        </div>
      )}
    </div>
  );
}
