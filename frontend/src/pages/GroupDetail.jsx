import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { ArrowLeft, MessageCircle, Phone, AlertTriangle, Users, ChevronDown } from 'lucide-react';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups } = useAppData();

  const group = groups.find(g => g.id === id);
  if (!group) return (
    <div className="page">
      <div className="header">
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1 style={{ fontSize: '1.2rem' }}>Group not found</h1>
      </div>
    </div>
  );

  const handleSOS = () => {
    window.dispatchEvent(new CustomEvent('trigger-sos', {
      detail: { groupName: group.name, senderName: user?.name, location: `${user?.society}, ${user?.city}` }
    }));
  };

  return (
    <div className="page">
      {/* Cover */}
      <div className="group-cover">
        <button className="group-cover-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="var(--text-primary)" />
        </button>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <button className="group-cover-back"><ChevronDown size={20} color="var(--text-primary)" /></button>
        </div>
        <Users size={60} color="rgba(255,255,255,0.6)" />
      </div>

      {/* Info */}
      <div className="group-info-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="group-name">{group.name}</div>
            <div className="group-location">{group.society || user?.city}</div>
          </div>
          <span className="badge badge-green">✓ Member</span>
        </div>
        <div className="group-desc">{group.desc || 'A local community group.'}</div>
        <div className="group-meta">
          <span style={{ fontWeight: 600 }}>{group.members} Members</span>
          <span className="badge" style={{ background: group.type === 'city' ? '#E3F2FD' : 'var(--primary-light)', color: group.type === 'city' ? '#1565C0' : 'var(--primary)' }}>
            {group.type === 'city' ? '🌆 City Group' : '🏠 Society Group'}
          </span>
        </div>

        <div className="group-actions-row">
          <button className="group-action-btn gab-chat" onClick={() => navigate(`/chat/${id}`)}>
            <MessageCircle size={16} /> Chat
          </button>
          <button className="group-action-btn gab-call">
            <Phone size={16} /> Call
          </button>
          <button className="group-action-btn gab-sos" onClick={handleSOS}>
            <AlertTriangle size={16} /> SOS
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="members-section">
        <div className="section-header" style={{ padding: '0 0 12px' }}>
          <span className="section-title">Members</span>
          <button className="section-link">See all ({group.members})</button>
        </div>

        {(group.memberList || []).map((m, i) => (
          <div key={i} className="member-item">
            <div className="member-avatar">{m.initials}</div>
            <div className="member-info">
              <div className="member-name">{m.name}</div>
              <div className="member-role">{m.role}</div>
            </div>
            <span className={`member-badge ${m.role.includes('Admin') || m.role.includes('Founder') || m.role.includes('Secretary') ? 'badge-admin' : 'badge-member'}`}>
              {m.role}
            </span>
          </div>
        ))}

        {(group.memberList || []).length === 0 && (
          <div className="empty-state" style={{ padding: '24px' }}>
            <p className="empty-state-text">No member details available</p>
          </div>
        )}
      </div>
    </div>
  );
}
