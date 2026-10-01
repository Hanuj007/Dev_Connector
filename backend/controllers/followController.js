const mongoose = require('mongoose');
const followRepository = require('../repositories/followRepository');
const userRepository = require('../repositories/userRepository');
const notificationService = require('../services/notificationService');

// Follow Controller handles developer following and unfollowing
const followController = {
  // POST /api/follows/:userId - Follow another developer (Protected)
  followUser: async (req, res, next) => {
    try {
      const targetUserId = req.params.userId;
      const currentUserId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        return res.status(404).json({ message: 'User not found (invalid ID format)' });
      }

      // User cannot follow themselves
      if (String(currentUserId) === String(targetUserId)) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
      }

      // Check if target user exists
      const targetUser = await userRepository.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: 'User to follow not found' });
      }

      // Check if already following
      const existingFollow = await followRepository.findFollow(currentUserId, targetUserId);
      if (existingFollow) {
        return res.status(400).json({ message: 'You are already following this developer' });
      }

      // Create follow relationship
      const follow = await followRepository.createFollow(currentUserId, targetUserId);

      // Create notification for the followed user
      await notificationService.notifyFollow(req.user, targetUserId);

      return res.status(201).json({
        message: 'Successfully followed developer',
        follow
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/follows/:userId - Unfollow a developer (Protected)
  unfollowUser: async (req, res, next) => {
    try {
      const targetUserId = req.params.userId;
      const currentUserId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        return res.status(404).json({ message: 'User not found (invalid ID format)' });
      }

      // Check if follow relationship exists
      const existingFollow = await followRepository.findFollow(currentUserId, targetUserId);
      if (!existingFollow) {
        return res.status(400).json({ message: 'You are not following this developer' });
      }

      // Delete follow relationship
      await followRepository.deleteFollow(currentUserId, targetUserId);

      return res.status(200).json({
        message: 'Successfully unfollowed developer'
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/follows/followers/:userId - Get list of users following this developer
  getFollowers: async (req, res, next) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ message: 'User not found (invalid ID format)' });
      }

      const followers = await followRepository.getFollowers(userId);

      return res.status(200).json({
        count: followers.length,
        followers
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/follows/following/:userId - Get list of users this developer is following
  getFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ message: 'User not found (invalid ID format)' });
      }

      const following = await followRepository.getFollowing(userId);

      return res.status(200).json({
        count: following.length,
        following
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = followController;
