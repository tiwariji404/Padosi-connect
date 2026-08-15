import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { Bell, MessageSquare, MapPin, Plus, Users, ClipboardCheck, AlertTriangle, Heart, MessageCircle, Share2, Send, X, Megaphone, HelpCircle, PartyPopper, Pin, CheckCircle2 } from 'lucide-react';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
  return Math.floor(diff / 86400000) + ' days ago';
}

export default function HomePage() {
  const { user } = useAuth();
  const { societyPosts, addSocietyPost, toggleLike, addComment, unreadCount, checkIn, createGroup, notifications } = useAppData();
  const navigate = useNavigate();

  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [showCheckinToast, setShowCheckinToast] = useState(false);

  const myPosts = societyPosts.filter(p => p.society === user?.society);

  const handlePost = () => {
    if (!postText.trim()) return;
    addSocietyPost({
      author: user.name,
      initials: user.name.split(' ').map(n => n[0]).join(''),
      society: user.society,
      city: user.city,
      content: postText
    });
    setPostText('');
    setShowPostModal(false);
  };

  const handleLike = (postId) => toggleLike(postId, user.id, 'society');

  const handleComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, { author: user.name, text }, 'society');
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCheckIn = () => {
    checkIn(user.id, user.name, user.society);
    setCheckedIn(true);
    setShowCheckinToast(true);
    setTimeout(() => setShowCheckinToast(false), 3000);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const gid = createGroup({ name: newGroupName, desc: newGroupDesc, type: 'society', society: user.society, creatorName: user.name });
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateGroup(false);
    navigate(`/chat/${gid}`);
  };

  const handleSOS = () => {
    window.dispatchEvent(new CustomEvent('trigger-sos', {
      detail: { groupName: user.society, senderName: user.name, location: `${user.society}, ${user.city}` }
    }));
  };

  const updates = [
    { id: 1, icon: <Megaphone size={18} />, title: 'Society Meeting', desc: 'Monthly meeting Saturday at 5 PM in community hall.', color: 'var(--primary)' },
    { id: 2, icon: <HelpCircle size={18} />, title: 'Help Request', desc: 'Mrs. Sharma needs help with groceries this evening.', color: '#F9A825' },
    { id: 3, icon: <PartyPopper size={18} />, title: 'Diwali Planning', desc: 'Decoration committee meeting tomorrow at 7 PM.', color: '#E53935' },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="header-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div className="header-title">{user?.society}</div>
            <div className="header-location"><MapPin size={12} /> {user?.city}</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-icon notification-dot" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
            <Bell size={22} />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '2px solid white' }} />}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn qa-primary" onClick={() => setShowCreateGroup(true)}>
          <Plus size={16} /> Create Group
        </button>
        <button className="quick-action-btn qa-outline" onClick={() => navigate('/chat')}>
          <Users size={16} /> Join Group
        </button>
        <button className="quick-action-btn qa-outline" onClick={handleCheckIn} disabled={checkedIn} style={checkedIn ? { opacity: 0.6 } : {}}>
          <ClipboardCheck size={16} /> {checkedIn ? 'Checked In ✓' : 'CheckIn'}
        </button>
        <button className="quick-action-btn qa-danger" onClick={handleSOS}>
          <AlertTriangle size={16} /> SOS
        </button>
      </div>

      {/* CheckIn Toast */}
      {showCheckinToast && (
        <div style={{ margin: '0 16px 10px', padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.3s ease', border: '1px solid var(--primary)' }}>
          <CheckCircle2 size={20} color="var(--primary)" />
          <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>Checked in at {user.society}!</span>
        </div>
      )}

      {/* Recent Updates */}
      <div className="section-header">
        <span className="section-title">📌 Notices</span>
      </div>
      {updates.map(u => (
        <div key={u.id} className="update-card">
          <div className="update-icon" style={{ background: u.color }}>{u.icon}</div>
          <div className="update-content">
            <div className="update-title">{u.title}</div>
            <div className="update-desc">{u.desc}</div>
          </div>
        </div>
      ))}

      {/* Post Composer */}
      <div style={{ padding: '12px 16px', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
        <div className="post-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>{user?.name?.charAt(0)}</div>
        <button onClick={() => setShowPostModal(true)} style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-dark)', background: 'var(--bg)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)' }}>
          Share update with your society...
        </button>
      </div>

      {/* Society Feed */}
      <div className="section-header">
        <span className="section-title">Society Feed</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{myPosts.length} posts</span>
      </div>

      {myPosts.map(post => {
        const isLiked = post.likes.includes(user.id);
        const showComments = expandedComments[post.id];
        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">{post.initials}</div>
              <div className="post-meta">
                <div className="post-author">{post.author} {post.isPinned && <Pin size={12} style={{ color: 'var(--primary)', marginLeft: 4 }} />}</div>
                <div className="post-location-time"><MapPin size={11} /> {post.society} · {timeAgo(post.time)}</div>
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

            {/* Comments Section */}
            {showComments && (
              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>{c.author.charAt(0)}</div>
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
          <div className="sos-modal" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid var(--primary)', textAlign: 'left' }}>
            <button onClick={() => setShowPostModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="var(--text-muted)" /></button>
            <h3 style={{ marginBottom: '4px' }}>New Society Post</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Visible to all members of {user.society}</p>
            <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="What's happening in your society?" rows={4} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', marginBottom: '12px' }} autoFocus />
            <button onClick={handlePost} className="btn btn-primary" disabled={!postText.trim()}>Post to Society</button>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="sos-overlay" onClick={() => setShowCreateGroup(false)}>
          <div className="sos-modal" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid var(--primary)', textAlign: 'left' }}>
            <button onClick={() => setShowCreateGroup(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="var(--text-muted)" /></button>
            <h3 style={{ marginBottom: '4px' }}>Create New Group</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>For members of {user.society}</p>
            <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group name" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', marginBottom: '10px' }} autoFocus />
            <textarea value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Description (optional)" rows={2} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', marginBottom: '12px' }} />
            <button onClick={handleCreateGroup} className="btn btn-primary" disabled={!newGroupName.trim()}>Create Group</button>
          </div>
        </div>
      )}
    </div>
  );
}
