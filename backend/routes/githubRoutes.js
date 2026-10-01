const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected route to sync & get logged-in user's repositories
// Note: Placed BEFORE /:username so 'repositories' is not matched as a username
router.get('/repositories', authMiddleware, githubController.getUserRepositories);

// Public route to fetch public GitHub repositories by username
router.get('/:username', githubController.getGithubReposByUsername);

module.exports = router;
