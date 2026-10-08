const Follow = require('../models/Follow');

// Follow Repository handles all database queries for Follow relationships
const followRepository = {
  // Create a new follow relationship
  createFollow: async (followerId, followingId) => {
    const follow = new Follow({
      follower: followerId,
      following: followingId
    });
    return await follow.save();
  },

  // Find a specific follow relationship between two users
  findFollow: async (followerId, followingId) => {
    return await Follow.findOne({
      follower: followerId,
      following: followingId
    });
  },

  // Delete/unfollow relationship
  deleteFollow: async (followerId, followingId) => {
    return await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId
    });
  },

  // Get all users who are following the given userId
  getFollowers: async (userId) => {
    return await Follow.find({ following: userId })
      .populate('follower', 'name username profileImage bio')
      .sort({ createdAt: -1 });
  },

  // Get all users that the given userId is following
  getFollowing: async (userId) => {
    return await Follow.find({ follower: userId })
      .populate('following', 'name username profileImage bio')
      .sort({ createdAt: -1 });
  },

  // Delete all follow records related to a user (used when user deletes account)
  deleteByUser: async (userId) => {
    return await Follow.deleteMany({
      $or: [{ follower: userId }, { following: userId }]
    });
  }
};

module.exports = followRepository;
