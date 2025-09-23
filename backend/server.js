const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const victimRoutes = require('./routes/victim');
const allyRoutes = require('./routes/ally');
const emergencyRoutes = require('./routes/emergency');
const voiceRoutes = require('./routes/voice');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { setupSocketIO } = require('./services/socketService');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:8081', 'http://localhost:19006'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for audio uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rakhi';
console.log('🔗 Attempting to connect to MongoDB...');
console.log('📍 Connection URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Make sure MongoDB is running and the connection string is correct');
  process.exit(1); // Exit if can't connect to database
});

// Routes
app.use('/api/victim', victimRoutes);
app.use('/api/ally', allyRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/voice', voiceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 RAKHI Backend running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Setup Socket.IO for real-time communication
setupSocketIO(server);

module.exports = app;
