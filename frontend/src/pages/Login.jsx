import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, ArrowRight, MapPin } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const { loginWithPhone } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      loginWithPhone(phone);
      navigate('/otp', { state: { phone } });
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <MapPin size={40} color="white" />
      </div>
      <div className="auth-card">
        <h1 className="auth-title">Padosi Connect</h1>
        <p className="auth-subtitle">Connect with your local community</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Phone size={18} className="input-icon" />
            <input
              id="phone-input"
              type="tel"
              className="input-field"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Get OTP <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
