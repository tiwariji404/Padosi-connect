// API Client Service for connecting React Frontend to Express Backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed fetch to ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => safeFetch('/health'),

  // Feeds
  getSocietyPosts: () => safeFetch('/posts/society'),
  createSocietyPost: (data) => safeFetch('/posts/society', { method: 'POST', body: JSON.stringify(data) }),
  getCityPosts: () => safeFetch('/posts/city'),
  createCityPost: (data) => safeFetch('/posts/city', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (postId, userId, feedType) => safeFetch('/posts/like', {
    method: 'POST',
    body: JSON.stringify({ postId, userId, feedType })
  }),
  commentPost: (postId, author, text, feedType) => safeFetch('/posts/comment', {
    method: 'POST',
    body: JSON.stringify({ postId, author, text, feedType })
  }),

  // Chats
  getGroups: () => safeFetch('/chats/groups'),
  createGroup: (data) => safeFetch('/chats/groups', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: (groupId) => safeFetch(`/chats/messages/${groupId}`),
  sendMessage: (groupId, data) => safeFetch(`/chats/messages/${groupId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Blood Bank
  getDonors: () => safeFetch('/blood/donors'),
  requestBlood: (data) => safeFetch('/blood/request', { method: 'POST', body: JSON.stringify(data) }),

  // Marketplace
  getMarketplace: () => safeFetch('/marketplace'),
  createMarketplaceItem: (data) => safeFetch('/marketplace', { method: 'POST', body: JSON.stringify(data) }),

  // Services
  getServices: () => safeFetch('/services'),
  createService: (data) => safeFetch('/services', { method: 'POST', body: JSON.stringify(data) }),

  // SOS Emergency
  triggerSOS: (data) => safeFetch('/sos/trigger', { method: 'POST', body: JSON.stringify(data) }),
  getActiveSOS: () => safeFetch('/sos/active'),
  dismissSOS: () => safeFetch('/sos/dismiss', { method: 'POST' }),

  // User Profile
  getProfile: (userId) => safeFetch(`/users/profile/${userId}`),
  updateProfile: (userId, data) => safeFetch(`/users/profile/${userId}`, { method: 'PUT', body: JSON.stringify(data) })
};
