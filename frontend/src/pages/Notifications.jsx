import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { ArrowLeft, Heart, MessageCircle, Users, Calendar, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

const iconMap = {
  like: <Heart size={18} color="#E53935" />,
  comment: <MessageCircle size={18} color="#1565C0" />,
  group: <Users size={18} color="var(--primary)" />,
  event: <Calendar size={18} color="#F9A825" />,
  sos: <AlertTriangle size={18} color="#E53935" />,
  checkin: <CheckCircle size={18} color="var(--primary)" />,
  post: <Bell size={18} color="var(--primary)" />,
};

export default function Notifications() {
  const { notifications, markAllRead } = useAppData();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Notifications</h1>
        </div>
        <button className="section-link" onClick={markAllRead}>Mark all read</button>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} className="empty-state-icon" />
          <p className="empty-state-text">No notifications yet</p>
        </div>
      ) : (
        notifications.map(n => (
          <div key={n.id} style={{
            display: 'flex', gap: '14px', alignItems: 'center',
            padding: '14px 16px',
            background: n.read ? 'var(--white)' : 'var(--primary-light)',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer'
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {iconMap[n.type] || <Bell size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
          </div>
        ))
      )}
    </div>
  );
}
