const { Server } = require('socket.io');

let io = null;

/**
 * Setup Socket.IO for real-time communication
 */
const setupSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : ['http://localhost:8081', 'http://localhost:19006'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join victim room
    socket.on('join-victim', (victimId) => {
      socket.join(`victim-${victimId}`);
      console.log(`👤 Victim ${victimId} joined room`);
    });

    // Join ally room
    socket.on('join-ally', (allyId) => {
      socket.join(`ally-${allyId}`);
      console.log(`🛡️ Ally ${allyId} joined room`);
    });

    // Handle voice codeword detection
    socket.on('voice-codeword-detected', (data) => {
      console.log('🚨 Voice codeword detected via socket:', data);
      // Broadcast to allies room (align with frontend which joins `ally-<id>`)
      io.to(`ally-${data.victimId}`).emit('emergency-alert', data);
    });

    // Handle emergency status updates
    socket.on('emergency-status', (data) => {
      console.log('🚨 Emergency status update:', data);
      // Broadcast to relevant parties
      io.to(`ally-${data.victimId}`).emit('status-update', data);
    });

    // Relay victim triggered emergency alerts to allies
    socket.on('emergency-alert', (data) => {
      // Expect data to contain victimId and optionally audioUri/timestamp
      console.log('📣 Incoming emergency-alert from client:', data);
      io.to(`ally-${data.victimId}`).emit('emergency-alert', data);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

/**
 * Emit voice codeword detection to allies
 */
const emitVoiceCodewordDetection = (victimId, detectionData) => {
  if (io) {
    io.to(`victim-${victimId}`).emit('voice-codeword-detected', {
      victimId,
      timestamp: new Date(),
      ...detectionData
    });
  }
};

/**
 * Emit emergency alert to allies
 */
const emitEmergencyAlert = (victimId, emergencyData) => {
  if (io) {
    io.to(`victim-${victimId}`).emit('emergency-alert', {
      victimId,
      timestamp: new Date(),
      ...emergencyData
    });
  }
};

/**
 * Get Socket.IO instance
 */
const getIO = () => io;

module.exports = {
  setupSocketIO,
  emitVoiceCodewordDetection,
  emitEmergencyAlert,
  getIO
};

