const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, altRes, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database (excluding password) and attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return altRes.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      altRes.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    altRes.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };