import React, { useState } from 'react';

export default function BloodBankView({ donors, user, onRequestBlood }) {
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqBloodGroup, setReqBloodGroup] = useState('O+');
  const [reqHospital, setReqHospital] = useState('AIIMS Raipur');
  const [reqUnits, setReqUnits] = useState('2');
  const [reqPatient, setReqPatient] = useState('');

  const bloodGroups = ['ALL', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

  const filteredDonors = selectedGroup === 'ALL'
    ? donors
    : donors.filter((d) => d.group === selectedGroup);

  const handleBroadcast = (e) => {
    e.preventDefault();
    onRequestBlood({
      requester: user?.name || 'Resident',
      group: reqBloodGroup,
      hospital: reqHospital,
      units: reqUnits,
      patient: reqPatient || 'Neighbor in need',
      society: user?.society || 'Sunrise Apartments'
    });
    alert(`🚨 Emergency Blood Request for ${reqBloodGroup} broadcasted to all ${user?.society || 'society'} members & donors!`);
    setShowRequestModal(false);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>🩸</span>
            <span>Emergency Blood Donor Directory</span>
          </h1>
          <p className="page-subtitle">
            Life-saving volunteer donor network verified across society towers
          </p>
        </div>

        <button 
          className="btn-sos"
          style={{ background: 'linear-gradient(135deg, #F43F5E, #BE123C)' }}
          onClick={() => setShowRequestModal(true)}
        >
          <span>🆘</span>
          <span>Request Urgent Blood</span>
        </button>
      </div>

      {/* Filter by Blood Group */}
      <div className="filter-tabs-row">
        {bloodGroups.map((bg) => (
          <button
            key={bg}
            className={`tab-btn ${selectedGroup === bg ? 'active' : ''}`}
            onClick={() => setSelectedGroup(bg)}
          >
            {bg === 'ALL' ? 'All Donors' : bg}
          </button>
        ))}
      </div>

      {/* Donors Grid */}
      <div className="blood-grid">
        {filteredDonors.map((donor) => (
          <div key={donor.id} className="donor-card">
            <div className="donor-header">
              <div className="blood-type-badge">{donor.group}</div>
              <span className={`availability-pill ${donor.available ? 'ready' : 'unavailable'}`}>
                {donor.available ? '✓ Ready to Donate' : '● Resting Period'}
              </span>
            </div>

            <div>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>{donor.name}</div>
              <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
                Flat: <strong style={{ color: '#E2E8F0' }}>{donor.flat}</strong> • Last donated: {donor.lastDonated}
              </div>
            </div>

            <button
              className="donor-call-btn"
              onClick={() => {
                const phone = donor.phone ? donor.phone.replace(/X/g, '0') : '9826100000';
                window.open(`tel:${phone}`);
              }}
            >
              <span>📞</span>
              <span>Contact Donor ({donor.phone})</span>
            </button>
          </div>
        ))}
      </div>

      {/* Urgent Blood Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ border: '2px solid rgba(244, 63, 94, 0.4)' }}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🩸</span>
                <h3 style={{ color: '#F43F5E' }}>Urgent Blood Broadcast</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowRequestModal(false)}>✕</button>
            </div>

            <form onSubmit={handleBroadcast}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Required Blood Group:</label>
                  <select
                    value={reqBloodGroup}
                    onChange={(e) => setReqBloodGroup(e.target.value)}
                  >
                    {bloodGroups.filter(b => b !== 'ALL').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Units Needed:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reqUnits}
                    onChange={(e) => setReqUnits(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Blood Bank:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIIMS Raipur / Ramkrishna CARE"
                  value={reqHospital}
                  onChange={(e) => setReqHospital(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Patient Name / Ward Details:</label>
                <input
                  type="text"
                  required
                  placeholder="Patient name and ICU/Ward number"
                  value={reqPatient}
                  onChange={(e) => setReqPatient(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="tab-btn"
                  onClick={() => setShowRequestModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sos"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  Broadcast Urgent Alert 🚨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
