import React from 'react';

export default function Navbar({ 
  currentSociety, 
  onSelectSociety, 
  user, 
  onOpenAuth, 
  onOpenSOS, 
  unreadNotifications,
  onNavigateProfile 
}) {
  const societies = [
    'Sunrise Apartments',
    'Royal Enclave',
    'Palm Heights',
    'Green Valley Heights'
  ];

  return (
    <header className="app-header">
      {/* Brand & Society Selector */}
      <div className="brand-section">
        <div className="brand-logo-badge">
          🏘️
        </div>
        <div>
          <div className="brand-name">PadosiConnect</div>
          <div className="brand-tagline">Hyperlocal Community</div>
        </div>

        <div className="society-selector-box">
          <span style={{ fontSize: '14px' }}>📍</span>
          <select 
            className="society-select"
            value={currentSociety}
            onChange={(e) => onSelectSociety(e.target.value)}
          >
            {societies.map((soc) => (
              <option key={soc} value={soc} style={{ background: '#0F172A', color: '#FFF' }}>
                {soc}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '11px', color: '#64748B' }}>Raipur, CG</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* SOS Emergency Button */}
        <button className="btn-sos" onClick={onOpenSOS} title="Trigger Emergency SOS">
          <span>🚨</span>
          <span>SOS EMERGENCY</span>
        </button>

        {/* Notifications Icon */}
        <button className="btn-header-icon" title="Notifications" onClick={() => alert('No new unread notices for ' + currentSociety)}>
          <span>🔔</span>
          {unreadNotifications > 0 && <span className="notification-badge" />}
        </button>

        {/* User Profile or Login */}
        {user ? (
          <div className="user-profile-btn" onClick={onNavigateProfile}>
            <div className="user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>
                {user.name}
              </div>
              <span className="user-flat-tag">Flat {user.flat || 'B-402'}</span>
            </div>
          </div>
        ) : (
          <button className="btn-primary-action" onClick={onOpenAuth} style={{ padding: '7px 16px', fontSize: '13px' }}>
            <span>👤</span>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
