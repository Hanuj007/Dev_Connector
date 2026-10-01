const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

// Authentication middleware to protect routes
const authMiddleware = async (req, res, next) => {
  let token;

  // Check if authorization header starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from decoded payload (excludes password)
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      // Attach user to request object
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = authMiddleware;
