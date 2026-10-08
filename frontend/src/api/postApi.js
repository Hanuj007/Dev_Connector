import api from './client';

export const postApi = {
  getAllPosts: async () => {
    const res = await api.get('/api/posts');
    return res.data.posts;
  },

  getPostById: async (id) => {
    const res = await api.get(`/api/posts/${id}`);
    return res.data.post;
  },

  createPost: async (text) => {
    const res = await api.post('/api/posts', { text });
    return res.data.post;
  },

  updatePost: async (id, text) => {
    const res = await api.put(`/api/posts/${id}`, { text });
    return res.data.post;
  },

  deletePost: async (id) => {
    const res = await api.delete(`/api/posts/${id}`);
    return res.data;
  },

  likePost: async (id) => {
    const res = await api.put(`/api/posts/${id}/like`);
    return res.data.likes;
  },

  unlikePost: async (id) => {
    const res = await api.put(`/api/posts/${id}/unlike`);
    return res.data.likes;
  }
};
