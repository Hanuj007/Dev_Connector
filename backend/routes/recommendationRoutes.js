const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// All recommendation routes require user authentication
router.use(authMiddleware);

// GET /api/recommendations/developers - Get recommended developers based on technology stack similarity
router.get('/developers', recommendationController.getRecommendedDevelopers);

// GET /api/recommendations/projects - Get recommended projects based on user activity and tech interests
router.get('/projects', recommendationController.getRecommendedProjects);

// GET /api/recommendations/profile - Get current user's calculated technology interest profile
router.get('/profile', recommendationController.getUserInterestProfile);

module.exports = router;
