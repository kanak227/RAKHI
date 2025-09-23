const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  // Victim who made the recording
  victimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Victim',
    required: true
  },
  
  // Recording details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Audio file information
  audioFile: {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    duration: {
      type: Number, // Duration in seconds
      required: true
    },
    format: {
      type: String,
      default: 'wav'
    },
    mimeType: {
      type: String,
      default: 'audio/wav'
    }
  },
  
  // Recording metadata
  triggeredBy: {
    type: String,
    enum: ['voice_codeword', 'manual', 'emergency_button', 'scheduled'],
    required: true
  },
  
  // Voice recognition data (if triggered by codeword)
  voiceRecognition: {
    detectedText: String,
    confidence: Number,
    language: String,
    timestamp: Date
  },
  
  // Location data (if available)
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    accuracy: Number // GPS accuracy in meters
  },
  
  // Processing status
  status: {
    type: String,
    enum: ['recording', 'processing', 'completed', 'failed', 'deleted'],
    default: 'recording'
  },
  
  // Verification status
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ally'
  },
  verifiedAt: Date,
  
  // Sharing information
  sharedWith: [{
    allyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ally'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    viewed: {
      type: Boolean,
      default: false
    },
    viewedAt: Date
  }],
  
  // Emergency context
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  },
  
  // Privacy settings
  privacy: {
    autoDelete: {
      type: Boolean,
      default: false
    },
    deleteAfter: {
      type: Number,
      default: 30 // Days
    },
    encryption: {
      type: Boolean,
      default: true
    }
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    required: true
  },
  endedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
recordingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate duration
recordingSchema.virtual('durationInMinutes').get(function() {
  if (this.endedAt && this.startedAt) {
    return Math.round((this.endedAt - this.startedAt) / 1000 / 60);
  }
  return 0;
});

// Index for better query performance
recordingSchema.index({ victimId: 1, createdAt: -1 });
recordingSchema.index({ status: 1 });
recordingSchema.index({ isEmergency: 1 });
recordingSchema.index({ triggeredBy: 1 });
recordingSchema.index({ 'sharedWith.allyId': 1 });

module.exports = mongoose.model('Recording', recordingSchema);

