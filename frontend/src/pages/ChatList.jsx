import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { useAuth } from '../contexts/AuthContext';
import { Search, Users, Plus, Globe, Building2, X } from 'lucide-react';

export default function ChatList() {
  const { user } = useAuth();
  const { groups, createGroup } = useAppData();
  const navigate = useNavigate();
  const [tab, setTab] = useState('society');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('society');
  const [searchQuery, setSearchQuery] = useState('');

  const societyGroups = groups.filter(g => g.type === 'society');
  const cityGroups = groups.filter(g => g.type === 'city');
  const displayGroups = (tab === 'society' ? societyGroups : cityGroups).filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnreadSociety = societyGroups.reduce((s, g) => s + g.unread, 0);
  const totalUnreadCity = cityGroups.reduce((s, g) => s + g.unread, 0);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const gid = createGroup({
      name: newName,
      desc: newDesc,
      type: newType,
      society: newType === 'society' ? user.society : null,
      creatorName: user.name
    });
    setNewName(''); setNewDesc(''); setShowCreate(false);
    navigate(`/chat/${gid}`);
  };

  return (
    <div className="page">
      <div className="header">
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Chat</h1>
        <button className="btn-icon" onClick={() => setShowCreate(true)}>
          <Plus size={22} color="var(--primary)" />
        </button>
      </div>

      {/* Tabs */}
      <div className="chat-tabs">
        <button className={`chat-tab ${tab === 'society' ? 'active' : ''}`} onClick={() => setTab('society')}>
          <Building2 size={14} /> Society <span className="tab-count">{totalUnreadSociety}</span>
        </button>
        <button className={`chat-tab ${tab === 'city' ? 'active' : ''}`} onClick={() => setTab('city')}>
          <Globe size={14} /> {user?.city} <span className="tab-count">{totalUnreadCity}</span>
        </button>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
        <input type="text" placeholder="Search groups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '40px' }} />
      </div>

      {/* Chats */}
      {displayGroups.length === 0 ? (
        <div className="empty-state">
          <Users size={40} className="empty-state-icon" />
          <p className="empty-state-text">No groups found. Create one!</p>
        </div>
      ) : displayGroups.map(chat => (
        <div key={chat.id} className="chat-list-item" onClick={() => navigate(`/chat/${chat.id}`)}>
          <div className="chat-avatar" style={{ background: chat.type === 'city' ? '#E3F2FD' : 'var(--primary-light)', color: chat.type === 'city' ? '#1565C0' : 'var(--primary)' }}>
            {chat.type === 'city' ? <Globe size={22} /> : <Users size={22} />}
          </div>
          <div className="chat-info">
            <div className="chat-top-row">
              <span className="chat-name">{chat.name}</span>
              <span className="chat-time">{chat.time}</span>
            </div>
            <div className="chat-bottom-row">
              <span className="chat-preview">{chat.lastMsg}</span>
              {chat.unread > 0 && <span className="chat-unread">{chat.unread}</span>}
            </div>
          </div>
        </div>
      ))}

      {/* Create Group Modal */}
      {showCreate && (
        <div className="sos-overlay" onClick={() => setShowCreate(false)}>
          <div className="sos-modal" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid var(--primary)', textAlign: 'left' }}>
            <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="var(--text-muted)" /></button>
            <h3 style={{ marginBottom: '12px' }}>Create New Group</h3>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button onClick={() => setNewType('society')} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: `2px solid ${newType === 'society' ? 'var(--primary)' : 'var(--border-dark)'}`, background: newType === 'society' ? 'var(--primary-light)' : 'var(--white)', color: newType === 'society' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '0.85rem' }}>
                <Building2 size={16} style={{ marginRight: 4 }} /> Society
              </button>
              <button onClick={() => setNewType('city')} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: `2px solid ${newType === 'city' ? '#1565C0' : 'var(--border-dark)'}`, background: newType === 'city' ? '#E3F2FD' : 'var(--white)', color: newType === 'city' ? '#1565C0' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '0.85rem' }}>
                <Globe size={16} style={{ marginRight: 4 }} /> {user?.city}
              </button>
            </div>

            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Group name" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', marginBottom: '10px' }} autoFocus />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" rows={2} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', marginBottom: '12px' }} />
            <button onClick={handleCreate} className="btn btn-primary" disabled={!newName.trim()}>Create Group</button>
          </div>
        </div>
      )}
    </div>
  );
}
