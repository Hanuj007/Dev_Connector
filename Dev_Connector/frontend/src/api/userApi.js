import api from './client';

export const userApi = {
  getAllUsers: async () => {
    const res = await api.get('/api/users');
    return res.data.users;
  },

  getUserById: async (id) => {
    const res = await api.get(`/api/users/${id}`);
    return res.data.user;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/api/users/profile', profileData);
    return res.data.user;
  },

  deleteProfile: async () => {
    const res = await api.delete('/api/users/profile');
    return res.data;
  }
};
