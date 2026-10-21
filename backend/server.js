import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── In-Memory Database (Initial Seed Data) ──
let users = [
  {
    id: 'u1',
    name: 'Aman Verma',
    phone: '9876543210',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    flat: 'B-402',
    bio: 'Resident of Tower B-402, Sunrise Apartments.',
    role: 'member'
  }
];

let societyPosts = [
  {
    id: 'sp1',
    author: 'Ravi Sharma (President)',
    initials: 'RS',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    time: Date.now() - 7200000,
    content: '⚠️ Water supply will be temporarily stopped tomorrow 10:00 AM to 1:00 PM for overhead tank sanitization. Please store sufficient water.',
    likes: ['u2', 'u3', 'u4', 'u5'],
    comments: [
      { id: 'sc1', author: 'Anita Desai', text: 'Thanks for early notice! Will fill the emergency tanks.', time: Date.now() - 3600000 }
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
    content: '📢 Annual General Meeting (AGM) is scheduled for this Sunday at 11:00 AM in the Clubhouse. Agenda: EV charging & security CCTV upgrade.',
    likes: ['u1', 'u2', 'u3'],
    comments: [],
    isPinned: true
  },
  {
    id: 'sp3',
    author: 'Anita Desai',
    initials: 'AD',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    time: Date.now() - 32400000,
    content: 'Anyone interested in daily carpooling to Magneto Mall / IT corridor? Leaving flat at 8:45 AM Mon-Fri. 2 seats open! 🚗',
    likes: ['u1', 'u3'],
    comments: [],
    isPinned: false
  }
];

let cityPosts = [
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
  }
];

let groups = [
  {
    id: 'g1',
    name: 'General Chat',
    type: 'society',
    society: 'Sunrise Apartments',
    lastMsg: 'Kiran: Yes Mr. Patil is great. Very reliable.',
    time: '21:04',
    unread: 2,
    members: 142
  },
  {
    id: 'g2',
    name: 'Green & Gardening Club',
    type: 'society',
    society: 'Sunrise Apartments',
    lastMsg: 'Julia: I have extra basil seedlings for anyone who wants!',
    time: '20:58',
    unread: 1,
    members: 45
  },
  {
    id: 'g4',
    name: 'Raipur Foodies & Cafes 🍕',
    type: 'city',
    society: null,
    lastMsg: 'Priya: Best wood-fired pizza in Shankar Nagar?',
    time: '20:15',
    unread: 4,
    members: 580
  }
];

let chatMessages = {
  'g1': [
    { id: 'm1', sender: 'Ravi Sharma', text: 'Hi neighbors! Does anyone have contact for a dependable AC technician?', time: '20:55', mine: false },
    { id: 'm2', sender: 'Anita Desai', text: 'Hello Ravi! Try Mr. Patil from C-block service desk.', time: '21:00', mine: false },
    { id: 'm3', sender: 'Kiran Patel', text: 'Yes Mr. Patil is great. Very reliable.', time: '21:04', mine: false }
  ]
};

let donors = [
  { id: 'd1', name: 'Vikram Singh', group: 'O+', flat: 'B-402', phone: '98261XXXXX', available: true, lastDonated: '4 months ago' },
  { id: 'd2', name: 'Anjali Desai', group: 'A+', flat: 'A-105', phone: '94252XXXXX', available: true, lastDonated: '8 months ago' },
  { id: 'd3', name: 'Rahul Mehta', group: 'B+', flat: 'C-301', phone: '98930XXXXX', available: false, lastDonated: '1 month ago' },
  { id: 'd4', name: 'Sneha Kapoor', group: 'O-', flat: 'D-204', phone: '97521XXXXX', available: true, lastDonated: '1 year ago' },
  { id: 'd5', name: 'Karan Patel', group: 'AB+', flat: 'A-404', phone: '99811XXXXX', available: true, lastDonated: 'Ready to donate' }
];

let marketplace = [
  { id: 'item1', title: 'Bosch Professional Power Drill', type: 'Borrow', owner: 'Ramesh Singh (B-301)', price: 'Free / Borrow', bg: '#E0F2FE', tagColor: '#0284C7' },
  { id: 'item2', title: 'Kids Bicycle (Age 5-9)', type: 'Sell', owner: 'Priya Sharma (A-204)', price: '₹1,400', bg: '#FEE2E2', tagColor: '#DC2626' },
  { id: 'item3', title: 'Solid Sheesham Study Table', type: 'Sell', owner: 'Amit Patel (C-103)', price: '₹2,600', bg: '#FEF3C7', tagColor: '#D97706' }
];

let activeSOS = null;

// ── API ROUTES ──

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'PadosiConnect Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
  }
  res.json({ success: true, message: `OTP sent to +91 ${phone}`, demoOtp: '0000' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  let user = users.find(u => u.phone === phone);
  if (!user) {
    user = {
      id: 'u_' + Math.random().toString(36).substring(2, 8),
      name: 'Resident',
      phone,
      society: 'Sunrise Apartments',
      city: 'Raipur',
      flat: 'B-402',
      bio: 'Resident of Sunrise Apartments',
      role: 'member'
    };
    users.push(user);
  }
  res.json({ success: true, user, token: 'mock-jwt-token-' + user.id });
});

// 3. Posts Endpoints
app.get('/api/posts/society', (req, res) => {
  res.json({ success: true, posts: societyPosts });
});

app.post('/api/posts/society', (req, res) => {
  const { author, initials, society, city, content } = req.body;
  const newPost = {
    id: 'sp_' + Date.now(),
    author: author || 'Resident',
    initials: initials || 'R',
    society: society || 'Sunrise Apartments',
    city: city || 'Raipur',
    time: Date.now(),
    content,
    likes: [],
    comments: [],
    isPinned: false
  };
  societyPosts.unshift(newPost);
  res.status(201).json({ success: true, post: newPost });
});

app.get('/api/posts/city', (req, res) => {
  res.json({ success: true, posts: cityPosts });
});

app.post('/api/posts/city', (req, res) => {
  const { author, initials, society, city, content } = req.body;
  const newPost = {
    id: 'cp_' + Date.now(),
    author: author || 'Resident',
    initials: initials || 'R',
    society: society || 'Sunrise Apartments',
    city: city || 'Raipur',
    time: Date.now(),
    content,
    likes: [],
    comments: []
  };
  cityPosts.unshift(newPost);
  res.status(201).json({ success: true, post: newPost });
});

app.post('/api/posts/like', (req, res) => {
  const { postId, userId, feedType } = req.body;
  const list = feedType === 'city' ? cityPosts : societyPosts;
  const post = list.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const idx = post.likes.indexOf(userId);
  if (idx > -1) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push(userId);
  }
  res.json({ success: true, likes: post.likes });
});

app.post('/api/posts/comment', (req, res) => {
  const { postId, author, text, feedType } = req.body;
  const list = feedType === 'city' ? cityPosts : societyPosts;
  const post = list.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const newComment = { id: 'c_' + Date.now(), author, text, time: Date.now() };
  post.comments.push(newComment);
  res.status(201).json({ success: true, comment: newComment });
});

// 4. Chat Endpoints
app.get('/api/chats/groups', (req, res) => {
  res.json({ success: true, groups });
});

app.post('/api/chats/groups', (req, res) => {
  const { name, desc, type, society } = req.body;
  const newGroup = {
    id: 'g_' + Date.now(),
    name,
    desc,
    type: type || 'society',
    society,
    lastMsg: 'Group created!',
    time: 'Just now',
    unread: 0,
    members: 1
  };
  groups.unshift(newGroup);
  chatMessages[newGroup.id] = [
    { id: 'm_init', sender: 'System', text: `Welcome to ${name}!`, time: 'Just now', mine: false }
  ];
  res.status(201).json({ success: true, group: newGroup });
});

app.get('/api/chats/messages/:groupId', (req, res) => {
  const msgs = chatMessages[req.params.groupId] || [];
  res.json({ success: true, messages: msgs });
});

app.post('/api/chats/messages/:groupId', (req, res) => {
  const { sender, text, mine } = req.body;
  const { groupId } = req.params;
  const newMsg = {
    id: 'm_' + Date.now(),
    sender,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mine: !!mine
  };
  if (!chatMessages[groupId]) chatMessages[groupId] = [];
  chatMessages[groupId].push(newMsg);

  const group = groups.find(g => g.id === groupId);
  if (group) {
    group.lastMsg = `${sender}: ${text}`;
    group.time = 'Just now';
  }

  res.status(201).json({ success: true, message: newMsg });
});

// 5. Blood Donors Endpoints
app.get('/api/blood/donors', (req, res) => {
  res.json({ success: true, donors });
});

app.post('/api/blood/request', (req, res) => {
  const { requester, group, society } = req.body;
  res.json({
    success: true,
    message: `Urgent blood request broadcasted to all ${society} registered donors!`
  });
});

// 6. Marketplace Endpoints
app.get('/api/marketplace', (req, res) => {
  res.json({ success: true, items: marketplace });
});

app.post('/api/marketplace', (req, res) => {
  const { title, type, owner, price } = req.body;
  const newItem = {
    id: 'item_' + Date.now(),
    title,
    type,
    owner,
    price,
    bg: type === 'Borrow' ? '#E0F2FE' : '#FEF3C7',
    tagColor: type === 'Borrow' ? '#0284C7' : '#D97706'
  };
  marketplace.unshift(newItem);
  res.status(201).json({ success: true, item: newItem });
});

// 7. SOS Emergency Endpoints
app.post('/api/sos/trigger', (req, res) => {
  const { senderName, flat, society, phone } = req.body;
  activeSOS = {
    senderName,
    flat,
    society,
    phone,
    timestamp: Date.now()
  };
  res.status(201).json({ success: true, sos: activeSOS });
});

app.get('/api/sos/active', (req, res) => {
  res.json({ success: true, activeSOS });
});

app.post('/api/sos/dismiss', (req, res) => {
  activeSOS = null;
  res.json({ success: true, message: 'SOS dismissed' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[PadosiConnect Backend] Server running at http://localhost:${PORT}`);
  console.log(`[PadosiConnect Backend] Health check: http://localhost:${PORT}/api/health`);
});
