import api from './client';

export const githubApi = {
  getGithubRepos: async (username) => {
    const res = await api.get(`/api/github/${username}`);
    return res.data.repositories;
  },

  syncUserRepos: async () => {
    const res = await api.get('/api/github/repositories');
    return res.data.repositories;
  }
};
