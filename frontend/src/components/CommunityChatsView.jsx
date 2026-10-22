import React, { useState, useEffect, useRef } from 'react';

export default function CommunityChatsView({ 
  groups, 
  user, 
  activeGroupId, 
  onSelectGroup, 
  messages, 
  onSendMessage, 
  onCreateGroup 
}) {
  const [inputText, setInputText] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState('society');
  const messagesEndRef = useRef(null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeGroup?.id || 'g1', {
      sender: user?.name || 'Aman Verma',
      text: inputText.trim(),
      mine: true
    });
    setInputText('');
  };

  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateGroup({
      name: newGroupName.trim(),
      type: newGroupType,
      society: user?.society || 'Sunrise Apartments'
    });
    setNewGroupName('');
    setShowNewGroupModal(false);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            <span>💬</span>
            <span>Neighborhood Discussion Groups</span>
          </h1>
          <p className="page-subtitle">
            Chat live with your tower neighbors, interest clubs, and society committees
          </p>
        </div>

        <button 
          className="btn-primary-action"
          onClick={() => setShowNewGroupModal(true)}
        >
          <span>➕</span>
          <span>New Group</span>
        </button>
      </div>

      <div className="chat-layout">
        {/* Left: Chat Rooms */}
        <div className="chat-rooms-list">
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', padding: '6px 8px' }}>
            Active Channels
          </div>
          {groups.map((g) => {
            const isActive = g.id === (activeGroup?.id);
            return (
              <div
                key={g.id}
                className={`chat-room-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectGroup(g.id)}
              >
                <div className="chat-room-name">
                  <span>{g.name}</span>
                  {g.unread > 0 && (
                    <span style={{ fontSize: '10px', background: '#6366F1', color: 'white', padding: '1px 6px', borderRadius: '999px' }}>
                      {g.unread}
                    </span>
                  )}
                </div>
                <div className="chat-last-snippet">
                  {g.lastMsg || 'Tap to chat'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                  <span>👥 {g.members || 1} members</span>
                  <span>{g.time || 'now'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Messages Stream */}
        <div className="chat-messages-container">
          {activeGroup ? (
            <>
              <div className="chat-room-header">
                <div>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>{activeGroup.name}</h3>
                  <span style={{ fontSize: '12px', color: '#10B981' }}>
                    ● {activeGroup.members || 42} Neighbors Online
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {activeGroup.society || 'Raipur City'}
                </div>
              </div>

              <div className="chat-stream">
                {messages && messages.length > 0 ? (
                  messages.map((m) => {
                    const isMine = m.mine || (user && m.sender === user.name);
                    return (
                      <div key={m.id} className={`chat-msg ${isMine ? 'mine' : 'theirs'}`}>
                        {!isMine && (
                          <div className="msg-sender-tag">{m.sender}</div>
                        )}
                        <div>{m.text}</div>
                        <div className="msg-time">{m.time || 'Just now'}</div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', margin: 'auto', color: '#64748B' }}>
                    Say hello to your neighbors in <strong>{activeGroup.name}</strong>! 👋
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-bar" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder={`Message ${activeGroup.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary-action">
                  <span>Send</span>
                  <span>➤</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a group from the list to start chatting
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="modal-overlay" onClick={() => setShowNewGroupModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Create Neighborhood Group</h3>
              <button className="modal-close-btn" onClick={() => setShowNewGroupModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateGroupSubmit}>
              <div className="form-group">
                <label className="form-label">Group Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Badminton & Turf Lovers 🏸"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Group Scope:</label>
                <select
                  value={newGroupType}
                  onChange={(e) => setNewGroupType(e.target.value)}
                >
                  <option value="society">My Society Only ({user?.society || 'Sunrise Apartments'})</option>
                  <option value="city">Raipur City Wide</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="tab-btn"
                  onClick={() => setShowNewGroupModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" style={{ flex: 1, justifyContent: 'center' }}>
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
