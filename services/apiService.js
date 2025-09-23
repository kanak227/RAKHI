/**
 * API Service for RAKHI Backend Communication
 */

const BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

class ApiService {
  constructor() {
    this.token = null;
    this.baseURL = BASE_URL;
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Get multipart headers for file uploads
   */
  getMultipartHeaders() {
    const headers = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  /**
   * Upload file with multipart form data
   */
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    };

    try {
      console.log(`📤 File Upload: POST ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Upload Error:', error);
      throw error;
    }
  }

  // ==================== VICTIM API METHODS ====================

  /**
   * Register new victim
   */
  async registerVictim(victimData) {
    return this.request('/victim/register', {
      method: 'POST',
      body: JSON.stringify(victimData),
    });
  }

  /**
   * Login victim
   */
  async loginVictim(credentials) {
    const response = await this.request('/victim/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token for future requests
    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  /**
   * Set voice codeword (simplified for demo)
   */
  async setVoiceCodeword(codewordData, audioFile = null) {
    // For demo, just return the codeword data without API call
    return {
      message: 'Voice codeword set successfully',
      codeword: {
        text: codewordData.text,
        isActive: true,
        confidence: codewordData.confidence || 0.8,
        audioFile: audioFile ? audioFile.uri : null
      }
    };
  }

  /**
   * Get current voice codeword
   */
  async getVoiceCodeword() {
    return this.request('/victim/codeword');
  }

  /**
   * Toggle voice codeword on/off
   */
  async toggleVoiceCodeword() {
    return this.request('/victim/codeword/toggle', {
      method: 'PUT',
    });
  }

  /**
   * Delete voice codeword
   */
  async deleteVoiceCodeword() {
    return this.request('/victim/codeword', {
      method: 'DELETE',
    });
  }

  /**
   * Get victim status
   */
  async getVictimStatus() {
    return this.request('/victim/status');
  }

  // ==================== VOICE RECOGNITION API METHODS ====================

  /**
   * Test voice recognition with audio file
   */
  async testVoiceRecognition(codeword, audioFile) {
    const formData = new FormData();
    formData.append('codeword', codeword);
    formData.append('audioFile', {
      uri: audioFile.uri,
      type: audioFile.type || 'audio/wav',
      name: audioFile.name || 'test.wav',
    });

    return this.uploadFile('/voice/test', formData);
  }

  /**
   * Get voice recognition status
   */
  async getVoiceStatus() {
    return this.request('/voice/status');
  }

  /**
   * Start voice listening
   */
  async startVoiceListening(codeword) {
    return this.request('/voice/start-listening', {
      method: 'POST',
      body: JSON.stringify({ codeword }),
    });
  }

  /**
   * Stop voice listening
   */
  async stopVoiceListening() {
    return this.request('/voice/stop-listening', {
      method: 'POST',
    });
  }

  // ==================== HEALTH CHECK ====================

  /**
   * Check API health
   */
  async checkHealth() {
    return this.request('/health');
  }

  /**
   * Check voice service health
   */
  async checkVoiceHealth() {
    return this.request('/voice/health');
  }
}

// Export singleton instance
export default new ApiService();
