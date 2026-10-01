const mongoose = require('mongoose');
const userRepository = require('../repositories/userRepository');
const postRepository = require('../repositories/postRepository');
const followRepository = require('../repositories/followRepository');
const messageRepository = require('../repositories/messageRepository');
const notificationRepository = require('../repositories/notificationRepository');
const githubRepository = require('../repositories/githubRepository');

// User Controller handles user profile retrieval, updates, and deletion
const userController = {
  // GET /api/users - Get all developers
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userRepository.findAll();
      return res.status(200).json({
        count: users.length,
        users
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/:id - Get developer profile by ID
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'User not found (invalid ID format)' });
      }

      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/users/profile - Update logged-in user's profile
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { name, username, bio, skills, githubUsername, profileImage } = req.body;

      // If username is being changed, check if the new username is already taken
      if (username) {
        const existing = await userRepository.findByUsername(username);
        if (existing && String(existing._id) !== String(userId)) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
      }

      // Fields to update
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (username !== undefined) updateData.username = username;
      if (bio !== undefined) updateData.bio = bio;
      if (skills !== undefined) {
        // If skills is a comma-separated string, convert to array
        updateData.skills = Array.isArray(skills)
          ? skills
          : skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (githubUsername !== undefined) updateData.githubUsername = githubUsername;
      if (profileImage !== undefined) updateData.profileImage = profileImage;

      const updatedUser = await userRepository.updateUser(userId, updateData);

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/users/profile - Delete logged-in user and cascade clean related data
  deleteProfile: async (req, res, next) => {
    try {
      const userId = req.user._id;

      // Cascade delete all user records from other collections
      await postRepository.deleteByUser(userId);
      await followRepository.deleteByUser(userId);
      await messageRepository.deleteByUser(userId);
      await notificationRepository.deleteByUser(userId);
      await githubRepository.deleteByUser(userId);

      // Finally delete user
      await userRepository.deleteUser(userId);

      return res.status(200).json({
        message: 'User account and all associated data deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
