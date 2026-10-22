import React, { useState } from 'react';

export default function ServicesView({ services, onCreateService }) {
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [timing, setTiming] = useState('9 AM - 7 PM');

  const categories = ['ALL', 'Electrical', 'Plumbing', 'Appliance', 'Cleaning', 'Security', 'Carpentry'];

  const filteredServices = filter === 'ALL'
    ? services
    : services.filter((s) => s.category?.toLowerCase() === filter.toLowerCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onCreateService({
      name: name.trim(),
      role: role.trim() || `${category} Specialist`,
      phone: phone.trim(),
      category,
      timing
    });
    setName('');
    setRole('');
    setPhone('');
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>🛠️</span>
            <span>Verified Society Services & Technicians</span>
          </h1>
          <p className="page-subtitle">
            Community-rated electricians, plumbers, housekeepers, and security desk contacts
          </p>
        </div>

        <button className="btn-primary-action" onClick={() => setShowModal(true)}>
          <span>➕</span>
          <span>Add Verified Tech</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'ALL' ? 'All Services' : cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="items-grid">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                  {service.category || 'General'}
                </span>
                <h3 style={{ fontSize: '16px', marginTop: '6px' }}>{service.name}</h3>
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>{service.role}</div>
              </div>

              <div className="star-rating">
                <span>★</span>
                <span>{service.rating || '4.9'}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({service.reviews || 20})</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🕒</span>
              <span>Available: {service.timing || '9:00 AM - 8:00 PM'}</span>
            </div>

            <button
              className="donor-call-btn"
              style={{ marginTop: 'auto' }}
              onClick={() => window.open(`tel:${service.phone.replace(/[^0-9+]/g, '')}`)}
            >
              <span>📞</span>
              <span>Call {service.phone}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Recommend Verified Professional</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Professional's Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Specialization / Role:</label>
                <input
                  type="text"
                  placeholder="e.g. Inverter, MCB & House Wiring"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="tab-btn"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Professional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
