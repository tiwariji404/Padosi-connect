import React, { useState } from 'react';
import { 
  firebaseLoginWithGoogle, 
  firebaseLoginWithEmail, 
  firebaseRegisterWithEmail,
  isFirebaseConfigured 
} from '../firebase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [society, setSociety] = useState('Sunrise Apartments');
  const [flat, setFlat] = useState('B-402');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await firebaseLoginWithGoogle();
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let user;
      if (isRegister) {
        user = await firebaseRegisterWithEmail(email, password, name, society, flat);
      } else {
        user = await firebaseLoginWithEmail(email, password);
      }
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoResident = () => {
    const demoUser = {
      uid: 'u1',
      name: 'Aman Verma',
      phone: '9876543210',
      email: 'aman.verma@example.com',
      society: 'Sunrise Apartments',
      city: 'Raipur',
      flat: 'B-402',
      role: 'member'
    };
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div>
            <h3 style={{ fontSize: '20px' }}>
              {isRegister ? 'Resident Registration' : 'Resident Sign In'}
            </h3>
            <p style={{ fontSize: '13px' }}>
              {isFirebaseConfigured 
                ? '🔥 Firebase Authentication Active' 
                : 'PadosiConnect Secure Access'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {/* 1-Click Demo Login */}
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '12px', padding: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: '#818CF8' }}>
              🚀 Quick 1-Click Resident Access
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Log in instantly as Aman Verma (Flat B-402)
            </div>
          </div>
          <button 
            type="button" 
            className="btn-primary-action" 
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={handleQuickDemoResident}
          >
            Demo Login
          </button>
        </div>

        {/* Firebase Google Auth */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-color)',
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.26 21.36 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.1z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailAuth}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Society:</label>
                  <input
                    type="text"
                    required
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Flat / Unit:</label>
                  <input
                    type="text"
                    required
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    placeholder="e.g. A-302"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="resident@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-action"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Register Flat & Profile' : 'Sign In to Society')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setIsRegister(false)}
                style={{ background: 'none', color: '#818CF8', fontWeight: '700' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New neighbor in the society?{' '}
              <button 
                type="button" 
                onClick={() => setIsRegister(true)}
                style={{ background: 'none', color: '#818CF8', fontWeight: '700' }}
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
