import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Zap, UserCheck, Sparkles, Flame, Shield, Wrench, Lightbulb, Car, ClipboardList, Vote, CalendarDays, ArrowRight, Search, X, CheckCircle2 } from 'lucide-react';

const services = [
  { id: 1, name: 'Community\nFees', icon: <CreditCard size={24} />, bg: '#E8F5E9', color: '#2E7D32', detail: 'View and pay monthly society maintenance fees.' },
  { id: 2, name: 'Utilities', icon: <Zap size={24} />, bg: '#FFF8E1', color: '#F9A825', detail: 'Electricity, water, gas — view and pay utility bills.' },
  { id: 3, name: 'Guest Pass', icon: <UserCheck size={24} />, bg: '#E3F2FD', color: '#1565C0', detail: 'Generate visitor passes for guests and delivery personnel.' },
  { id: 4, name: 'Cleaning', icon: <Sparkles size={24} />, bg: '#FCE4EC', color: '#C62828', detail: 'Book common area or personal flat cleaning services.' },
  { id: 5, name: 'BBQ', icon: <Flame size={24} />, bg: '#FFF3E0', color: '#E65100', detail: 'Reserve society BBQ area for weekend get-togethers.' },
  { id: 6, name: 'Safety', icon: <Shield size={24} />, bg: '#EDE7F6', color: '#4527A0', detail: 'Report security concerns or view CCTV status.' },
  { id: 7, name: 'Plumbing', icon: <Wrench size={24} />, bg: '#E8F5E9', color: '#2E7D32', detail: 'Request plumbing repairs and maintenance.' },
  { id: 8, name: 'Electrical', icon: <Lightbulb size={24} />, bg: '#FFF8E1', color: '#F9A825', detail: 'Report electrical issues and request repairs.' },
  { id: 9, name: 'Parking', icon: <Car size={24} />, bg: '#E3F2FD', color: '#1565C0', detail: 'Manage your parking spot and visitor parking.' },
  { id: 10, name: 'Complaints', icon: <ClipboardList size={24} />, bg: '#FFEBEE', color: '#C62828', detail: 'Lodge complaints regarding society issues.' },
  { id: 11, name: 'Polls', icon: <Vote size={24} />, bg: '#EDE7F6', color: '#4527A0', detail: 'Participate in society polls and voting.' },
  { id: 12, name: 'Events', icon: <CalendarDays size={24} />, bg: '#FFF3E0', color: '#E65100', detail: 'View upcoming society events and RSVP.' },
];

export default function Services() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [tab, setTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionDone, setActionDone] = useState({});

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().replace('\n', ' ').includes(searchQuery.toLowerCase())
  );

  const handleAction = (serviceId) => {
    setActionDone(prev => ({ ...prev, [serviceId]: true }));
    setTimeout(() => {
      setSelectedService(null);
      setTimeout(() => setActionDone(prev => ({ ...prev, [serviceId]: false })), 300);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="header">
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Services</h1>
      </div>

      {/* My Requests */}
      <div style={{ padding: '16px', background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: 600 }}>My requests</span>
            <span className="badge badge-green" style={{ marginLeft: '8px' }}>3</span>
          </div>
          <ArrowRight size={18} color="var(--text-muted)" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="chat-tabs">
        {['All', 'Service', 'Payments', 'Booking'].map(t => (
          <button key={t} className={`chat-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar" style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
        <input type="text" placeholder="Search service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '40px' }} />
      </div>

      {/* Grid */}
      <div className="services-grid">
        {filteredServices.map(s => (
          <div key={s.id} className="service-item" onClick={() => setSelectedService(s)}>
            <div className="service-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="service-name" style={{ whiteSpace: 'pre-line' }}>{s.name}</div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="sos-overlay" onClick={() => setSelectedService(null)}>
          <div className="sos-modal" onClick={e => e.stopPropagation()} style={{ borderTop: `6px solid ${selectedService.color}`, textAlign: 'left' }}>
            <button onClick={() => setSelectedService(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="var(--text-muted)" /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div className="service-icon" style={{ background: selectedService.bg, color: selectedService.color, width: 56, height: 56 }}>{selectedService.icon}</div>
              <div>
                <h3 style={{ marginBottom: '2px' }}>{selectedService.name.replace('\n', ' ')}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user?.society}</p>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>{selectedService.detail}</p>

            {actionDone[selectedService.id] ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)', fontWeight: 600 }}>
                <CheckCircle2 size={20} /> Request Submitted!
              </div>
            ) : (
              <button onClick={() => handleAction(selectedService.id)} className="btn btn-primary" style={{ background: selectedService.color }}>
                Request Service
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
