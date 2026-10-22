import React from 'react';

export default function SOSBanner({ activeSOS, onDismiss, onAssist }) {
  if (!activeSOS) return null;

  return (
    <div className="sos-banner">
      <div className="sos-banner-left">
        <span className="siren-icon-pulse">🚨</span>
        <div>
          <div style={{ fontWeight: '800', fontSize: '15px', letterSpacing: '0.02em' }}>
            EMERGENCY SOS: Flat {activeSOS.flat} ({activeSOS.society || 'Society'})
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>
            Resident <strong>{activeSOS.senderName}</strong> needs immediate assistance! 
            {activeSOS.phone && ` Contact: ${activeSOS.phone}`}
          </div>
        </div>
      </div>

      <div className="sos-banner-actions">
        <button 
          className="btn-assist"
          onClick={() => onAssist ? onAssist(activeSOS) : window.open(`tel:${activeSOS.phone || '112'}`)}
        >
          📞 Call / Assist
        </button>
        <button className="btn-dismiss-sos" onClick={onDismiss}>
          ✓ Mark Resolved
        </button>
      </div>
    </div>
  );
}
