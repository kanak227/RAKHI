const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const voiceRecognitionService = require('../services/voiceRecognitionService');
const { authenticateToken } = require('../middleware/auth');
const { createUploadDir, validateAudioFile } = require('../utils/fileUtils');

const router = express.Router();

// Create upload directory
createUploadDir();

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/voice-test');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `test-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const validation = validateAudioFile(file);
    if (validation.isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (WAV, MP3, M4A, AAC)'), false);
    }
  }
});

// @route   POST /api/voice/test
// @desc    Test voice recognition with audio file
// @access  Private
router.post('/test', authenticateToken, upload.single('audioFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const { codeword } = req.body;
    if (!codeword) {
      return res.status(400).json({ error: 'Codeword is required' });
    }

    console.log(`🧪 Testing voice recognition with codeword: "${codeword}"`);
    console.log(`📁 Audio file: ${req.file.filename}`);

    // Process the audio file
    const result = await voiceRecognitionService.processAudioFile(
      req.file.path,
      codeword
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      result: {
        detected: result.detected,
        confidence: result.confidence,
        detectedText: result.detectedText,
        processingTime: result.processingTime,
        codeword: codeword
      }
    });
  } catch (error) {
    console.error('Voice test error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Voice recognition test failed',
      details: error.message 
    });
  }
});

// @route   GET /api/voice/status
// @desc    Get voice recognition service status
// @access  Private
router.get('/status', authenticateToken, (req, res) => {
  try {
    const status = voiceRecognitionService.getStatus();
    
    res.json({
      success: true,
      status: {
        isListening: status.isListening,
        activeVictims: status.activeVictims,
        victims: status.victims
      }
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ 
      error: 'Failed to get voice recognition status',
      details: error.message 
    });
  }
});

// @route   POST /api/voice/start-listening
// @desc    Start voice recognition for current user
// @access  Private
router.post('/start-listening', authenticateToken, async (req, res) => {
  try {
    const { codeword } = req.body;
    const victimId = req.user.id;

    if (!codeword) {
      return res.status(400).json({ error: 'Codeword is required' });
    }

    // Start listening for this victim
    await voiceRecognitionService.startListening(victimId, codeword, async (detectionData) => {
      console.log('🚨 Codeword detected in test mode:', detectionData);
      
      // In test mode, we just log the detection
      // In production, this would trigger emergency procedures
    });

    res.json({
      success: true,
      message: 'Voice recognition started',
      victimId: victimId,
      codeword: codeword
    });
  } catch (error) {
    console.error('Start listening error:', error);
    res.status(500).json({ 
      error: 'Failed to start voice recognition',
      details: error.message 
    });
  }
});

// @route   POST /api/voice/stop-listening
// @desc    Stop voice recognition for current user
// @access  Private
router.post('/stop-listening', authenticateToken, (req, res) => {
  try {
    const victimId = req.user.id;
    
    voiceRecognitionService.stopListening(victimId);

    res.json({
      success: true,
      message: 'Voice recognition stopped',
      victimId: victimId
    });
  } catch (error) {
    console.error('Stop listening error:', error);
    res.status(500).json({ 
      error: 'Failed to stop voice recognition',
      details: error.message 
    });
  }
});

// @route   GET /api/voice/health
// @desc    Health check for voice recognition service
// @access  Public
router.get('/health', (req, res) => {
  try {
    const status = voiceRecognitionService.getStatus();
    
    res.json({
      success: true,
      service: 'voice-recognition',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      details: {
        isListening: status.isListening,
        activeVictims: status.activeVictims
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'voice-recognition',
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;

