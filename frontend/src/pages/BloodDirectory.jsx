import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Droplet, Search, Phone, Heart, AlertTriangle } from 'lucide-react';

const donors = [
  { id: 1, name: 'Vikram Singh', group: 'O+', flat: 'B-402', lastDonated: '4 months ago', available: true },
  { id: 2, name: 'Anjali Desai', group: 'A+', flat: 'A-105', lastDonated: '8 months ago', available: true },
  { id: 3, name: 'Rahul Mehta', group: 'B+', flat: 'C-301', lastDonated: '1 month ago', available: false },
  { id: 4, name: 'Sneha Kapoor', group: 'O-', flat: 'D-204', lastDonated: '1 year ago', available: true },
  { id: 5, name: 'Karan Patel', group: 'AB+', flat: 'A-404', lastDonated: 'Never', available: true },
];

export default function BloodDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestToast, setShowRequestToast] = useState(false);

  const filteredDonors = donors.filter(donor => 
    donor.group.toLowerCase().includes(searchQuery.toLowerCase()) || 
    donor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSOSRequest = () => {
    setShowRequestToast(true);
    setTimeout(() => setShowRequestToast(false), 3000);
  };

  return (
    <div className="page">
      <div className="header" style={{ paddingBottom: '12px', background: '#FFF1F2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#E11D48' }}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#E11D48' }}>Blood Directory</h1>
            <p style={{ fontSize: '0.8rem', color: '#BE123C', margin: 0 }}>{user?.society} Donors Network</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', background: '#FFF1F2', borderBottom: '1px solid #FFE4E6' }}>
        <button onClick={handleSOSRequest} style={{ width: '100%', background: '#E11D48', color: 'white', border: 'none', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)' }}>
          <AlertTriangle size={20} /> Request Urgent Blood
        </button>
      </div>

      {showRequestToast && (
        <div style={{ margin: '16px', padding: '12px 16px', background: '#FEF2F2', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.3s ease', border: '1px solid #FECDD3' }}>
          <Heart size={20} color="#E11D48" />
          <span style={{ fontWeight: 600, color: '#E11D48', fontSize: '0.9rem' }}>Blood Request Alert Sent to Society!</span>
        </div>
      )}

      <div className="search-bar" style={{ position: 'relative', margin: '16px' }}>
        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search by Blood Group (e.g., O+) or Name" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '40px', width: '100%', padding: '10px 16px 10px 40px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-dark)', outline: 'none' }} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Registered Donors ({filteredDonors.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredDonors.map(donor => (
            <div key={donor.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                {donor.group}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{donor.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Flat: {donor.flat}</div>
                <div style={{ fontSize: '0.75rem', color: donor.available ? 'var(--primary)' : 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: donor.available ? 'var(--primary)' : 'var(--text-muted)' }} />
                  {donor.available ? 'Available to Donate' : `Not Available (Donated ${donor.lastDonated})`}
                </div>
              </div>
              <div>
                <button style={{ background: '#F1F5F9', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A', cursor: donor.available ? 'pointer' : 'not-allowed', opacity: donor.available ? 1 : 0.5 }}>
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
