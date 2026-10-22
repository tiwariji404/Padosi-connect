import React from 'react';

export default function Sidebar({ currentTab, onSelectTab, user, onOpenSOS }) {
  const navItems = [
    { id: 'society', icon: '📢', label: 'Society Noticeboard', badge: '3' },
    { id: 'city', icon: '🌆', label: 'City Pulse', badge: null },
    { id: 'chats', icon: '💬', label: 'Community Chats', badge: '5' },
    { id: 'blood', icon: '🩸', label: 'Blood Donors SOS', badge: 'SOS', isUrgent: true },
    { id: 'marketplace', icon: '🔄', label: 'Borrow & Buy', badge: null },
    { id: 'services', icon: '🛠️', label: 'Verified Services', badge: null },
    { id: 'sos', icon: '🚨', label: 'SOS Alert Center', badge: 'LIVE' },
    { id: 'profile', icon: '👤', label: 'Resident Profile', badge: null }
  ];

  return (
    <aside className="app-sidebar">
      <div>
        <div className="sidebar-category-label">Community Hub</div>
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-text">{item.label}</span>
                  {item.badge && (
                    <span className={`sidebar-pill-count ${item.isUrgent ? 'badge-urgent' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Resident Verified Status Box */}
      <div className="sidebar-resident-card">
        <div className="resident-card-top">
          <span className="status-indicator-dot" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>
            Verified Resident
          </span>
        </div>
        <div style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: '600' }}>
          {user ? user.society : 'Sunrise Apartments'}
        </div>
        <div style={{ fontSize: '11px', color: '#64748B' }}>
          Flat: <strong style={{ color: '#E2E8F0' }}>{user?.flat || 'B-402'}</strong>
        </div>
      </div>
    </aside>
  );
}
