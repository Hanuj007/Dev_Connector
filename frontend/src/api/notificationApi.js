import api from './client';

export const notificationApi = {
  getNotifications: async () => {
    const res = await api.get('/api/notifications');
    return res.data.notifications;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/api/notifications/${id}/read`);
    return res.data.notification;
  },

  markAllAsRead: async () => {
    const res = await api.put('/api/notifications/read-all');
    return res.data;
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`/api/notifications/${id}`);
    return res.data;
  }
};
