import api from './client';

export const recommendationApi = {
  getRecommendedDevelopers: async (options = {}) => {
    const params = {};
    if (options.limit) params.limit = options.limit;
    if (options.minScore) params.minScore = options.minScore;

    const res = await api.get('/api/recommendations/developers', { params });
    return res.data.developers;
  },

  getRecommendedProjects: async (options = {}) => {
    const params = {};
    if (options.limit) params.limit = options.limit;
    if (options.minScore) params.minScore = options.minScore;

    const res = await api.get('/api/recommendations/projects', { params });
    return res.data.projects;
  },

  getUserInterestProfile: async () => {
    const res = await api.get('/api/recommendations/profile');
    return res.data.profile;
  }
};
