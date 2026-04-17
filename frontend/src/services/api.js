import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
};

export const tournamentAPI = {
  // Supports advanced filters: minPrize, maxPrize, format, region
  getAll: (params) => API.get('/tournaments', { params }),
  getById: (id) => API.get(`/tournaments/${id}`),
  register: (id) => API.post(`/tournaments/${id}/register`),
  myRegistrations: () => API.get('/tournaments/user/registered'),
  toggleBookmark: (id) => API.post(`/tournaments/${id}/bookmark`),
  myBookmarks: () => API.get('/tournaments/user/bookmarks'),
};

export const notificationAPI = {
  get: () => API.get('/notifications'),
  markRead: (id) => API.post(`/notifications/${id}/read`),
  markAllRead: () => API.post('/notifications/read-all'),
};

export const leaderboardAPI = {
  get: (params) => API.get('/leaderboard', { params }),
};

export const chatAPI = {
  send: (data) => API.post('/chat', data),
};

export default API;
