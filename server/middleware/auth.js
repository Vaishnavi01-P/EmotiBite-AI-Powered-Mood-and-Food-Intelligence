const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Support for dev-mock-token in development
    if (process.env.NODE_ENV !== 'production' && token === 'dev-mock-token') {
      let user = await User.findOne({ email: 'dev-user@moodfood.ai' });
      if (!user) {
        user = await User.create({
          name: 'Dev User',
          email: 'dev-user@moodfood.ai',
          password: 'dev-mock-password',
          role: 'user',
          isActive: true
        });
      }
      req.user = user;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.stack || error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
