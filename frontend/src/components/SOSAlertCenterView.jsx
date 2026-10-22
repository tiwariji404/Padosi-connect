import React from 'react';

export default function SOSAlertCenterView({ activeSOS, onOpenSOS, onDismissSOS }) {
  const emergencyNumbers = [
    { name: 'National Emergency Helpline', number: '112', icon: '🚨', type: 'Govt / Police' },
    { name: 'Ambulance & Trauma Care', number: '108', icon: '🚑', type: 'Medical' },
    { name: 'Fire & Rescue Service', number: '101', icon: '🚒', type: 'Disaster' },
    { name: 'Society Main Gate Security', number: '+91 98265 99001', icon: '🛡️', type: 'Security Desk' },
    { name: 'Power Cut / Electricity Fault', number: '1912', icon: '⚡', type: 'CSPDCL Raipur' }
  ];

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>🚨</span>
            <span>SOS Emergency Command Center</span>
          </h1>
          <p className="page-subtitle">
            Instant neighborhood emergency broadcast and quick hotline access
          </p>
        </div>

        <button className="btn-sos" onClick={onOpenSOS} style={{ padding: '12px 24px', fontSize: '15px' }}>
          <span>🚨</span>
          <span>TRIGGER SOS SIREN</span>
        </button>
      </div>

      {/* Active Alert Card */}
      {activeSOS ? (
        <div style={{ background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(153, 27, 27, 0.3))', border: '2px solid #EF4444', borderRadius: '18px', padding: '24px', marginBottom: '28px', boxShadow: '0 0 30px rgba(239, 68, 68, 0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '42px', animation: 'rotateWiggle 1s infinite' }}>🚨</span>
              <div>
                <span style={{ background: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: '800' }}>
                  ACTIVE EMERGENCY
                </span>
                <h2 style={{ fontSize: '22px', color: '#FCA5A5', marginTop: '6px' }}>
                  Flat {activeSOS.flat} ({activeSOS.society || 'Society'}) Needs Urgent Help!
                </h2>
                <div style={{ fontSize: '14px', color: '#CBD5E1', marginTop: '4px' }}>
                  Resident: <strong>{activeSOS.senderName}</strong> • Phone: <strong>{activeSOS.phone}</strong> • Reason: <strong>{activeSOS.reason || 'Urgent SOS'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-assist"
                style={{ padding: '10px 20px', fontSize: '14px' }}
                onClick={() => window.open(`tel:${activeSOS.phone || '112'}`)}
              >
                📞 Call Resident ({activeSOS.phone})
              </button>
              <button
                className="btn-dismiss-sos"
                style={{ padding: '10px 18px', fontSize: '14px' }}
                onClick={onDismissSOS}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px', padding: '20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '32px' }}>🛡️</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#6EE7B7' }}>
              All Clear in Sunrise Apartments
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              No active emergency reported. Press the red SOS button anytime if you or a neighbor need urgent medical or security assistance.
            </div>
          </div>
        </div>
      )}

      {/* Emergency Helplines Grid */}
      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Direct Society & City Hotlines</h3>
      <div className="blood-grid">
        {emergencyNumbers.map((hl) => (
          <div key={hl.name} className="donor-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{hl.icon}</span>
              <div>
                <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: '700' }}>{hl.type}</span>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>{hl.name}</div>
              </div>
            </div>

            <button
              className="donor-call-btn"
              style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#C7D2FE' }}
              onClick={() => window.open(`tel:${hl.number.replace(/[^0-9+]/g, '')}`)}
            >
              <span>📞 Dial {hl.number}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
