import api from './client';

export const followApi = {
  followUser: async (userId) => {
    const res = await api.post(`/api/follows/${userId}`);
    return res.data;
  },

  unfollowUser: async (userId) => {
    const res = await api.delete(`/api/follows/${userId}`);
    return res.data;
  },

  getFollowers: async (userId) => {
    const res = await api.get(`/api/follows/followers/${userId}`);
    return res.data.followers;
  },

  getFollowing: async (userId) => {
    const res = await api.get(`/api/follows/following/${userId}`);
    return res.data.following;
  },

  checkFollowStatus: async (userId) => {
    const res = await api.get(`/api/follows/status/${userId}`);
    return res.data.isFollowing;
  }
};
