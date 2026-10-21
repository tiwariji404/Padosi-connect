import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppDataContext = createContext();
export const useAppData = () => useContext(AppDataContext);

// Initial Mock Data
const INITIAL_CITY_POSTS = [
  {
    id: 'cp1',
    author: 'Priya Singh',
    initials: 'PS',
    society: 'Royal Enclave',
    city: 'Raipur',
    time: Date.now() - 3600000,
    content: 'Raipur waalon! Anyone know a good pediatric dentist near Shankar Nagar? Need urgent appointment today. 🦷',
    likes: ['u2', 'u3'],
    comments: [
      { id: 'c1', author: 'Rohit Jain', text: 'Dr. Mehra on MG Road is excellent and very gentle with kids!', time: Date.now() - 1800000 }
    ]
  },
  {
    id: 'cp2',
    author: 'Vikram Thakur',
    initials: 'VT',
    society: 'Palm Heights',
    city: 'Raipur',
    time: Date.now() - 7200000,
    content: 'Traffic alert ⚠️ Telibandha road is completely jammed due to metro pipeline work. Avoid if possible and use the VIP ring road bypass.',
    likes: ['u1', 'u5', 'u6', 'u7'],
    comments: [
      { id: 'c2', author: 'Neha Agarwal', text: 'Thanks a lot for the heads up! Saved 40 mins.', time: Date.now() - 5400000 }
    ]
  },
  {
    id: 'cp3',
    author: 'Sonal Gupta',
    initials: 'SG',
    society: 'City Center Residency',
    city: 'Raipur',
    time: Date.now() - 18000000,
    content: 'Free sunrise yoga session at Marine Drive Garden every morning 6:00 - 7:00 AM. Certified trainer. All Raipur residents welcome! 🧘‍♀️',
    likes: ['u1', 'u2', 'u9', 'u10', 'u11'],
    comments: []
  },
  {
    id: 'cp4',
    author: 'Manish Patel',
    initials: 'MP',
    society: 'Green Valley',
    city: 'Raipur',
    time: Date.now() - 43200000,
    content: 'Lost Golden Retriever named "Bruno" near Pandri market area. Blue collar with bell. Please call me if spotted! 🐕',
    likes: ['u3', 'u4', 'u5', 'u6', 'u7'],
    comments: [
      { id: 'c3', author: 'Ritu Sharma', text: 'Sharing in our colony WhatsApp group right now.', time: Date.now() - 36000000 }
    ]
  }
];

const INITIAL_SOCIETY_POSTS = [
  {
    id: 'sp1',
    author: 'Ravi Sharma (President)',
    initials: 'RS',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    time: Date.now() - 7200000,
    content: '⚠️ Water supply will be temporarily stopped tomorrow 10:00 AM to 1:00 PM for overhead tank sanitization. Please store sufficient water.',
    likes: ['u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
    comments: [
      { id: 'sc1', author: 'Anita Desai', text: 'Thanks for the early notice! Will fill the emergency tanks.', time: Date.now() - 3600000 }
    ],
    isPinned: true
  },
  {
    id: 'sp2',
    author: 'Kiran Patel (Secretary)',
    initials: 'KP',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    time: Date.now() - 18000000,
    content: '📢 Annual General Meeting (AGM) is scheduled for this Sunday at 11:00 AM in the Clubhouse. Agenda: Electric vehicle charging slots & CCTV coverage expansion.',
    likes: ['u1', 'u2', 'u3', 'u4'],
    comments: [
      { id: 'sc2', author: 'Deepak Verma', text: 'Will be attending. EV charging is a critical topic.', time: Date.now() - 14400000 }
    ],
    isPinned: true
  },
  {
    id: 'sp3',
    author: 'Anita Desai',
    initials: 'AD',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    time: Date.now() - 32400000,
    content: 'Anyone interested in daily carpooling to Magneto Mall / IT corridor? Leaving flat at 8:45 AM Mon-Fri. 2 seats open in sedan! 🚗',
    likes: ['u1', 'u3'],
    comments: []
  },
  {
    id: 'sp4',
    author: 'Deepak Verma',
    initials: 'DV',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    time: Date.now() - 86400000,
    content: 'Found a silver keychain with Honda bike key near the badminton court bench. Handed over to Tower B security guard desk. 🔑',
    likes: ['u2', 'u4'],
    comments: [
      { id: 'sc3', author: 'Rahul Mehta', text: 'That was mine! Thank you so much neighbor!', time: Date.now() - 72000000 }
    ]
  }
];

const INITIAL_GROUPS = [
  {
    id: 'g1',
    name: 'General Chat',
    type: 'society',
    society: 'Sunrise Apartments',
    lastMsg: 'Kiran: Yes Mr. Patil is great. Very reliable.',
    time: '21:04',
    unread: 2,
    members: 142,
    desc: 'Official resident open chat for Sunrise Apartments.'
  },
  {
    id: 'g2',
    name: 'Green & Gardening Club',
    type: 'society',
    society: 'Sunrise Apartments',
    lastMsg: 'Julia: I have extra basil seedlings for anyone who wants!',
    time: '20:58',
    unread: 1,
    members: 45,
    desc: 'For plant lovers and balcony gardeners in our society.'
  },
  {
    id: 'g3',
    name: 'Managing Committee',
    type: 'society',
    society: 'Sunrise Apartments',
    lastMsg: 'Secretary: Agenda points are finalized.',
    time: 'Yesterday',
    unread: 0,
    members: 12,
    desc: 'Internal discussion for elected committee members.'
  },
  {
    id: 'g4',
    name: 'Raipur Foodies & Cafes 🍕',
    type: 'city',
    society: null,
    lastMsg: 'Priya: Best wood-fired pizza in Shankar Nagar?',
    time: '20:15',
    unread: 4,
    members: 580,
    desc: 'City-wide food recommendations, reviews, and meetups.'
  },
  {
    id: 'g5',
    name: 'Raipur Civic & Roads Alert',
    type: 'city',
    society: null,
    lastMsg: 'Vikram: Bypass road clear now.',
    time: '18:30',
    unread: 0,
    members: 940,
    desc: 'City alerts, traffic, and municipal updates.'
  }
];

const INITIAL_CHAT_MESSAGES = {
  'g1': [
    { id: 'm1', sender: 'Ravi Sharma', text: 'Hi neighbors! Does anyone have contact for a dependable AC technician?', time: '20:55', mine: false },
    { id: 'm2', sender: 'Anita Desai', text: 'Hello Ravi! Try Mr. Patil from C-block service desk. He serviced ours last week.', time: '21:00', mine: false },
    { id: 'm3', sender: 'Kiran Patel', text: 'Yes Mr. Patil is great. Very reliable.', time: '21:04', mine: false }
  ],
  'g2': [
    { id: 'm4', sender: 'Julia Ribeiro', text: 'Good evening plant parents! 🌿', time: '20:45', mine: false },
    { id: 'm5', sender: 'Julia Ribeiro', text: 'I have extra basil seedlings for anyone who wants! Can pick up from flat 204.', time: '20:58', mine: false }
  ],
  'g3': [
    { id: 'm6', sender: 'Kiran Patel', text: 'Dear committee members, Sunday meeting time confirmed at 11 AM.', time: 'Yesterday', mine: false },
    { id: 'm7', sender: 'Secretary', text: 'Secretary: Agenda points are finalized.', time: 'Yesterday', mine: false }
  ],
  'g4': [
    { id: 'm8', sender: 'Priya Singh', text: 'Best wood-fired pizza in Shankar Nagar?', time: '20:15', mine: false }
  ],
  'g5': [
    { id: 'm9', sender: 'Vikram Thakur', text: 'Bypass road clear now.', time: '18:30', mine: false }
  ]
};

const INITIAL_DONORS = [
  { id: 'd1', name: 'Vikram Singh', group: 'O+', flat: 'B-402', phone: '98261XXXXX', available: true, lastDonated: '4 months ago' },
  { id: 'd2', name: 'Anjali Desai', group: 'A+', flat: 'A-105', phone: '94252XXXXX', available: true, lastDonated: '8 months ago' },
  { id: 'd3', name: 'Rahul Mehta', group: 'B+', flat: 'C-301', phone: '98930XXXXX', available: false, lastDonated: '1 month ago' },
  { id: 'd4', name: 'Sneha Kapoor', group: 'O-', flat: 'D-204', phone: '97521XXXXX', available: true, lastDonated: '1 year ago' },
  { id: 'd5', name: 'Karan Patel', group: 'AB+', flat: 'A-404', phone: '99811XXXXX', available: true, lastDonated: 'Ready to donate' },
  { id: 'd6', name: 'Pooja Tiwari', group: 'B-', flat: 'B-201', phone: '91790XXXXX', available: true, lastDonated: '6 months ago' },
  { id: 'd7', name: 'Arjun Verma', group: 'AB-', flat: 'C-102', phone: '93001XXXXX', available: true, lastDonated: '5 months ago' }
];

const INITIAL_MARKETPLACE = [
  { id: 'item1', title: 'Bosch Professional Power Drill', type: 'Borrow', owner: 'Ramesh Singh (B-301)', price: 'Free / Borrow', bg: '#E0F2FE', tagColor: '#0284C7', icon: 'tool' },
  { id: 'item2', title: 'Kids Bicycle (Age 5-9)', type: 'Sell', owner: 'Priya Sharma (A-204)', price: '₹1,400', bg: '#FEE2E2', tagColor: '#DC2626', icon: 'bike' },
  { id: 'item3', title: 'Solid Sheesham Study Table', type: 'Sell', owner: 'Amit Patel (C-103)', price: '₹2,600', bg: '#FEF3C7', tagColor: '#D97706', icon: 'desk' },
  { id: 'item4', title: 'Heavy Duty 7ft Aluminium Ladder', type: 'Borrow', owner: 'Nisha Gupta (D-501)', price: 'Free / Borrow', bg: '#DCFCE7', tagColor: '#16A34A', icon: 'ladder' },
  { id: 'item5', title: 'Badminton Rackets Pair + Shuttle', type: 'Sell', owner: 'Kunal Verma (B-102)', price: '₹650', bg: '#F3E8FF', tagColor: '#9333EA', icon: 'sports' }
];

const INITIAL_SERVICES = [
  { id: 's1', name: 'Society Fees', category: 'Payments', icon: 'card-outline', color: '#16A34A', bg: '#DCFCE7', desc: 'Pay monthly maintenance, water and sinking fund dues with instant receipt.' },
  { id: 's2', name: 'Visitor Pass', category: 'Security', icon: 'shield-checkmark-outline', color: '#0284C7', bg: '#E0F2FE', desc: 'Pre-approve entry for guests, cab drivers and delivery partners at the main gate.' },
  { id: 's3', name: 'Plumber', category: 'Repairs', icon: 'water-outline', color: '#2563EB', bg: '#DBEAFE', desc: 'Book society-verified plumber for leakages, tap fittings and piping.' },
  { id: 's4', name: 'Electrician', category: 'Repairs', icon: 'flash-outline', color: '#D97706', bg: '#FEF3C7', desc: 'Short circuits, fans, lights, MCB switches and appliance connections.' },
  { id: 's5', name: 'House Cleaning', category: 'Home', icon: 'sparkles-outline', color: '#E11D48', bg: '#FFE4E6', desc: 'Deep home cleaning, sofa/carpet shampooing and kitchen sanitization.' },
  { id: 's6', name: 'Carpentry', category: 'Repairs', icon: 'hammer-outline', color: '#B45309', bg: '#FDE68A', desc: 'Door locks, furniture repair, hinge alignment and custom woodwork.' },
  { id: 's7', name: 'Clubhouse BBQ', category: 'Amenities', icon: 'flame-outline', color: '#EA580C', bg: '#FFEDD5', desc: 'Reserve society BBQ deck or party hall for weekend family events.' },
  { id: 's8', name: 'Security Desk', category: 'Security', icon: 'call-outline', color: '#4F46E5', bg: '#EEF2FF', desc: 'Connect directly with main gate security guards & supervisor on duty.' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'like', text: 'Ravi Sharma liked your post in Sunrise Apartments', time: '10 min ago', read: false },
  { id: 'n2', type: 'announcement', text: 'Water tank maintenance scheduled for tomorrow morning', time: '1 hour ago', read: false },
  { id: 'n3', type: 'chat', text: 'New messages in General Chat', time: '2 hours ago', read: false },
  { id: 'n4', type: 'service', text: 'Maintenance bill for current month has been generated', time: 'Yesterday', read: true }
];

export const AppDataProvider = ({ children }) => {
  const [cityPosts, setCityPosts] = useState(INITIAL_CITY_POSTS);
  const [societyPosts, setSocietyPosts] = useState(INITIAL_SOCIETY_POSTS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [marketplaceItems, setMarketplaceItems] = useState(INITIAL_MARKETPLACE);
  const [services] = useState(INITIAL_SERVICES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [sosActive, setSosActive] = useState(null);

  // Initial Sync from Node.js Backend API
  useEffect(() => {
    async function loadBackendData() {
      try {
        const societyRes = await api.getSocietyPosts();
        if (societyRes?.posts?.length) setSocietyPosts(societyRes.posts);

        const cityRes = await api.getCityPosts();
        if (cityRes?.posts?.length) setCityPosts(cityRes.posts);

        const groupsRes = await api.getGroups();
        if (groupsRes?.groups?.length) setGroups(groupsRes.groups);

        const marketRes = await api.getMarketplace();
        if (marketRes?.items?.length) setMarketplaceItems(marketRes.items);

        const donorsRes = await api.getDonors();
        if (donorsRes?.donors?.length) setDonors(donorsRes.donors);

        const sosRes = await api.getActiveSOS();
        if (sosRes?.activeSOS) setSosActive(sosRes.activeSOS);
      } catch (_) {}
    }
    loadBackendData();
  }, []);

  // Post Actions
  const addCityPost = (post) => {
    const newPost = {
      ...post,
      id: 'cp_' + Date.now(),
      time: Date.now(),
      likes: [],
      comments: []
    };
    setCityPosts(prev => [newPost, ...prev]);
    addNotification({ type: 'post', text: `You published a new post in ${post.city} Feed` });
    api.createCityPost(newPost).catch(() => {});
  };

  const addSocietyPost = (post) => {
    const newPost = {
      ...post,
      id: 'sp_' + Date.now(),
      time: Date.now(),
      likes: [],
      comments: [],
      isPinned: false
    };
    setSocietyPosts(prev => [newPost, ...prev]);
    addNotification({ type: 'post', text: `You shared a post with ${post.society}` });
    api.createSocietyPost(newPost).catch(() => {});
  };

  const toggleLike = (postId, userId, feedType) => {
    const setter = feedType === 'city' ? setCityPosts : setSocietyPosts;
    setter(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = p.likes.includes(userId);
      return {
        ...p,
        likes: isLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
      };
    }));
    api.toggleLike(postId, userId, feedType).catch(() => {});
  };

  const addComment = (postId, comment, feedType) => {
    const setter = feedType === 'city' ? setCityPosts : setSocietyPosts;
    setter(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [...p.comments, { id: 'c_' + Date.now(), ...comment, time: Date.now() }]
      };
    }));
    api.addComment(postId, comment.author, comment.text, feedType).catch(() => {});
  };

  // Group & Chat Actions
  const createGroup = (group) => {
    const newGroup = {
      ...group,
      id: 'g_' + Date.now(),
      lastMsg: 'Group created! Start chatting with neighbors.',
      time: 'Just now',
      unread: 0,
      members: 1
    };
    setGroups(prev => [newGroup, ...prev]);
    setChatMessages(prev => ({
      ...prev,
      [newGroup.id]: [
        { id: 'sys_1', sender: 'System', text: `Welcome to ${newGroup.name}!`, time: 'Just now', mine: false }
      ]
    }));
    addNotification({ type: 'group', text: `New group created: ${group.name}` });
    api.createGroup(newGroup).catch(() => {});
    return newGroup.id;
  };

  const sendMessage = (groupId, message) => {
    setChatMessages(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), { ...message, id: 'm_' + Date.now() }]
    }));
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, lastMsg: message.mine ? `You: ${message.text}` : `${message.sender}: ${message.text}`, time: 'Just now' } : g
    ));
    api.sendMessage(groupId, message).catch(() => {});
  };

  // Marketplace
  const addMarketplaceItem = (item) => {
    const newItem = {
      ...item,
      id: 'item_' + Date.now(),
      bg: item.type === 'Borrow' ? '#E0F2FE' : '#FEF3C7',
      tagColor: item.type === 'Borrow' ? '#0284C7' : '#D97706'
    };
    setMarketplaceItems(prev => [newItem, ...prev]);
    addNotification({ type: 'marketplace', text: `Item listed: ${item.title}` });
    api.createMarketplaceItem(newItem).catch(() => {});
  };

  // Emergency SOS
  const triggerSOS = (sosData) => {
    setSosActive(sosData);
    addNotification({
      type: 'sos',
      text: `EMERGENCY ALERT: ${sosData.senderName} (${sosData.flat}) triggered SOS in ${sosData.society}!`,
      read: false
    });
    api.triggerSOS(sosData).catch(() => {});
  };

  const dismissSOS = () => {
    setSosActive(null);
    api.dismissSOS().catch(() => {});
  };

  // Notification Actions
  const addNotification = (notif) => {
    setNotifications(prev => [{ id: 'n_' + Date.now(), time: 'Just now', read: false, ...notif }, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppDataContext.Provider value={{
      cityPosts,
      societyPosts,
      groups,
      chatMessages,
      donors,
      marketplaceItems,
      services,
      notifications,
      sosActive,
      unreadCount,
      addCityPost,
      addSocietyPost,
      toggleLike,
      addComment,
      createGroup,
      sendMessage,
      addMarketplaceItem,
      triggerSOS,
      dismissSOS,
      addNotification,
      markAllRead
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
