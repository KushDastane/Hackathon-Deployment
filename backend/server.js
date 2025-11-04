const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const ambulanceRoutes = require('./routes/ambulances');

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware with enhanced CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());

// Enhanced MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ambulance-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Please make sure:');
    console.log('   1. MongoDB is installed and running');
    console.log('   2. MongoDB service is started (mongod)');
    console.log('   3. Or use MongoDB Atlas cloud database');
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ambulances', ambulanceRoutes);

// Socket.IO connection handling
const { handleSocketConnection } = require('./socket/socketHandler');
handleSocketConnection(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚑 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://127.0.0.1:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
});