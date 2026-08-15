import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Building2, CheckCircle } from 'lucide-react';

const CITIES = ['Raipur', 'Bhilai', 'Durg', 'Bilaspur', 'Korba', 'Rajnandgaon'];

export default function Onboarding() {
  const [name, setName] = useState('');
  const [society, setSociety] = useState('');
  const [city, setCity] = useState('Raipur');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { completeOnboarding } = useAuth();
  const phone = location.state?.phone || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && society && city) {
      completeOnboarding({ name, phone, society, city, bio });
      navigate('/');
    }
  };

  if (!phone) { navigate('/login'); return null; }

  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ maxWidth: '400px' }}>
        <h1 className="auth-title" style={{ fontSize: '1.5rem' }}>Create Profile</h1>
        <p className="auth-subtitle">Join your local community in seconds</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input id="name" type="text" className="input-field" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <Building2 size={18} className="input-icon" />
            <input id="society" type="text" className="input-field" placeholder="Society / Apartment Name" value={society} onChange={(e) => setSociety(e.target.value)} required />
          </div>

          <div className="input-group">
            <MapPin size={18} className="input-icon" />
            <select id="city" className="input-field" value={city} onChange={(e) => setCity(e.target.value)} style={{ paddingLeft: '44px', appearance: 'auto' }} required>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="input-group">
            <textarea id="bio" className="input-field input-field-plain" placeholder="Short bio (optional)" value={bio} onChange={(e) => setBio(e.target.value)} rows={2} style={{ resize: 'none', paddingLeft: '14px' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Join Community <CheckCircle size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
