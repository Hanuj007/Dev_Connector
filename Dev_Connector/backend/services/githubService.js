const axios = require('axios');
const githubRepository = require('../repositories/githubRepository');

// Base GitHub API URL
const GITHUB_API = process.env.GITHUB_API || 'https://api.github.com';

// GitHub Service handles external requests to GitHub REST API and repository processing
const githubService = {
  // Fetch public repositories of any GitHub username
  fetchUserRepos: async (username) => {
    try {
      const response = await axios.get(
        `${GITHUB_API}/users/${username}/repos?per_page=10&sort=updated`,
        {
          headers: {
            'User-Agent': 'Dev-Connector-App',
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      // Return clean formatted repository data
      return response.data.map((repo) => ({
        repoId: String(repo.id),
        name: repo.name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        language: repo.language || '',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0
      }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const notFoundError = new Error(`GitHub user '${username}' not found`);
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      const apiError = new Error(
        `Failed to fetch repositories from GitHub: ${error.message}`
      );
      apiError.statusCode = error.response ? error.response.status : 500;
      throw apiError;
    }
  },

  // Sync and save logged-in user's GitHub repositories to database
  syncUserRepos: async (userId, githubUsername) => {
    if (!githubUsername) {
      const error = new Error('No GitHub username associated with this account. Please update your profile first.');
      error.statusCode = 400;
      throw error;
    }

    // Fetch repositories from GitHub API
    const repos = await githubService.fetchUserRepos(githubUsername);

    // Save/update each repository in database
    const savedRepos = [];
    for (const repo of repos) {
      const saved = await githubRepository.saveRepository({
        user: userId,
        repoId: repo.repoId,
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.htmlUrl,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks
      });
      savedRepos.push(saved);
    }

    return savedRepos;
  }
};

module.exports = githubService;
