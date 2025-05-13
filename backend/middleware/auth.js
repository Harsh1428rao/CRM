const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('=== Auth Middleware ===');
    console.log('Headers:', req.headers);
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (!decoded._id) {
      console.log('Token missing user ID');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const user = await User.findById(decoded._id);
    console.log('Found user:', user?.toObject());

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    // Set the complete user object
    req.user = user;
    
    // Log the user object being attached
    console.log('User attached to request:', {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    });
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth; 