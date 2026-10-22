import React, { useState } from 'react';

export default function ProfileView({ user, onUpdateProfile, onLogout, onOpenAuth }) {
  const [name, setName] = useState(user?.name || 'Aman Verma');
  const [flat, setFlat] = useState(user?.flat || 'B-402');
  const [society, setSociety] = useState(user?.society || 'Sunrise Apartments');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [bio, setBio] = useState(user?.bio || 'Resident of Tower B-402, Sunrise Apartments.');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      flat,
      society,
      phone,
      bio
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <span style={{ fontSize: '48px' }}>👤</span>
        <h2 style={{ fontSize: '22px', margin: '14px 0 8px' }}>Resident Profile</h2>
        <p style={{ marginBottom: '20px' }}>Please sign in to view and edit your society flat details.</p>
        <button className="btn-primary-action" onClick={onOpenAuth} style={{ margin: '0 auto' }}>
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>👤</span>
            <span>Resident Profile & Society Flat</span>
          </h1>
          <p className="page-subtitle">
            Manage your verified resident credentials and notification preferences
          </p>
        </div>

        <button
          className="tab-btn"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>

      {isSaved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', padding: '12px', borderRadius: '10px', marginBottom: '18px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          ✓ Profile details updated successfully!
        </div>
      )}

      {/* Resident Identity Card */}
      <div className="post-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="author-avatar" style={{ width: '64px', height: '64px', fontSize: '24px', background: 'linear-gradient(135deg, #6366F1, #10B981)' }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : 'A'
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px' }}>{user.name}</h2>
              <span className="user-flat-tag">✓ Verified Resident</span>
            </div>
            <div style={{ fontSize: '14px', color: '#CBD5E1', marginTop: '2px' }}>
              Flat: <strong style={{ color: '#FFFFFF' }}>{user.flat || 'B-402'}</strong> • {user.society || 'Sunrise Apartments'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              {user.email || user.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="post-card">
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Edit Resident Details</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Flat / Unit Number:</label>
              <input
                type="text"
                required
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Society Name:</label>
              <input
                type="text"
                required
                value={society}
                onChange={(e) => setSociety(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resident Bio / Notes:</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-action"
            style={{ marginTop: '10px', padding: '10px 24px' }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
