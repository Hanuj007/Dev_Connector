const GithubRepository = require('../models/GithubRepository');

// GitHub Repository handles all database queries for cached developer repositories
const githubRepository = {
  // Upsert (insert or update) a repository for a user
  saveRepository: async (repoData) => {
    return await GithubRepository.findOneAndUpdate(
      { user: repoData.user, repoId: String(repoData.repoId) },
      repoData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },

  // Find all cached repositories for a specific user
  findByUser: async (userId) => {
    return await GithubRepository.find({ user: userId }).sort({ stars: -1, createdAt: -1 });
  },

  // Delete all cached repositories for a user
  deleteByUser: async (userId) => {
    return await GithubRepository.deleteMany({ user: userId });
  }
};

module.exports = githubRepository;
