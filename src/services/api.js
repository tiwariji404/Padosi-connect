import { Platform } from 'react-native';

// In Web / Local emulator, backend runs at localhost:5000
// On physical Android devices via Expo Go, you can point to your local machine IP
const API_BASE_URL = Platform.select({
  web: 'http://localhost:5000/api',
  android: 'http://10.0.2.2:5000/api', // Android Emulator loopback
  default: 'http://localhost:5000/api',
});

async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast fallback
    options.signal = controller.signal;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Graceful offline fallback indicator
    return null;
  }
}

export const api = {
  checkHealth: () => apiRequest('/health'),

  // Auth
  login: (phone) => apiRequest('/auth/login', 'POST', { phone }),
  verifyOTP: (phone, otp) => apiRequest('/auth/verify-otp', 'POST', { phone, otp }),

  // Posts
  getSocietyPosts: () => apiRequest('/posts/society'),
  createSocietyPost: (post) => apiRequest('/posts/society', 'POST', post),
  getCityPosts: () => apiRequest('/posts/city'),
  createCityPost: (post) => apiRequest('/posts/city', 'POST', post),
  toggleLike: (postId, userId, feedType) => apiRequest('/posts/like', 'POST', { postId, userId, feedType }),
  addComment: (postId, author, text, feedType) => apiRequest('/posts/comment', 'POST', { postId, author, text, feedType }),

  // Groups & Chat
  getGroups: () => apiRequest('/chats/groups'),
  createGroup: (group) => apiRequest('/chats/groups', 'POST', group),
  getMessages: (groupId) => apiRequest(`/chats/messages/${groupId}`),
  sendMessage: (groupId, msg) => apiRequest(`/chats/messages/${groupId}`, 'POST', msg),

  // Blood & SOS
  getDonors: () => apiRequest('/blood/donors'),
  requestBlood: (data) => apiRequest('/blood/request', 'POST', data),
  triggerSOS: (data) => apiRequest('/sos/trigger', 'POST', data),
  getActiveSOS: () => apiRequest('/sos/active'),
  dismissSOS: () => apiRequest('/sos/dismiss', 'POST'),

  // Marketplace
  getMarketplace: () => apiRequest('/marketplace'),
  createMarketplaceItem: (item) => apiRequest('/marketplace', 'POST', item),
};
