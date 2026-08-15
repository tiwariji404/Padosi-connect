import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, ChevronRight, User, Users, Newspaper, PhoneCall, FileText, Bell, Settings, MessageCircle, LogOut, Edit3, X, CheckCircle2, Building2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editSaved, setEditSaved] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleSave = () => {
    updateProfile({ name: editName, bio: editBio });
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); setShowEdit(false); }, 1500);
  };

  const menuItems = [
    { icon: <User size={18} />, label: 'Account', bg: '#E8F5E9', color: '#2E7D32' },
    { icon: <Users size={18} />, label: 'Household members', bg: '#E3F2FD', color: '#1565C0' },
    { icon: <Newspaper size={18} />, label: 'News, voting & polls', bg: '#FFF8E1', color: '#F9A825' },
    { icon: <PhoneCall size={18} />, label: 'Emergency contacts', bg: '#FFEBEE', color: '#C62828' },
    { icon: <FileText size={18} />, label: 'Rules & docs', bg: '#EDE7F6', color: '#4527A0' },
    { icon: <Bell size={18} />, label: 'Notifications', bg: '#FFF3E0', color: '#E65100', action: () => navigate('/notifications') },
    { icon: <Settings size={18} />, label: 'Settings', bg: '#E0F2F1', color: '#00695C' },
    { icon: <MessageCircle size={18} />, label: 'Feedback', bg: '#F3E5F5', color: '#6A1B9A' },
  ];

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="profile-name">{user?.name}</div>
        <div className="profile-location"><MapPin size={14} /> {user?.city}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '4px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <Building2 size={13} /> {user?.society}
        </div>
        {user?.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '260px', margin: '8px auto 0' }}>{user.bio}</p>}

        <div className="profile-stats">
          <div className="stat-item"><div className="stat-value">98</div><div className="stat-label">Connections</div></div>
          <div className="stat-item"><div className="stat-value">5</div><div className="stat-label">Groups</div></div>
          <div className="stat-item"><div className="stat-value">12</div><div className="stat-label">Posts</div></div>
        </div>

        <button className="btn btn-outline btn-sm" style={{ margin: '8px auto 0', display: 'flex' }} onClick={() => { setEditName(user?.name || ''); setEditBio(user?.bio || ''); setShowEdit(true); }}>
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <div className="divider" />
      <div className="profile-menu">
        {menuItems.map((item, i) => (
          <button key={i} className="profile-menu-item" onClick={item.action || undefined}>
            <div className="menu-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
            <span>{item.label}</span>
            <ChevronRight size={16} className="arrow" />
          </button>
        ))}
      </div>

      <div className="divider" />
      <div className="profile-menu">
        <button className="profile-menu-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <div className="menu-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}><LogOut size={18} /></div>
          <span style={{ fontWeight: 600 }}>Log out</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="sos-overlay" onClick={() => setShowEdit(false)}>
          <div className="sos-modal" onClick={e => e.stopPropagation()} style={{ borderTop: '6px solid var(--primary)', textAlign: 'left' }}>
            <button onClick={() => setShowEdit(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="var(--text-muted)" /></button>
            <h3 style={{ marginBottom: '16px' }}>Edit Profile</h3>

            <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', marginBottom: '12px' }} />

            <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Bio</label>
            <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.95rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', marginBottom: '14px' }} />

            {editSaved ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)', fontWeight: 600 }}>
                <CheckCircle2 size={20} /> Profile Updated!
              </div>
            ) : (
              <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
