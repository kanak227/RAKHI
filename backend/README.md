# RAKHI Backend - Voice Codeword System

This is the backend service for the RAKHI women's safety app, focusing on voice-based codeword detection and emergency response.

## 🚀 Features

- **Voice Codeword Detection**: Real-time voice recognition for emergency triggers
- **Victim Management**: User registration, authentication, and profile management
- **Audio Recording**: Secure audio file handling and storage
- **Real-time Communication**: Socket.IO for instant alerts and notifications
- **Emergency Response**: Automated emergency procedures and ally notifications

## 🛠️ Technology Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **JWT** for authentication
- **Voice Recognition** service (simulated)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/rakhi
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

3. **Start MongoDB**:
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

4. **Run the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Victim Management

#### Register Victim
```http
POST /api/victim/register
Content-Type: application/json

{
  "firstName": "Riya",
  "lastName": "Sharma",
  "email": "riya@example.com",
  "phone": "+919876543210",
  "password": "securepassword"
}
```

#### Login Victim
```http
POST /api/victim/login
Content-Type: application/json

{
  "email": "riya@example.com",
  "password": "securepassword"
}
```

### Voice Codeword Management

#### Set Voice Codeword
```http
POST /api/victim/codeword
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

{
  "text": "help me now",
  "confidence": 0.8,
  "audioFile": <audio-file>
}
```

#### Get Current Codeword
```http
GET /api/victim/codeword
Authorization: Bearer <jwt-token>
```

#### Toggle Codeword
```http
PUT /api/victim/codeword/toggle
Authorization: Bearer <jwt-token>
```

#### Delete Codeword
```http
DELETE /api/victim/codeword
Authorization: Bearer <jwt-token>
```

### Voice Recognition Testing

#### Test Voice Recognition
```http
POST /api/voice/test
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

{
  "codeword": "help me now",
  "audioFile": <audio-file>
}
```

#### Get Voice Status
```http
GET /api/voice/status
Authorization: Bearer <jwt-token>
```

#### Start/Stop Listening
```http
POST /api/voice/start-listening
POST /api/voice/stop-listening
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "codeword": "help me now"
}
```

## 🎤 Voice Codeword System

### How It Works

1. **Setup**: Victim sets up a voice codeword (text + optional audio sample)
2. **Listening**: System continuously listens for the codeword
3. **Detection**: When codeword is detected, emergency procedures are triggered
4. **Response**: Allies are notified and recording starts automatically

### Supported Audio Formats

- WAV (recommended)
- MP3
- M4A
- AAC

### Configuration

- **Confidence Threshold**: 0.1 to 1.0 (default: 0.8)
- **Max File Size**: 10MB
- **Recording Duration**: 5 minutes (configurable)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 📊 Database Schema

### Victim Model
- Basic information (name, email, phone)
- Voice codeword configuration
- Emergency contacts (allies)
- Emergency settings
- Current status and location
- Recording history

### Recording Model
- Audio file metadata
- Trigger information (voice/manual/emergency)
- Voice recognition data
- Location data
- Verification status
- Privacy settings

## 🚨 Emergency Flow

1. **Voice Detection**: Codeword is spoken and detected
2. **Recording Start**: Automatic audio recording begins
3. **Status Update**: Victim status changes to "emergency"
4. **Ally Notification**: All allies are notified via Socket.IO
5. **Recording Storage**: Audio is securely stored
6. **Emergency Response**: Automated emergency procedures

## 🧪 Testing

### Voice Recognition Test
```bash
# Test with audio file
curl -X POST http://localhost:3000/api/voice/test \
  -H "Authorization: Bearer <token>" \
  -F "codeword=help me now" \
  -F "audioFile=@test-audio.wav"
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## 🔧 Development

### Project Structure
```
backend/
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic services
├── middleware/       # Express middleware
├── utils/            # Utility functions
├── uploads/          # File uploads
└── server.js         # Main server file
```

### Adding New Features

1. Create model in `models/`
2. Add routes in `routes/`
3. Implement business logic in `services/`
4. Add middleware if needed
5. Update API documentation

## 🚀 Deployment

### Environment Variables
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `NODE_ENV`: Environment (development/production)

### Production Considerations
- Use environment-specific configurations
- Set up proper logging
- Configure reverse proxy (nginx)
- Set up SSL/TLS
- Use process manager (PM2)
- Set up monitoring and alerts

## 📝 TODO

- [ ] Implement real voice recognition (Google Cloud Speech-to-Text)
- [ ] Add SMS/Email emergency notifications
- [ ] Implement location tracking
- [ ] Add audio encryption
- [ ] Set up automated testing
- [ ] Add API rate limiting
- [ ] Implement backup and recovery
- [ ] Add monitoring and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

