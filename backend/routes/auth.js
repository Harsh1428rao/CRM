// google OAuth configuration for the authentication part t check wheather the user is authenticated or not 
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');


const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://crm-1-30zn.onrender.com/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// auth routes for checking 
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
//this route  after checking and taking the token will redirect the user to teh frontend which we get fetched from the .env fiel 
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('Creating token for user:', req.user);
    const token = jwt.sign(
      { _id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Created token payload:', { _id: req.user._id, email: req.user.email });
    res.redirect(`${process.env.FRONTEND_URL || 'https://crm-1-30zn.onrender.com'}/auth/callback?token=${token}`);
  }
);

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token in /me:', decoded);
    const user = await User.findById(decoded._id).select('-googleId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

// Test endpoint to verify auth middleware
router.get('/test', auth, (req, res) => {
  console.log('=== Auth Test Endpoint ===');
  console.log('User from request:', req.user);
  res.json({ 
    message: 'Auth test successful',
    user: {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

module.exports = router; 