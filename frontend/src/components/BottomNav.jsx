import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { Home, MessageCircle, Grid3X3, User, Globe } from 'lucide-react';

export default function BottomNav() {
  const { unreadCount } = useAppData();
  const chatUnread = 6;

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>Society</span>
      </NavLink>
      <NavLink to="/city-feed" className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
        <Globe size={22} />
        <span>City Feed</span>
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
        {chatUnread > 0 && <span className="nav-tab-badge">{chatUnread}</span>}
        <MessageCircle size={22} />
        <span>Chat</span>
      </NavLink>
      <NavLink to="/services" className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
        <Grid3X3 size={22} />
        <span>Services</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
