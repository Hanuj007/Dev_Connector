const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');

// Authentication Service handles business logic for registration and login
const authService = {
  // Register a new user
  registerUser: async ({ name, email, password, username }) => {
    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error('Please provide name, email and password');
      error.statusCode = 400;
      throw error;
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 400;
      throw error;
    }

    // If username is provided, check if it's already taken
    if (username) {
      const existingUsername = await userRepository.findByUsername(username);
      if (existingUsername) {
        const error = new Error('Username is already taken');
        error.statusCode = 400;
        throw error;
      }
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      username: username || undefined
    });

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Return safe user object (excluding password)
    return {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        skills: newUser.skills,
        githubUsername: newUser.githubUsername,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt
      },
      token
    };
  },

  // Login existing user
  loginUser: async ({ email, password }) => {
    // Validate inputs
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      throw error;
    }

    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return safe user object (excluding password)
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        skills: user.skills,
        githubUsername: user.githubUsername,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      token
    };
  }
};

module.exports = authService;
