# RAKHI Frontend-Backend Integration Guide

This guide explains how to connect the React Native frontend with the Node.js backend for the RAKHI women's safety app.

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm run setup
npm run dev
```

### 2. Frontend Setup
```bash
# Install new dependencies
npm install

# Start the frontend
npm start
```

## 📁 Project Structure

```
RAKHI/
├── backend/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── server.js           # Main server file
├── app/                    # React Native frontend
│   ├── screens/            # Screen components
│   ├── contexts/           # React contexts
│   └── _layout.tsx         # App layout
├── services/               # Frontend services
│   ├── apiService.js       # API communication
│   └── voiceRecordingService.js # Voice recording
└── contexts/               # React contexts
    ├── AuthContext.js      # Authentication
    └── VoiceContext.js     # Voice codeword management
```

## 🔧 Backend Configuration

### Environment Variables
Create `.env` file in backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rakhi
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### API Endpoints
- **Base URL**: `http://localhost:3000/api`
- **Health Check**: `GET /api/health`
- **Victim Registration**: `POST /api/victim/register`
- **Victim Login**: `POST /api/victim/login`
- **Voice Codeword**: `POST /api/victim/codeword`
- **Voice Testing**: `POST /api/voice/test`

## 📱 Frontend Configuration

### API Service
The `ApiService` class handles all backend communication:
- Automatic token management
- Error handling
- File upload support
- Request/response logging

### Context Providers
- **AuthContext**: Manages user authentication state
- **VoiceContext**: Handles voice codeword functionality

## 🔐 Authentication Flow

### 1. User Registration
```javascript
const { register } = useAuth();
await register({
  firstName: 'Riya',
  lastName: 'Sharma',
  email: 'riya@example.com',
  phone: '+919876543210',
  password: 'securepassword'
});
```

### 2. User Login
```javascript
const { login } = useAuth();
await login({
  email: 'riya@example.com',
  password: 'securepassword'
});
```

### 3. Automatic Token Management
- Tokens are stored in AsyncStorage
- Automatically included in API requests
- Handles token refresh and logout

## 🎤 Voice Codeword System

### 1. Set Voice Codeword
```javascript
const { setVoiceCodeword } = useVoice();
await setVoiceCodeword({
  text: 'help me now',
  confidence: 0.8
}, audioFile);
```

### 2. Toggle Voice Listening
```javascript
const { toggleVoiceCodeword } = useVoice();
await toggleVoiceCodeword();
```

### 3. Voice Recording
```javascript
import VoiceRecordingService from '@/services/voiceRecordingService';

// Start recording
await VoiceRecordingService.startRecording();

// Stop recording
const uri = await VoiceRecordingService.stopRecording();
```

## 📊 Data Flow

### 1. Authentication
```
User Input → AuthContext → ApiService → Backend → Database
```

### 2. Voice Codeword
```
User Sets Codeword → VoiceContext → ApiService → Backend → Voice Recognition Service
```

### 3. Emergency Detection
```
Voice Input → Voice Recognition → Backend → Emergency Response → Ally Notification
```

## 🛠️ Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
npm start
```

### 3. Test Integration
```bash
# Test backend health
curl http://localhost:3000/api/health

# Test voice service
curl http://localhost:3000/api/voice/health
```

## 🔍 Testing the Integration

### 1. Backend Testing
```bash
cd backend
npm run test-setup
```

### 2. Frontend Testing
1. Open the app
2. Navigate to "Continue as Victim"
3. Register a new account
4. Set up voice codeword
5. Test voice recording

### 3. API Testing
Use the provided test script:
```bash
cd backend
node test-setup.js
```

## 🚨 Emergency Flow

### 1. Voice Codeword Detection
1. User speaks codeword
2. Voice recognition service detects it
3. Backend triggers emergency response
4. Recording starts automatically
5. Allies are notified

### 2. Manual Emergency
1. User presses emergency button
2. Recording starts immediately
3. Allies are notified
4. Emergency services contacted

## 📱 Mobile Permissions

### iOS
Add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "This app needs access to microphone for voice codeword detection and emergency recording."
      }
    }
  }
}
```

### Android
Add to `app.json`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check MongoDB is running
   - Verify environment variables
   - Check port 3000 is available

2. **Frontend API errors**
   - Verify backend is running
   - Check API base URL in `apiService.js`
   - Check network connectivity

3. **Voice recording not working**
   - Check microphone permissions
   - Verify audio configuration
   - Test on physical device

4. **Authentication issues**
   - Check JWT secret is set
   - Verify token storage
   - Check API endpoints

### Debug Mode
Enable debug logging in `apiService.js`:
```javascript
const BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';
```

## 🚀 Production Deployment

### Backend
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to cloud service (Heroku, AWS, etc.)
4. Set up SSL/TLS

### Frontend
1. Update API base URL
2. Configure app signing
3. Deploy to app stores
4. Set up push notifications

## 📚 API Documentation

### Victim Endpoints
- `POST /api/victim/register` - Register new victim
- `POST /api/victim/login` - Login victim
- `POST /api/victim/codeword` - Set voice codeword
- `GET /api/victim/codeword` - Get current codeword
- `PUT /api/victim/codeword/toggle` - Toggle codeword
- `DELETE /api/victim/codeword` - Delete codeword

### Voice Endpoints
- `POST /api/voice/test` - Test voice recognition
- `GET /api/voice/status` - Get voice status
- `POST /api/voice/start-listening` - Start listening
- `POST /api/voice/stop-listening` - Stop listening

## 🔒 Security Considerations

1. **JWT Tokens**: Secure token storage and validation
2. **API Security**: CORS, rate limiting, input validation
3. **Audio Privacy**: Encrypted audio storage
4. **User Data**: Secure user information handling
5. **Emergency Data**: Secure emergency response data

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs
4. Test with provided test scripts

## 🎯 Next Steps

1. **Real Voice Recognition**: Integrate Google Cloud Speech-to-Text
2. **Push Notifications**: Add real-time alerts
3. **Location Services**: Add GPS tracking
4. **Emergency Services**: Integrate with 911/emergency services
5. **Analytics**: Add usage tracking and monitoring

