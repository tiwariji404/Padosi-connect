import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Search, Tag, Package, Plus, Heart } from 'lucide-react';

const items = [
  { id: 1, title: 'Power Drill (Bosch)', type: 'Borrow', owner: 'Ramesh Singh', time: '2 hours ago', bg: '#E3F2FD', color: '#1565C0', price: 'Free' },
  { id: 2, title: 'Kids Bicycle (Age 5-8)', type: 'Sell', owner: 'Priya Sharma', time: '1 day ago', bg: '#FCE4EC', color: '#C62828', price: '₹1200' },
  { id: 3, title: 'Wooden Study Table', type: 'Sell', owner: 'Amit Patel', time: '3 days ago', bg: '#FFF8E1', color: '#F9A825', price: '₹2500' },
  { id: 4, title: '6ft Ladder', type: 'Borrow', owner: 'Nisha Gupta', time: 'Just now', bg: '#E8F5E9', color: '#2E7D32', price: 'Free' },
];

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => 
    (tab === 'All' || item.type === tab) &&
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page">
      <div className="header" style={{ paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Padosi Market</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Buy, Sell or Borrow in {user?.society}</p>
          </div>
        </div>
      </div>

      <div className="chat-tabs" style={{ marginTop: '0' }}>
        {['All', 'Buy/Sell', 'Borrow'].map(t => (
          <button key={t} className={`chat-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="search-bar" style={{ position: 'relative', margin: '16px' }}>
        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '40px', width: '100%', padding: '10px 16px 10px 40px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-dark)', outline: 'none' }} />
      </div>

      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {filteredItems.map(item => (
          <div key={item.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
              <Package size={40} opacity={0.8} />
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.owner}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{item.price}</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{item.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ position: 'fixed', bottom: '80px', right: '20px', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
        <Plus size={24} />
      </button>
    </div>
  );
}
