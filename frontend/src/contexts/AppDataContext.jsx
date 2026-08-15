import React, { createContext, useContext, useState } from 'react';

const AppDataContext = createContext();
export const useAppData = () => useContext(AppDataContext);

// ── INITIAL MOCK DATA ──

const INITIAL_CITY_POSTS = [
  { id: 'cp1', author: 'Priya Singh', initials: 'PS', society: 'Royal Enclave', city: 'Raipur', time: Date.now() - 3600000, content: 'Raipur waalon! Anyone know a good dentist near Shankar Nagar? Need urgent appointment. 🦷', likes: ['u2','u3'], comments: [{ id: 'c1', author: 'Rohit Jain', text: 'Dr. Mehra on MG Road is excellent!', time: Date.now() - 1800000 }] },
  { id: 'cp2', author: 'Vikram Thakur', initials: 'VT', society: 'Palm Heights', city: 'Raipur', time: Date.now() - 7200000, content: 'Traffic alert ⚠️ Telibandha road is completely jammed due to construction. Avoid if possible and take bypass road.', likes: ['u5','u6','u7','u8'], comments: [{ id: 'c2', author: 'Neha Agarwal', text: 'Thanks for the heads up!', time: Date.now() - 5400000 }, { id: 'c3', author: 'Amit Dubey', text: 'How long will construction last?', time: Date.now() - 3600000 }] },
  { id: 'cp3', author: 'Sonal Gupta', initials: 'SG', society: 'City Center Residency', city: 'Raipur', time: Date.now() - 18000000, content: 'Free yoga session at Marine Drive Garden every morning 6-7 AM. All Raipur residents welcome! 🧘‍♀️', likes: ['u1','u2','u9','u10','u11'], comments: [] },
  { id: 'cp4', author: 'Manish Patel', initials: 'MP', society: 'Green Valley', city: 'Raipur', time: Date.now() - 43200000, content: 'Lost my golden retriever "Bruno" near Pandri area. Please contact me if you see him. He has a blue collar. 🐕', likes: ['u3','u4','u5','u6','u7','u8','u9'], comments: [{ id: 'c4', author: 'Ritu Sharma', text: 'Oh no! I will keep an eye out. Sharing with my neighbors.', time: Date.now() - 36000000 }] },
];

const INITIAL_SOCIETY_POSTS = [
  { id: 'sp1', author: 'Ravi Sharma', initials: 'RS', society: 'Sunrise Apartments', city: 'Raipur', time: Date.now() - 7200000, content: '⚠️ Water supply will be affected tomorrow morning 10 AM to 1 PM due to pipeline maintenance. Please store water.', likes: ['u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12'], comments: [{ id: 'sc1', author: 'Anita Desai', text: 'Thanks for informing. Will fill up buckets tonight.', time: Date.now() - 3600000 }], isPinned: true },
  { id: 'sp2', author: 'Secretary - Kiran Patel', initials: 'KP', society: 'Sunrise Apartments', city: 'Raipur', time: Date.now() - 18000000, content: '📢 Monthly society meeting is scheduled for this Saturday at 5 PM in the community hall. Agenda: parking, security, and Diwali celebration planning. Attendance is mandatory for all flat owners.', likes: ['u1','u2','u3','u4','u5'], comments: [{ id: 'sc2', author: 'Meena Gupta', text: 'Will be there!', time: Date.now() - 14400000 }, { id: 'sc3', author: 'Thiago R.', text: 'Can we discuss garden maintenance too?', time: Date.now() - 10800000 }], isPinned: true },
  { id: 'sp3', author: 'Anita Desai', initials: 'AD', society: 'Sunrise Apartments', city: 'Raipur', time: Date.now() - 43200000, content: 'Anyone interested in carpooling to IT Park from our society? I leave at 8:30 AM Mon-Fri. Saves fuel and makes great company! 🚗', likes: ['u1','u3'], comments: [] },
  { id: 'sp4', author: 'Deepak Verma', initials: 'DV', society: 'Sunrise Apartments', city: 'Raipur', time: Date.now() - 86400000, content: 'Lost keys near B-block parking yesterday evening. Silver keychain with Honda logo. Please contact flat 302 if found. 🔑', likes: ['u2'], comments: [{ id: 'sc4', author: 'Ravi Sharma', text: 'I found a keychain near the gate. Check with the security guard.', time: Date.now() - 72000000 }] },
];

const INITIAL_GROUPS = [
  { id: 'g1', name: 'General Chat', type: 'society', society: 'Sunrise Apartments', lastMsg: 'Ravi: Hi neighbors! Does anyone know a good electrician?', time: '21:04', unread: 3, members: 109, desc: 'Main community group for Sunrise Apartments. Discuss anything with your neighbors!', memberList: [{ name: 'Ravi Sharma', role: 'Founder & Admin', initials: 'RS' }, { name: 'Kiran Patel', role: 'Secretary', initials: 'KP' }, { name: 'Anita Desai', role: 'Admin', initials: 'AD' }, { name: 'Meena Gupta', role: 'Member', initials: 'MG' }, { name: 'Deepak Verma', role: 'Member', initials: 'DV' }] },
  { id: 'g2', name: 'Green & Gardening', type: 'society', society: 'Sunrise Apartments', lastMsg: 'Julia: I\'ve got extra basil seedlings!', time: '20:58', unread: 2, members: 34, desc: 'For garden lovers in our society. Share tips, exchange plants, organize garden events.', memberList: [{ name: 'Julia Ribeiro', role: 'Admin', initials: 'JR' }, { name: 'Thiago R.', role: 'Member', initials: 'TR' }] },
  { id: 'g3', name: 'Committee Members', type: 'society', society: 'Sunrise Apartments', lastMsg: 'Secretary: Next meeting is on Sunday 10 AM', time: 'Yesterday', unread: 1, members: 12, desc: 'Official committee group. Only for elected committee members.', memberList: [{ name: 'Kiran Patel', role: 'Secretary', initials: 'KP' }, { name: 'Ravi Sharma', role: 'President', initials: 'RS' }] },
  { id: 'g4', name: 'Buy/Sell/Swap', type: 'society', society: 'Sunrise Apartments', lastMsg: 'Thiago: Selling a barely used microwave...', time: '19:35', unread: 0, members: 78, desc: 'Buy, sell, or swap items within the society.', memberList: [] },
  { id: 'g5', name: 'Pets & Animals', type: 'society', society: 'Sunrise Apartments', lastMsg: 'Meena: Lost cat alert! Gray tabby near B-block', time: '15:06', unread: 0, members: 28, desc: 'For pet owners and animal lovers in the society.', memberList: [] },
  { id: 'g6', name: 'Raipur Foodies 🍕', type: 'city', society: null, lastMsg: 'Priya: Best momos near Pandri? Anyone?', time: '20:15', unread: 5, members: 540, desc: 'Discover the best food in Raipur! Share recommendations and reviews.', memberList: [] },
  { id: 'g7', name: 'Raipur Job Board', type: 'city', society: null, lastMsg: 'Vikram: IT company hiring freshers...', time: '18:00', unread: 0, members: 890, desc: 'Find and share job opportunities in Raipur.', memberList: [] },
];

const INITIAL_CHAT_MESSAGES = {
  'g1': [
    { id: 'm1', sender: 'Ravi Sharma', text: 'Hi neighbors! Does anyone know a good electrician?', time: '21:00', mine: false },
    { id: 'm2', sender: 'Anita Desai', text: 'Hello Ravi! Try Mr. Patil from C-block. Very reliable and affordable.', time: '21:02', mine: false },
    { id: 'm3', sender: 'Kiran Patel', text: 'Yes Mr. Patil is great. His number is 98765XXXXX', time: '21:04', mine: false },
  ],
  'g2': [
    { id: 'm4', sender: 'Julia Ribeiro', text: 'Good morning everyone! 🌿', time: '20:50', mine: false },
    { id: 'm5', sender: 'Julia Ribeiro', text: 'I\'ve got extra basil and tulsi seedlings. Anyone wants?', time: '20:58', mine: false },
  ],
  'g3': [
    { id: 'm6', sender: 'Kiran Patel', text: 'Dear committee members, next meeting is on Sunday 10 AM in community hall.', time: 'Yesterday', mine: false },
    { id: 'm7', sender: 'Kiran Patel', text: 'Agenda: 1) Parking allocation 2) Security upgrade 3) Diwali celebration budget', time: 'Yesterday', mine: false },
  ],
};

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'like', text: 'Ravi Sharma liked your post', time: '2 min ago', read: false },
  { id: 'n2', type: 'comment', text: 'Anita Desai commented on society post', time: '15 min ago', read: false },
  { id: 'n3', type: 'group', text: 'New message in General Chat', time: '1 hour ago', read: false },
  { id: 'n4', type: 'event', text: 'Society meeting this Saturday at 5 PM', time: '3 hours ago', read: true },
  { id: 'n5', type: 'sos', text: '⚠️ SOS alert from B-block resident', time: 'Yesterday', read: true },
];

const INITIAL_CHECKINS = [];

// ── PROVIDER ──

export const AppDataProvider = ({ children }) => {
  const [cityPosts, setCityPosts] = useState(INITIAL_CITY_POSTS);
  const [societyPosts, setSocietyPosts] = useState(INITIAL_SOCIETY_POSTS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [checkins, setCheckins] = useState(INITIAL_CHECKINS);

  // ── Post functions ──
  const addCityPost = (post) => {
    setCityPosts(prev => [{ ...post, id: 'cp_' + Date.now(), time: Date.now(), likes: [], comments: [] }, ...prev]);
    addNotification({ type: 'post', text: `${post.author} posted in City Feed` });
  };

  const addSocietyPost = (post) => {
    setSocietyPosts(prev => [{ ...post, id: 'sp_' + Date.now(), time: Date.now(), likes: [], comments: [] }, ...prev]);
    addNotification({ type: 'post', text: `${post.author} posted in Society Feed` });
  };

  const toggleLike = (postId, userId, feedType) => {
    const setter = feedType === 'city' ? setCityPosts : setSocietyPosts;
    setter(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(userId);
      return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
    }));
  };

  const addComment = (postId, comment, feedType) => {
    const setter = feedType === 'city' ? setCityPosts : setSocietyPosts;
    setter(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, { id: 'c_' + Date.now(), ...comment, time: Date.now() }] };
    }));
  };

  // ── Group functions ──
  const createGroup = (group) => {
    const newGroup = {
      ...group,
      id: 'g_' + Date.now(),
      lastMsg: 'Group created! Start chatting.',
      time: 'Now',
      unread: 0,
      members: 1,
      memberList: [{ name: group.creatorName, role: 'Admin', initials: group.creatorName.split(' ').map(n => n[0]).join('') }]
    };
    setGroups(prev => [newGroup, ...prev]);
    setChatMessages(prev => ({ ...prev, [newGroup.id]: [{ id: 'sys_' + Date.now(), sender: 'System', text: `${group.creatorName} created this group. Welcome!`, time: 'Now', mine: false }] }));
    addNotification({ type: 'group', text: `You created group "${group.name}"` });
    return newGroup.id;
  };

  // ── Chat functions ──
  const sendMessage = (groupId, message) => {
    setChatMessages(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), { ...message, id: 'm_' + Date.now() }]
    }));
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, lastMsg: `You: ${message.text}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : g
    ));
  };

  // ── Notification functions ──
  const addNotification = (notif) => {
    setNotifications(prev => [{ id: 'n_' + Date.now(), time: 'Just now', read: false, ...notif }, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── CheckIn ──
  const checkIn = (userId, userName, society) => {
    const newCheckIn = { id: 'ck_' + Date.now(), userId, userName, society, time: Date.now() };
    setCheckins(prev => [newCheckIn, ...prev]);
    addNotification({ type: 'checkin', text: `${userName} checked in at ${society}` });
    return newCheckIn;
  };

  return (
    <AppDataContext.Provider value={{
      cityPosts, societyPosts, groups, chatMessages, notifications, checkins, unreadCount,
      addCityPost, addSocietyPost, toggleLike, addComment,
      createGroup, sendMessage, addNotification, markAllRead, checkIn
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
