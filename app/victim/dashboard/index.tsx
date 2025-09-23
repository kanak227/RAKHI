import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../../components/ui/navbar';
import { getSocket } from '../../utils/socket';

const ALLIES = [
  { id: '1', name: 'Priya Sharma', contact: '+91 9876543210' },
  { id: '2', name: 'Amit Verma', contact: '+91 9123456780' },
  { id: '3', name: 'Neha Singh', contact: '+91 9988776655' },
];

function DashboardScreen() {
  const router = useRouter();
  const [isEmergency, setIsEmergency] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [codeword, setCodeword] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSent, setShowSent] = useState(false);

  // Load codeword from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('victim_codeword').then(val => {
      if (val) setCodeword(val);
    });
  }, []);

  // Connect to socket and join ally room (for demo, use '1')
  const socket = React.useMemo(() => {
    const s = getSocket();
    s.emit('join-ally', '1');
    return s;
  }, []);

  // Simple animated waveform while recording
  const waveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
          Animated.timing(waveAnim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [isRecording]);

  // Manual trigger: start recording
  const startManualRecording = async () => {
    try {
      setIsRecording(true);
      setLoading(true);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: { extension: '.m4a', outputFormat: 2, audioEncoder: 3, sampleRate: 44100, numberOfChannels: 2, bitRate: 128000 },
        ios: { extension: '.caf', audioQuality: 127, sampleRate: 44100, numberOfChannels: 2, bitRate: 128000, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
        web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
      });
      await rec.startAsync();
      setRecording(rec);
      // Record for 5 seconds, then stop and alert
      setTimeout(() => stopManualRecording(rec), 5000);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording: ' + err);
      setIsRecording(false);
      setLoading(false);
    }
  };

  // Stop manual recording and simulate alert
  const stopManualRecording = async (rec: Audio.Recording) => {
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      setRecording(null);
      setRecordedUri(uri || null);
      setIsRecording(false);
      setLoading(false);
      setIsEmergency(true);
      // Emit real-time alert to backend (to ally-1 room)
      const alertPayload = {
        victimId: '1',
        audioUri: uri,
        timestamp: new Date().toISOString(),
      };
      socket.emit('emergency-alert', alertPayload);

      // Persist alert locally so Ally view can load it after switching roles
      try {
        const existing = await AsyncStorage.getItem('ally_alerts');
        const parsed = existing ? JSON.parse(existing) : [];
        const next = [
          {
            id: Date.now().toString(),
            message: 'Victim triggered emergency alert',
            time: 'Just now',
            audioUri: uri,
          },
          ...Array.isArray(parsed) ? parsed : [],
        ];
        await AsyncStorage.setItem('ally_alerts', JSON.stringify(next));
      } catch {}

      // Persist recording entry for both Victim and Ally recordings lists
      try {
        if (uri) {
          // Copy to app documents to keep it around
          const recordingsDir = FileSystem.documentDirectory + 'recordings';
          await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true }).catch(() => {});
          const filename = `rec-${Date.now()}.m4a`;
          const dest = `${recordingsDir}/${filename}`;
          await FileSystem.copyAsync({ from: uri, to: dest }).catch(() => {});

          const entry = {
            id: Date.now().toString(),
            title: 'Emergency Recording',
            description: 'Auto-saved from victim',
            uri: dest,
            createdAt: new Date().toISOString(),
          };

          const key = 'shared_recordings';
          const existingRecs = await AsyncStorage.getItem(key);
          const parsedRecs = existingRecs ? JSON.parse(existingRecs) : [];
          const recsNext = [entry, ...Array.isArray(parsedRecs) ? parsedRecs : []];
          await AsyncStorage.setItem(key, JSON.stringify(recsNext));
        }
      } catch {}
      // Show brief sent banner
      setShowSent(true);
      setTimeout(() => setShowSent(false), 2500);
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording: ' + err);
      setIsRecording(false);
      setLoading(false);
    }
  };

  // Handle codeword detected: start recording and send alert
  const handleCodewordDetected = async () => {
    Alert.alert('Codeword Detected', 'Emergency codeword detected! Recording will start.');
    setIsRecording(true);
    setLoading(true);
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: { extension: '.m4a', outputFormat: 2, audioEncoder: 3, sampleRate: 44100, numberOfChannels: 2, bitRate: 128000 },
        ios: { extension: '.caf', audioQuality: 127, sampleRate: 44100, numberOfChannels: 2, bitRate: 128000, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
        web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
      });
      await rec.startAsync();
      setRecording(rec);
      setTimeout(() => stopRecordingAndSend(rec), 5000); // Record for 5 seconds
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording: ' + err);
      setIsRecording(false);
    } finally {
      setLoading(false);
    }
  };

  // Stop recording and send to backend/ally
  const stopRecordingAndSend = async (rec: Audio.Recording) => {
    setLoading(true);
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      setRecording(null);
      setIsRecording(false);
      // TODO: Send uri to backend and notify ally
      Alert.alert('Recording Sent', 'Emergency recording sent to ally!');
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <Navbar onLogout={() => router.replace('/')} />
      {/* Welcome */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome, Riya!
        </Text>
      </View>

      {/* Emergency Status */}
      {isEmergency && (
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyText}>🚨 EMERGENCY MODE ACTIVE</Text>
        </View>
      )}

      {/* Manual Trigger Button */}
      <TouchableOpacity
        style={styles.recordBtn}
        onPress={startManualRecording}
        disabled={isRecording || loading}
      >
        <Text style={styles.recordBtnText}>
          {isRecording ? 'Recording...' : 'Manual Trigger'}
        </Text>
      </TouchableOpacity>
      {isRecording && (
        <View style={styles.recordingVizContainer}>
          <Text style={styles.recordingVizText}>Recording…</Text>
          <View style={styles.waveformRow}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const height = waveAnim.interpolate({ inputRange: [0, 1], outputRange: [8 + i * 2, 24 + i * 4] });
              return <Animated.View key={i} style={[styles.waveBar, { height }]} />;
            })}
          </View>
        </View>
      )}
      {loading && <ActivityIndicator color="#e75480" style={{ marginBottom: 8 }} />}
      {showSent && (
        <View style={styles.sentBanner}>
          <Text style={styles.sentTick}>✓</Text>
          <Text style={styles.sentText}>Recording sent to ally</Text>
        </View>
      )}

      {/* Allies List */}
      <View style={styles.alliesSection}>
        <Text style={styles.alliesHeading}>Allies</Text>
        <FlatList
          data={ALLIES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.allyItem}>
              <Text style={styles.allyName}>{item.name}</Text>
              <Text style={styles.allyContact}>{item.contact}</Text>
            </View>
          )}
        />
      </View>

    </SafeAreaView>
  );
}

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff0f5',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffe4ec',
    elevation: 2,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e75480',
    letterSpacing: 4,
    fontFamily: 'serif',
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#ffe4ec',
    borderRadius: 16,
  },
  logoutText: {
    color: '#e75480',
    fontWeight: 'bold',
    fontSize: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    color: '#e75480',
    fontWeight: '600',
  },
  recordBtn: {
    alignSelf: 'center',
    backgroundColor: '#e75480',
    borderRadius: 40,
    paddingVertical: 24,
    paddingHorizontal: 48,
    marginBottom: 32,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  recordBtnActive: {
    backgroundColor: '#e11d48',
  },
  recordBtnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  codewordContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  codewordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e75480',
    marginBottom: 12,
  },
  codewordInfo: {
    alignItems: 'center',
  },
  codewordText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  codewordStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  toggleBtn: {
    backgroundColor: '#ffe4ec',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleBtnText: {
    color: '#e75480',
    fontWeight: '600',
  },
  codewordButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  recordCodewordBtn: {
    backgroundColor: '#e11d48',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  recordCodewordBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noCodewordContainer: {
    alignItems: 'center',
  },
  noCodewordText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  recordCodewordMainBtn: {
    backgroundColor: '#e75480',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  recordCodewordMainBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emergencyContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  emergencyText: {
    color: '#e11d48',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordingStatusContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  recordingStatusText: {
    color: '#d97706',
    fontSize: 16,
    fontWeight: '600',
  },
  alliesSection: {
    flex: 1,
    backgroundColor: '#fff0f5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    marginTop: 16,
  },
  recordingVizContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingVizText: {
    color: '#e75480',
    marginBottom: 6,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 36,
  },
  waveBar: {
    width: 6,
    backgroundColor: '#e75480',
    borderRadius: 3,
    marginHorizontal: 2,
  },
  sentBanner: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6fffa',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  sentTick: {
    color: '#10b981',
    fontWeight: 'bold',
    marginRight: 6,
  },
  sentText: {
    color: '#065f46',
    fontWeight: '600',
  },
  alliesHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e75480',
    marginBottom: 12,
  },
  allyItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  allyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e75480',
  },
  allyContact: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
});
