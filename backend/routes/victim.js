const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Victim = require('../models/Victim');
const Recording = require('../models/Recording');
const voiceRecognitionService = require('../services/voiceRecognitionService');
const { authenticateToken } = require('../middleware/auth');
const { createUploadDir } = require('../utils/fileUtils');

const router = express.Router();

// Create upload directory if it doesn't exist
createUploadDir();

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/voice-codewords');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `codeword-${req.user.id}-${uniqueSuffix}.wav`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Validation middleware
const validateCodeword = [
  body('text')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Codeword must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Codeword can only contain letters and spaces'),
  body('confidence')
    .optional()
    .isFloat({ min: 0.1, max: 1.0 })
    .withMessage('Confidence must be between 0.1 and 1.0')
];

// @route   POST /api/victim/register
// @desc    Register a new victim
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    // Check if victim already exists
    const existingVictim = await Victim.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingVictim) {
      return res.status(400).json({
        error: 'Victim with this email or phone already exists'
      });
    }

    // Create new victim
    const victim = new Victim({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    await victim.save();

    res.status(201).json({
      message: 'Victim registered successfully',
      victim: victim.getSafeProfile()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/victim/login
// @desc    Login victim
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find victim by email
    const victim = await Victim.findOne({ email });
    if (!victim) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await victim.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (you'll need to implement this)
    const token = 'jwt-token-placeholder'; // TODO: Implement JWT generation

    res.json({
      message: 'Login successful',
      token,
      victim: victim.getSafeProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/victim/codeword
// @desc    Set up voice codeword for victim
// @access  Public (for demo)
router.post('/codeword', upload.single('audioFile'), validateCodeword, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, confidence = 0.8 } = req.body;
    const victimId = 'demo-victim-id'; // Demo user ID

    // For demo, create a simple response
    const codewordData = {
      text: text.toLowerCase(),
      audioFile: req.file ? req.file.path : null,
      isActive: true,
      confidence: parseFloat(confidence),
      createdAt: new Date()
    };

    // Start voice recognition for this victim
    await voiceRecognitionService.startListening(victimId, text, async (detectionData) => {
      console.log('🚨 Voice codeword detected!', detectionData);
      
      // For demo, just log the detection
      console.log('Emergency triggered by voice codeword:', text);
    });

    res.json({
      message: 'Voice codeword set successfully',
      codeword: codewordData
    });
  } catch (error) {
    console.error('Codeword setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/victim/codeword
// @desc    Get current voice codeword
// @access  Private
router.get('/codeword', authenticateToken, async (req, res) => {
  try {
    const victimId = req.user.id;
    const victim = await Victim.findById(victimId).select('voiceCodeword');
    
    if (!victim) {
      return res.status(404).json({ error: 'Victim not found' });
    }

    res.json({
      codeword: victim.voiceCodeword
    });
  } catch (error) {
    console.error('Get codeword error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/victim/codeword/toggle
// @desc    Toggle voice codeword on/off
// @access  Private
router.put('/codeword/toggle', authenticateToken, async (req, res) => {
  try {
    const victimId = req.user.id;
    const victim = await Victim.findById(victimId);
    
    if (!victim) {
      return res.status(404).json({ error: 'Victim not found' });
    }

    // Toggle codeword status
    victim.voiceCodeword.isActive = !victim.voiceCodeword.isActive;
    await victim.save();

    if (victim.voiceCodeword.isActive) {
      // Start listening
      await voiceRecognitionService.startListening(
        victimId, 
        victim.voiceCodeword.text, 
        async (detectionData) => {
          // Handle codeword detection
          console.log('Codeword detected:', detectionData);
        }
      );
    } else {
      // Stop listening
      voiceRecognitionService.stopListening(victimId);
    }

    res.json({
      message: `Voice codeword ${victim.voiceCodeword.isActive ? 'activated' : 'deactivated'}`,
      isActive: victim.voiceCodeword.isActive
    });
  } catch (error) {
    console.error('Toggle codeword error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/victim/codeword
// @desc    Delete voice codeword
// @access  Private
router.delete('/codeword', authenticateToken, async (req, res) => {
  try {
    const victimId = req.user.id;
    const victim = await Victim.findById(victimId);
    
    if (!victim) {
      return res.status(404).json({ error: 'Victim not found' });
    }

    // Stop voice recognition
    voiceRecognitionService.stopListening(victimId);

    // Clear codeword data
    victim.voiceCodeword = {
      text: '',
      audioFile: null,
      isActive: false,
      confidence: 0.8,
      createdAt: null
    };

    await victim.save();

    res.json({
      message: 'Voice codeword deleted successfully'
    });
  } catch (error) {
    console.error('Delete codeword error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/victim/status
// @desc    Get victim status and voice recognition status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const victimId = req.user.id;
    const victim = await Victim.findById(victimId).select('status voiceCodeword lastActive');
    
    if (!victim) {
      return res.status(404).json({ error: 'Victim not found' });
    }

    const voiceStatus = voiceRecognitionService.getStatus();
    const isListening = voiceStatus.victims.includes(victimId);

    res.json({
      victim: {
        status: victim.status,
        lastActive: victim.lastActive,
        voiceCodeword: {
          isActive: victim.voiceCodeword.isActive,
          isListening: isListening,
          text: victim.voiceCodeword.text
        }
      },
      voiceRecognition: voiceStatus
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
