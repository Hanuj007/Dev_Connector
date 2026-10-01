const jwt = require('jsonwebtoken');

// Generate JSON Web Token (JWT) with user ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
