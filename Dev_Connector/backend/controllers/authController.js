const authService = require('../services/authService');

// Auth Controller handles HTTP requests for user registration and login
const authController = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { name, email, password, username, skills } = req.body;
      const result = await authService.registerUser({ name, email, password, username, skills });

      return res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser({ email, password });

      return res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me (Protected)
  getMe: async (req, res, next) => {
    try {
      // req.user is set by authMiddleware
      return res.status(200).json({
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
