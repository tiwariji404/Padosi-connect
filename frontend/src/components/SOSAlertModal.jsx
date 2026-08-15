import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function SOSAlertModal() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handler = (e) => setAlert(e.detail);
    window.addEventListener('trigger-sos', handler);
    return () => window.removeEventListener('trigger-sos', handler);
  }, []);

  if (!alert) return null;

  return (
    <div className="sos-overlay" onClick={() => setAlert(null)}>
      <div className="sos-modal" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setAlert(null)}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={22} />
        </button>

        <div className="sos-icon-ring">
          <AlertCircle size={42} />
        </div>

        <h2 className="sos-title">🚨 Emergency Alert</h2>

        <p className="sos-body">
          <strong>{alert.senderName}</strong> triggered an SOS in <br/>
          <strong style={{ color: 'var(--danger)' }}>{alert.groupName}</strong>
        </p>

        <div className="sos-location-box">
          📍 Location: {alert.location}
        </div>

        <button className="btn btn-danger" onClick={() => setAlert(null)}>
          Acknowledge & Help
        </button>
      </div>
    </div>
  );
}
