const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected profile management routes (defined before /:id so 'profile' is not treated as an ID)
router.put('/profile', authMiddleware, userController.updateProfile);
router.delete('/profile', authMiddleware, userController.deleteProfile);

// Recommendation routes alias under /api/users
router.get('/recommendations/developers', authMiddleware, recommendationController.getRecommendedDevelopers);
router.get('/recommendations/projects', authMiddleware, recommendationController.getRecommendedProjects);

// Public user discovery routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
