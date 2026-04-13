import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
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
  getAll: (params) => API.get('/tournaments', { params }),
  getById: (id) => API.get(`/tournaments/${id}`),
  register: (id) => API.post(`/tournaments/${id}/register`),
  myRegistrations: () => API.get('/tournaments/user/registered'),
};

export const leaderboardAPI = {
  get: (params) => API.get('/leaderboard', { params }),
};

export const chatAPI = {
  send: (data) => API.post('/chat', data),
};

export default API;
