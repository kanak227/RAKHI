const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const victimSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Authentication
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Voice Codeword Configuration
  voiceCodeword: {
    text: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    audioFile: {
      type: String, // Path to stored audio file
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    confidence: {
      type: Number,
      default: 0.8, // Minimum confidence threshold for recognition
      min: 0,
      max: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Emergency Contacts (Allies)
  allies: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      enum: ['family', 'friend', 'colleague', 'neighbor', 'other'],
      default: 'friend'
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Emergency Settings
  emergencySettings: {
    autoRecord: {
      type: Boolean,
      default: true
    },
    recordDuration: {
      type: Number,
      default: 300, // 5 minutes in seconds
      min: 60,
      max: 1800
    },
    silentMode: {
      type: Boolean,
      default: false
    },
    locationSharing: {
      type: Boolean,
      default: true
    }
  },
  
  // Current Status
  status: {
    type: String,
    enum: ['safe', 'emergency', 'recording', 'offline'],
    default: 'safe'
  },
  
  // Location (for emergency purposes)
  lastKnownLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    timestamp: Date
  },
  
  // Recording History
  recordings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recording'
  }],
  
  // Emergency History
  emergencyHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
victimSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
victimSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
victimSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get safe profile (without sensitive data)
victimSchema.methods.getSafeProfile = function() {
  const { password, __v, ...safeProfile } = this.toObject();
  return safeProfile;
};

// Index for better query performance
victimSchema.index({ email: 1 });
victimSchema.index({ phone: 1 });
victimSchema.index({ status: 1 });
victimSchema.index({ 'voiceCodeword.text': 1 });

module.exports = mongoose.model('Victim', victimSchema);

