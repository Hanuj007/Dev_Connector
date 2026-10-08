import api from './client';

export const messageApi = {
  sendMessage: async (receiver, text) => {
    const res = await api.post('/api/messages', { receiver, text });
    return res.data.data;
  },

  getConversation: async (userId) => {
    const res = await api.get(`/api/messages/${userId}`);
    return res.data.messages;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/api/messages/${id}/read`);
    return res.data.data;
  },

  deleteMessage: async (id) => {
    const res = await api.delete(`/api/messages/${id}`);
    return res.data;
  },

  checkPermission: async (userId) => {
    const res = await api.get(`/api/messages/permission/${userId}`);
    return res.data;
  }
};
