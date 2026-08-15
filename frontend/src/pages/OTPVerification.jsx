import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP } = useAuth();
  const phone = location.state?.phone || '';

  useEffect(() => {
    if (!phone) { navigate('/login'); return; }
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 4) {
      const result = verifyOTP(phone, code);
      if (result.isNewUser) {
        navigate('/onboarding', { state: { phone } });
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div style={{ marginBottom: '8px' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '12px' }} />
        </div>
        <h1 className="auth-title" style={{ fontSize: '1.5rem' }}>Verify OTP</h1>
        <p className="auth-subtitle">Enter the 4-digit code sent to<br/><strong>+91 {phone}</strong></p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: '56px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${digit ? 'var(--primary)' : 'var(--border-dark)'}`,
                  outline: 'none',
                  fontFamily: 'var(--font)',
                  transition: 'border-color 0.2s'
                }}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary">
            Verify & Continue
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: '6px', margin: '16px auto 0' }}
        >
          <ArrowLeft size={16} /> Change Number
        </button>
      </div>
    </div>
  );
}
