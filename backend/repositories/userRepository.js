const User = require('../models/User');

// User Repository handles all database operations for Users
const userRepository = {
  // Create a new user
  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  // Find user by email (includes password for authentication check)
  findByEmail: async (email) => {
    return await User.findOne({ email: email.toLowerCase() });
  },

  // Find user by username
  findByUsername: async (username) => {
    return await User.findOne({ username }).select('-password');
  },

  // Find user by ID (excludes password)
  findById: async (id) => {
    return await User.findById(id).select('-password');
  },

  // Find all users (excludes password)
  findAll: async () => {
    return await User.find().select('-password').sort({ createdAt: -1 });
  },

  // Update user by ID
  updateUser: async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');
  },

  // Delete user by ID
  deleteUser: async (id) => {
    return await User.findByIdAndDelete(id);
  }
};

module.exports = userRepository;
