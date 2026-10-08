const githubService = require('../services/githubService');

// GitHub Controller handles GitHub API calls and syncing repos
const githubController = {
  // GET /api/github/:username - Fetch public repositories for any GitHub username
  getGithubReposByUsername: async (req, res, next) => {
    try {
      const { username } = req.params;

      if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'GitHub username is required' });
      }

      const repositories = await githubService.fetchUserRepos(username.trim());

      return res.status(200).json({
        count: repositories.length,
        repositories
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/github/repositories - Fetch and sync logged-in user's GitHub repositories (Protected)
  getUserRepositories: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const githubUsername = req.user.githubUsername;

      if (!githubUsername || githubUsername.trim() === '') {
        return res.status(400).json({
          message: 'No GitHub username linked. Please update your profile with your githubUsername first.'
        });
      }

      const savedRepos = await githubService.syncUserRepos(userId, githubUsername.trim());

      return res.status(200).json({
        message: 'GitHub repositories synced and stored successfully',
        count: savedRepos.length,
        repositories: savedRepos
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = githubController;
