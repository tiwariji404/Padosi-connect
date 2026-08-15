import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { ArrowLeft, Send, AlertTriangle, Phone, MoreVertical, Info } from 'lucide-react';

export default function ChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, chatMessages, sendMessage } = useAppData();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const group = groups.find(g => g.id === id);
  const messages = chatMessages[id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(id, {
      sender: user.name,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true
    });
    setInput('');
  };

  const handleSOS = () => {
    window.dispatchEvent(new CustomEvent('trigger-sos', {
      detail: { groupName: group?.name || `Group`, senderName: user?.name, location: `${user?.society}, ${user?.city}` }
    }));
  };

  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-room-header">
        <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={22} /></button>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/groups/${id}`)}>
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>{group?.name || 'Chat'}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{group?.members || 0} members · tap for info</div>
        </div>
        <button className="back-btn" onClick={handleSOS} style={{ color: '#FFCDD2' }}>
          <AlertTriangle size={20} />
        </button>
        <button className="back-btn"><Phone size={18} /></button>
        <button className="back-btn" onClick={() => navigate(`/groups/${id}`)}><Info size={18} /></button>
      </div>

      {/* Messages */}
      <div className="chat-room-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem', padding: '40px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-md)', margin: '20px 0' }}>
            No messages yet. Start the conversation! 👋
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`msg ${msg.mine ? 'msg-out' : 'msg-in'}`}>
            {!msg.mine && <div className="msg-sender">{msg.sender}</div>}
            <div>{msg.text}</div>
            <div className="msg-time">{msg.time}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="chat-room-input">
        <input type="text" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit" className="send-btn"><Send size={18} /></button>
      </form>
    </div>
  );
}
