import React, { useState } from 'react';

export default function NewPostModal({ isOpen, onClose, user, currentSociety, defaultScope, onSubmitPost }) {
  const [content, setContent] = useState('');
  const [scope, setScope] = useState(defaultScope || 'society');
  const [categoryTag, setCategoryTag] = useState('General');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const tags = ['General', 'Official Notice', 'Carpool', 'Help Needed', 'Event / Celebration'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const prefix = categoryTag !== 'General' ? `[${categoryTag}] ` : '';
      await onSubmitPost({
        author: user?.name || 'Resident',
        initials: user?.name ? user.name.substring(0, 2).toUpperCase() : 'R',
        society: user?.society || currentSociety,
        city: user?.city || 'Raipur',
        content: `${prefix}${content.trim()}`,
        scope
      });
      setContent('');
      onClose();
    } catch (err) {
      alert('Error creating post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>Create Community Post</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Posting To:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className={`tab-btn ${scope === 'society' ? 'active' : ''}`}
                onClick={() => setScope('society')}
                style={{ textAlign: 'center' }}
              >
                📢 {currentSociety}
              </button>
              <button
                type="button"
                className={`tab-btn ${scope === 'city' ? 'active' : ''}`}
                onClick={() => setScope('city')}
                style={{ textAlign: 'center' }}
              >
                🌆 Raipur City
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category Tag:</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setCategoryTag(tag)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: categoryTag === tag ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: categoryTag === tag ? '1px solid #818CF8' : '1px solid var(--border-color)',
                    color: categoryTag === tag ? '#C7D2FE' : '#94A3B8'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">What would you like to share?</label>
            <textarea
              rows="4"
              required
              placeholder="Share maintenance notices, carpooling requests, local recommendations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              className="tab-btn"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-action"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {loading ? 'Posting...' : 'Publish Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
