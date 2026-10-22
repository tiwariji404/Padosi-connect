import React, { useState } from 'react';

export default function MarketplaceView({ items, user, onCreateItem }) {
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Borrow');
  const [price, setPrice] = useState('Free / Borrow');

  const filteredItems = filter === 'ALL'
    ? items
    : items.filter((item) => item.type.toLowerCase() === filter.toLowerCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateItem({
      title: title.trim(),
      type,
      price: type === 'Borrow' ? 'Free / Borrow' : price,
      owner: `${user?.name || 'Resident'} (${user?.flat || 'B-402'})`
    });
    setTitle('');
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>🔄</span>
            <span>Hyperlocal Borrow & Sell Marketplace</span>
          </h1>
          <p className="page-subtitle">
            Borrow heavy tools, buy pre-loved books & furniture directly from neighbors
          </p>
        </div>

        <button className="btn-primary-action" onClick={() => setShowModal(true)}>
          <span>➕</span>
          <span>List Item</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        {['ALL', 'Borrow', 'Sell'].map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'ALL' ? 'All Items' : (cat === 'Borrow' ? '🛠️ Borrow from Neighbors' : '🏷️ Pre-loved Buy/Sell')}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="items-grid">
        {filteredItems.map((item) => {
          const isBorrow = item.type === 'Borrow';
          return (
            <div key={item.id} className="market-item-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span
                    style={{
                      background: isBorrow ? 'rgba(2, 132, 199, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                      color: isBorrow ? '#38BDF8' : '#FBBF24',
                      border: `1px solid ${isBorrow ? 'rgba(2, 132, 199, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {isBorrow ? '🤝 Free to Borrow' : '🏷️ For Sale'}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>
                    {item.price}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Listed by: <strong style={{ color: '#E2E8F0' }}>{item.owner}</strong>
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  className="btn-primary-action"
                  style={{ width: '100%', justifyContent: 'center', padding: '8px' }}
                  onClick={() => alert(`Connecting with ${item.owner} for "${item.title}"!`)}
                >
                  {isBorrow ? 'Request to Borrow' : 'Contact Seller'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* List Item Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>List Item for Neighbors</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aluminum 7ft Step Ladder, Bosch Drill, Study Table"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Listing Type:</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    if (e.target.value === 'Borrow') setPrice('Free / Borrow');
                  }}
                >
                  <option value="Borrow">Borrow / Lend (Free for Neighbors)</option>
                  <option value="Sell">Sell (Second Hand / Surplus)</option>
                </select>
              </div>

              {type === 'Sell' && (
                <div className="form-group">
                  <label className="form-label">Price (₹):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹1,200"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}

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
                  List Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
