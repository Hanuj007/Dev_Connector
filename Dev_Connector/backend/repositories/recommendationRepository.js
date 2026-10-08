const User = require('../models/User');
const GithubRepository = require('../models/GithubRepository');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

// Recommendation Repository encapsulates all database queries required for computing recommendations
const recommendationRepository = {
  // Find a specific user by ID (excludes password)
  getUserById: async (userId) => {
    return await User.findById(userId).select('-password');
  },

  // Get all candidate developers excluding the specified user ID
  getAllCandidateUsers: async (excludeUserId) => {
    return await User.find({ _id: { $ne: excludeUserId } })
      .select('-password')
      .sort({ createdAt: -1 });
  },

  // Get all repositories belonging to a specific user
  getUserRepositories: async (userId) => {
    return await GithubRepository.find({ user: userId });
  },

  // Get all repositories from all developers except the specified user (populated with author info)
  getAllCandidateProjects: async (excludeUserId) => {
    return await GithubRepository.find({ user: { $ne: excludeUserId } })
      .populate('user', 'name username skills profileImage')
      .sort({ stars: -1, createdAt: -1 });
  },

  // Get posts created by a specific user
  getUserCreatedPosts: async (userId) => {
    return await Post.find({ user: userId }).sort({ createdAt: -1 });
  },

  // Get all posts liked by a specific user
  getUserLikedPosts: async (userId) => {
    return await Post.find({ likes: userId })
      .populate('user', 'name username skills')
      .sort({ createdAt: -1 });
  },

  // Get follow relationships for a user
  getUserFollowings: async (userId) => {
    return await Follow.find({ follower: userId }).populate('following', 'skills name');
  }
};

module.exports = recommendationRepository;
