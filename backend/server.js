const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const campaignRoutes = require('./routes/campaigns');
const segmentRoutes = require('./routes/segments');
const orderRoutes = require('./routes/order');
const healthRouter = require('./routes/health');
const vendorRoutes = require('./routes/vendor');
const communicationLogRoutes = require('./routes/communicationLogs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/health', healthRouter);
app.use('/api/vendor', vendorRoutes);
app.use('/api/communication-logs', communicationLogRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
<<<<<<< HEAD
  serverSelectionTimeoutMS: 10000, // Optional: Increases timeout for initial connection
  socketTimeoutMS: 45000           // Optional: Keeps the connection open longer
=======
  serverSelectionTimeoutMS: 10000, 
  socketTimeoutMS: 45000           
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== Server Error ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
<<<<<<< HEAD
const PORT = process.env.PORT || 4000;
=======
const PORT = process.env.PORT || 5000;
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB connection status:', mongoose.connection.readyState === 1 ? 'connected' : 'disconnected');
}); 
<<<<<<< HEAD

console.log("Connecting to MongoDB using URI:", process.env.MONGODB_URI);
=======
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
