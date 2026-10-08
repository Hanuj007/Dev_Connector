const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes for viewing follower / following lists
router.get('/followers/:userId', followController.getFollowers);
router.get('/following/:userId', followController.getFollowing);

// Protected routes for follow / unfollow actions and status check
router.get('/status/:userId', authMiddleware, followController.checkFollowStatus);
router.post('/:userId', authMiddleware, followController.followUser);
router.delete('/:userId', authMiddleware, followController.unfollowUser);

module.exports = router;
