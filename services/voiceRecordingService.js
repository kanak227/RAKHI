/**
 * Voice Recording Service for React Native
 * Handles audio recording and voice codeword functionality
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

class VoiceRecordingService {
  constructor() {
    this.recording = null;
    this.isRecording = false;
    this.recordingUri = null;
  }

  /**
   * Request audio recording permissions
   */
  async requestPermissions() {
    try {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  /**
   * Configure audio mode for recording
   */
  async configureAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
    } catch (error) {
      console.error('Error configuring audio:', error);
    }
  }

  /**
   * Start recording audio
   */
  async startRecording() {
    try {
      // Check permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Audio recording permission denied');
      }

      // Configure audio
      await this.configureAudio();

      // Create recording instance
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });

      // Start recording
      await recording.startAsync();
      this.recording = recording;
      this.isRecording = true;

      console.log('🎤 Recording started');
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording audio
   */
  async stopRecording() {
    try {
      if (!this.recording || !this.isRecording) {
        throw new Error('No active recording');
      }

      // Stop recording
      await this.recording.stopAndUnloadAsync();
      
      // Get recording URI
      const uri = this.recording.getURI();
      this.recordingUri = uri;
      
      // Reset recording state
      this.recording = null;
      this.isRecording = false;

      console.log('🛑 Recording stopped:', uri);
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  /**
   * Pause recording
   */
  async pauseRecording() {
    try {
      if (!this.recording || !this.isRecording) {
        throw new Error('No active recording');
      }

      await this.recording.pauseAsync();
      console.log('⏸️ Recording paused');
    } catch (error) {
      console.error('Error pausing recording:', error);
      throw error;
    }
  }

  /**
   * Resume recording
   */
  async resumeRecording() {
    try {
      if (!this.recording || !this.isRecording) {
        throw new Error('No active recording');
      }

      await this.recording.startAsync();
      console.log('▶️ Recording resumed');
    } catch (error) {
      console.error('Error resuming recording:', error);
      throw error;
    }
  }

  /**
   * Get recording status
   */
  getRecordingStatus() {
    return {
      isRecording: this.isRecording,
      recordingUri: this.recordingUri,
      hasRecording: !!this.recordingUri,
    };
  }

  /**
   * Get recording file info
   */
  async getRecordingInfo(uri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return {
        uri: fileInfo.uri,
        size: fileInfo.size,
        exists: fileInfo.exists,
        isDirectory: fileInfo.isDirectory,
      };
    } catch (error) {
      console.error('Error getting recording info:', error);
      return null;
    }
  }

  /**
   * Delete recording file
   */
  async deleteRecording(uri) {
    try {
      if (uri) {
        await FileSystem.deleteAsync(uri);
        console.log('🗑️ Recording deleted:', uri);
      }
      
      // Reset state
      this.recordingUri = null;
      return true;
    } catch (error) {
      console.error('Error deleting recording:', error);
      return false;
    }
  }

  /**
   * Create audio file object for API upload
   */
  createAudioFileObject(uri, filename = 'recording.wav') {
    return {
      uri,
      type: 'audio/wav',
      name: filename,
    };
  }

  /**
   * Start continuous recording for voice codeword detection
   */
  async startContinuousRecording(onCodewordDetected) {
    try {
      // This would integrate with the voice recognition service
      // For now, we'll simulate the process
      console.log('🎧 Starting continuous recording for voice codeword detection');
      
      // In a real implementation, you would:
      // 1. Start continuous audio capture
      // 2. Process audio chunks in real-time
      // 3. Use speech-to-text to detect codewords
      // 4. Call onCodewordDetected when codeword is found
      
      return true;
    } catch (error) {
      console.error('Error starting continuous recording:', error);
      throw error;
    }
  }

  /**
   * Stop continuous recording
   */
  async stopContinuousRecording() {
    try {
      console.log('🛑 Stopping continuous recording');
      
      // Stop any active recording
      if (this.isRecording) {
        await this.stopRecording();
      }
      
      return true;
    } catch (error) {
      console.error('Error stopping continuous recording:', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
      
      this.isRecording = false;
      this.recordingUri = null;
      
      console.log('🧹 Voice recording service cleaned up');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export default new VoiceRecordingService();

