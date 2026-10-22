import React, { useState } from 'react';

export default function SOSModal({ isOpen, onClose, user, onTrigger }) {
  const [reason, setReason] = useState('Medical Emergency');
  const [flat, setFlat] = useState(user?.flat || 'B-402');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const emergencyTypes = [
    { id: 'Medical', icon: '🚑', label: 'Medical Emergency' },
    { id: 'Fire', icon: '🔥', label: 'Fire Hazard' },
    { id: 'Lift', icon: '🛗', label: 'Lift Stuck' },
    { id: 'Security', icon: '👮', label: 'Suspicious Intruder' },
    { id: 'Elderly', icon: '⚠️', label: 'Elderly / Child Alert' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onTrigger({
        senderName: user?.name || 'Resident',
        flat,
        phone,
        reason,
        society: user?.society || 'Sunrise Apartments'
      });
      onClose();
    } catch (err) {
      alert('Failed to broadcast SOS. Please call security directly at 112 / Gate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()} 
        style={{ border: '2px solid rgba(239, 68, 68, 0.4)', maxWidth: '480px' }}
      >
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🚨</span>
            <div>
              <h3 style={{ fontSize: '20px', color: '#EF4444' }}>EMERGENCY SOS ALERT</h3>
              <p style={{ fontSize: '12px' }}>Broadcasts siren & instant alert to all neighbors</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Emergency Type:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {emergencyTypes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setReason(t.label)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: reason === t.label ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: reason === t.label ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: reason === t.label ? '#FCA5A5' : '#94A3B8',
                    fontWeight: '600',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Flat / Unit Number:</label>
              <input
                type="text"
                required
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                placeholder="e.g. B-402"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div style={{ marginTop: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#FCA5A5' }}>
            ⚠️ <strong>Notice:</strong> Neighbors and society guards in {user?.society || 'Sunrise Apartments'} will receive a high-priority loud siren alert with your flat number.
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="tab-btn"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-sos"
              style={{ flex: 2, justifyContent: 'center', padding: '12px' }}
            >
              {loading ? 'BROADCASTING...' : 'DISPATCH SOS SIREN 🚨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
