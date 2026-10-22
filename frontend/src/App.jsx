import React, { useState, useEffect } from 'react';
import { api } from './api';
import { onFirebaseAuthStateChange, firebaseLogout } from './firebase';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SOSBanner from './components/SOSBanner';
import SOSModal from './components/SOSModal';
import AuthModal from './components/AuthModal';
import NewPostModal from './components/NewPostModal';

// Views
import NoticeboardView from './components/NoticeboardView';
import CityPulseView from './components/CityPulseView';
import CommunityChatsView from './components/CommunityChatsView';
import BloodBankView from './components/BloodBankView';
import MarketplaceView from './components/MarketplaceView';
import ServicesView from './components/ServicesView';
import SOSAlertCenterView from './components/SOSAlertCenterView';
import ProfileView from './components/ProfileView';

export default function App() {
  // User & Society State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('padosi_user');
    return saved ? JSON.parse(saved) : {
      uid: 'u1',
      name: 'Aman Verma',
      phone: '9876543210',
      email: 'aman.verma@example.com',
      society: 'Sunrise Apartments',
      city: 'Raipur',
      flat: 'B-402',
      role: 'member'
    };
  });

  const [currentSociety, setCurrentSociety] = useState('Sunrise Apartments');
  const [currentTab, setCurrentTab] = useState('society');

  // Feeds & Data
  const [societyPosts, setSocietyPosts] = useState([
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
        { id: 'sc1', author: 'Anita Desai', text: 'Thanks for early notice! Will fill the emergency tanks.' }
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
  ]);

  const [cityPosts, setCityPosts] = useState([
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
        { id: 'c1', author: 'Rohit Jain', text: 'Dr. Mehra on MG Road is excellent and very gentle with kids!' }
      ]
    },
    {
      id: 'cp2',
      author: 'Vikram Thakur',
      initials: 'VT',
      society: 'Palm Heights',
      city: 'Raipur',
      time: Date.now() - 7200000,
      content: 'Traffic alert ⚠️ Telibandha road is completely jammed due to pipeline work. Avoid if possible and use the VIP ring road bypass.',
      likes: ['u1', 'u5', 'u6'],
      comments: [
        { id: 'c2', author: 'Neha Agarwal', text: 'Thanks a lot for the heads up! Saved 40 mins.' }
      ]
    }
  ]);

  // Chats
  const [groups, setGroups] = useState([
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
  ]);
  const [activeGroupId, setActiveGroupId] = useState('g1');
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', sender: 'Ravi Sharma', text: 'Hi neighbors! Does anyone have contact for a dependable AC technician?', time: '20:55', mine: false },
    { id: 'm2', sender: 'Anita Desai', text: 'Hello Ravi! Try Mr. Patil from C-block service desk.', time: '21:00', mine: false },
    { id: 'm3', sender: 'Kiran Patel', text: 'Yes Mr. Patil is great. Very reliable.', time: '21:04', mine: false }
  ]);

  // Donors
  const [donors, setDonors] = useState([
    { id: 'd1', name: 'Vikram Singh', group: 'O+', flat: 'B-402', phone: '98261XXXXX', available: true, lastDonated: '4 months ago' },
    { id: 'd2', name: 'Anjali Desai', group: 'A+', flat: 'A-105', phone: '94252XXXXX', available: true, lastDonated: '8 months ago' },
    { id: 'd3', name: 'Rahul Mehta', group: 'B+', flat: 'C-301', phone: '98930XXXXX', available: false, lastDonated: '1 month ago' },
    { id: 'd4', name: 'Sneha Kapoor', group: 'O-', flat: 'D-204', phone: '97521XXXXX', available: true, lastDonated: '1 year ago' },
    { id: 'd5', name: 'Karan Patel', group: 'AB+', flat: 'A-404', phone: '99811XXXXX', available: true, lastDonated: 'Ready to donate' }
  ]);

  // Marketplace
  const [marketplaceItems, setMarketplaceItems] = useState([
    { id: 'item1', title: 'Bosch Professional Power Drill', type: 'Borrow', owner: 'Ramesh Singh (B-301)', price: 'Free / Borrow' },
    { id: 'item2', title: 'Kids Bicycle (Age 5-9)', type: 'Sell', owner: 'Priya Sharma (A-204)', price: '₹1,400' },
    { id: 'item3', title: 'Solid Sheesham Study Table', type: 'Sell', owner: 'Amit Patel (C-103)', price: '₹2,600' }
  ]);

  // Services
  const [services, setServices] = useState([
    { id: 's1', name: 'Ramesh Patil', role: 'AC & Refrigerator Tech', rating: 4.9, reviews: 38, phone: '+91 98261 11223', category: 'Appliance', timing: '9 AM - 8 PM' },
    { id: 's2', name: 'Sunil Kumar', role: 'Master Electrician', rating: 4.8, reviews: 52, phone: '+91 98262 33445', category: 'Electrical', timing: '24/7 Emergency' },
    { id: 's3', name: 'Mohan Lal Verma', role: 'Plumbing & Tank Sanitization', rating: 4.7, reviews: 41, phone: '+91 98263 55667', category: 'Plumbing', timing: '8 AM - 9 PM' },
    { id: 's4', name: 'Pooja Bai', role: 'Housekeeping Coordinator', rating: 4.9, reviews: 29, phone: '+91 98264 77889', category: 'Cleaning', timing: '7 AM - 6 PM' },
    { id: 's5', name: 'Sunrise Gate Security', role: 'Main Gate & Intercom Desk', rating: 5.0, reviews: 84, phone: '+91 98265 99001', category: 'Security', timing: '24/7 Desk' },
    { id: 's6', name: 'Santosh Carpenter', role: 'Modular Kitchen & Woodwork', rating: 4.6, reviews: 19, phone: '+91 98266 12345', category: 'Carpentry', timing: '10 AM - 7 PM' }
  ]);

  // SOS State
  const [activeSOS, setActiveSOS] = useState(null);

  // Modals
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostDefaultScope, setNewPostDefaultScope] = useState('society');

  // Firebase Auth Listener
  useEffect(() => {
    const unsub = onFirebaseAuthStateChange((authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.setItem('padosi_user', JSON.stringify(authUser));
      }
    });
    return () => unsub();
  }, []);

  // Fetch initial data from Express Backend
  useEffect(() => {
    async function loadData() {
      try {
        const [socRes, cityRes, grpRes, donRes, mktRes, srvRes, sosRes] = await Promise.allSettled([
          api.getSocietyPosts(),
          api.getCityPosts(),
          api.getGroups(),
          api.getDonors(),
          api.getMarketplace(),
          api.getServices(),
          api.getActiveSOS()
        ]);

        if (socRes.status === 'fulfilled' && socRes.value.posts) setSocietyPosts(socRes.value.posts);
        if (cityRes.status === 'fulfilled' && cityRes.value.posts) setCityPosts(cityRes.value.posts);
        if (grpRes.status === 'fulfilled' && grpRes.value.groups) setGroups(grpRes.value.groups);
        if (donRes.status === 'fulfilled' && donRes.value.donors) setDonors(donRes.value.donors);
        if (mktRes.status === 'fulfilled' && mktRes.value.items) setMarketplaceItems(mktRes.value.items);
        if (srvRes.status === 'fulfilled' && srvRes.value.services) setServices(srvRes.value.services);
        if (sosRes.status === 'fulfilled' && sosRes.value.activeSOS) setActiveSOS(sosRes.value.activeSOS);
      } catch (err) {
        console.warn('Backend connection notice: running with current community state');
      }
    }
    loadData();
  }, []);

  // Poll SOS status every 5 seconds for real-time safety
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.getActiveSOS();
        if (res && res.activeSOS !== undefined) {
          setActiveSOS(res.activeSOS);
        }
      } catch {
        // Backend not reached, keep current
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleLikePost = async (postId, userId, feedType) => {
    try {
      await api.likePost(postId, userId, feedType);
    } catch {
      // Local fallback
    }
    const updateList = (list) =>
      list.map((p) => {
        if (p.id !== postId) return p;
        const exists = p.likes?.includes(userId);
        const newLikes = exists ? p.likes.filter((id) => id !== userId) : [...(p.likes || []), userId];
        return { ...p, likes: newLikes };
      });

    if (feedType === 'city') setCityPosts(updateList);
    else setSocietyPosts(updateList);
  };

  const handleCommentPost = async (postId, author, text, feedType) => {
    const newComment = { id: 'c_' + Date.now(), author, text };
    try {
      await api.commentPost(postId, author, text, feedType);
    } catch {
      // Local fallback
    }
    const updateList = (list) =>
      list.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));

    if (feedType === 'city') setCityPosts(updateList);
    else setSocietyPosts(updateList);
  };

  const handleCreatePost = async (postData) => {
    if (postData.scope === 'city') {
      try {
        const res = await api.createCityPost(postData);
        if (res.post) setCityPosts([res.post, ...cityPosts]);
      } catch {
        const localPost = { id: 'cp_' + Date.now(), ...postData, likes: [], comments: [] };
        setCityPosts([localPost, ...cityPosts]);
      }
    } else {
      try {
        const res = await api.createSocietyPost(postData);
        if (res.post) setSocietyPosts([res.post, ...societyPosts]);
      } catch {
        const localPost = { id: 'sp_' + Date.now(), ...postData, likes: [], comments: [] };
        setSocietyPosts([localPost, ...societyPosts]);
      }
    }
  };

  const handleSendMessage = async (groupId, msgData) => {
    const newMsg = {
      id: 'm_' + Date.now(),
      sender: msgData.sender,
      text: msgData.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true
    };
    setChatMessages((prev) => [...prev, newMsg]);

    try {
      await api.sendMessage(groupId, msgData);
    } catch {
      // Offline fallback
    }
  };

  const handleCreateGroup = async (groupData) => {
    const newGrp = {
      id: 'g_' + Date.now(),
      name: groupData.name,
      type: groupData.type,
      society: groupData.society,
      lastMsg: 'Group created!',
      time: 'Just now',
      unread: 0,
      members: 1
    };
    setGroups([newGrp, ...groups]);
    setActiveGroupId(newGrp.id);
    setChatMessages([{ id: 'm_init', sender: 'System', text: `Welcome to ${newGrp.name}!`, time: 'Now' }]);

    try {
      await api.createGroup(groupData);
    } catch {
      // Local
    }
  };

  const handleTriggerSOS = async (sosData) => {
    setActiveSOS(sosData);
    try {
      await api.triggerSOS(sosData);
    } catch {
      // Local
    }
  };

  const handleDismissSOS = async () => {
    setActiveSOS(null);
    try {
      await api.dismissSOS();
    } catch {
      // Local
    }
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    localStorage.setItem('padosi_user', JSON.stringify(authUser));
  };

  const handleLogout = async () => {
    await firebaseLogout();
    setUser(null);
    localStorage.removeItem('padosi_user');
  };

  const handleUpdateProfile = (updatedDetails) => {
    const merged = { ...user, ...updatedDetails };
    setUser(merged);
    localStorage.setItem('padosi_user', JSON.stringify(merged));
  };

  return (
    <div>
      {/* Top Persistent SOS Siren Alert */}
      <SOSBanner
        activeSOS={activeSOS}
        onDismiss={handleDismissSOS}
      />

      {/* Main Header / Navbar */}
      <Navbar
        currentSociety={currentSociety}
        onSelectSociety={setCurrentSociety}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        unreadNotifications={activeSOS ? 1 : 0}
        onNavigateProfile={() => setCurrentTab('profile')}
      />

      {/* App Body: Sidebar + Views */}
      <div className="app-container">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          user={user}
          onOpenSOS={() => setIsSOSModalOpen(true)}
        />

        <main className="main-content">
          {currentTab === 'society' && (
            <NoticeboardView
              posts={societyPosts}
              user={user}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onOpenNewPost={() => {
                setNewPostDefaultScope('society');
                setIsNewPostModalOpen(true);
              }}
              currentSociety={currentSociety}
            />
          )}

          {currentTab === 'city' && (
            <CityPulseView
              posts={cityPosts}
              user={user}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onOpenNewPost={() => {
                setNewPostDefaultScope('city');
                setIsNewPostModalOpen(true);
              }}
            />
          )}

          {currentTab === 'chats' && (
            <CommunityChatsView
              groups={groups}
              user={user}
              activeGroupId={activeGroupId}
              onSelectGroup={(id) => {
                setActiveGroupId(id);
                // Fetch group messages if needed
                api.getMessages(id).then((res) => {
                  if (res && res.messages) setChatMessages(res.messages);
                }).catch(() => {});
              }}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onCreateGroup={handleCreateGroup}
            />
          )}

          {currentTab === 'blood' && (
            <BloodBankView
              donors={donors}
              user={user}
              onRequestBlood={(req) => {
                api.requestBlood(req).catch(() => {});
              }}
            />
          )}

          {currentTab === 'marketplace' && (
            <MarketplaceView
              items={marketplaceItems}
              user={user}
              onCreateItem={async (item) => {
                const newItem = { id: 'item_' + Date.now(), ...item };
                setMarketplaceItems([newItem, ...marketplaceItems]);
                try {
                  await api.createMarketplaceItem(item);
                } catch {
                  // Local
                }
              }}
            />
          )}

          {currentTab === 'services' && (
            <ServicesView
              services={services}
              onCreateService={async (srv) => {
                const newSrv = { id: 's_' + Date.now(), ...srv, rating: 5.0, reviews: 1 };
                setServices([...services, newSrv]);
                try {
                  await api.createService(srv);
                } catch {
                  // Local
                }
              }}
            />
          )}

          {currentTab === 'sos' && (
            <SOSAlertCenterView
              activeSOS={activeSOS}
              onOpenSOS={() => setIsSOSModalOpen(true)}
              onDismissSOS={handleDismissSOS}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        user={user}
        onTrigger={handleTriggerSOS}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        user={user}
        currentSociety={currentSociety}
        defaultScope={newPostDefaultScope}
        onSubmitPost={handleCreatePost}
      />
    </div>
  );
}
