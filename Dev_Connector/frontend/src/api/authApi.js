import api from './client';

export const authApi = {
  register: async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data.user;
  }
};
