
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../components/ui/navbar';

const USER = {
  firstName: 'Riya',
  lastName: 'Sharma',
  age: 24,
  gender: 'Female',
  location: 'Delhi, India',
  profilePic: '', // set to '' for no pic, or provide a URL
};

function getInitial(name: string) {
  return name ? name[0].toUpperCase() : '';
}

function VictimProfile() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [codewordUri, setCodewordUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState(false);
  const [codewordSaved, setCodewordSaved] = useState(false);

  // Load codeword audio from storage on mount
  React.useEffect(() => {
    AsyncStorage.getItem('victim_codeword_audio').then(val => {
      if (val) setCodewordUri(val);
    });
  }, []);

  // Save codeword audio to storage
  const saveCodewordAudio = async () => {
    if (!codewordUri) return;
    await AsyncStorage.setItem('victim_codeword_audio', codewordUri);
    setCodewordSaved(true);
    setTimeout(() => setCodewordSaved(false), 1500);
  };

  // Expo recommended high quality recording options
  const RECORDING_OPTIONS = {
    android: {
      extension: '.m4a',
      outputFormat: 2, // MPEG_4 = 2
      audioEncoder: 3, // AAC = 3
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.caf',
      audioQuality: 127, // max
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/webm',
      bitsPerSecond: 128000,
    },
  };

  // Start codeword recording
  const startCodewordRecording = async () => {
    try {
      setLoading(true);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(RECORDING_OPTIONS);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch (err) {
      alert('Failed to start recording: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Stop codeword recording
  const stopCodewordRecording = async () => {
    setLoading(true);
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setCodewordUri(uri || null);
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      alert('Failed to stop recording: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Play codeword audio
  const playCodewordAudio = async () => {
    if (!codewordUri) return;
    setLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: codewordUri });
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded || status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (err) {
      alert('Failed to play audio: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup sound on unmount
  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <Navbar onLogout={() => router.replace('/')} />
      {/* Profile Info */}
      <View style={styles.profileSection}>
        {USER.profilePic ? (
          <Image source={{ uri: USER.profilePic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{getInitial(USER.firstName)}</Text>
          </View>
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{USER.firstName} {USER.lastName}</Text>
          <Text style={styles.profileDetails}>Age: {USER.age}</Text>
          <Text style={styles.profileDetails}>Gender: {USER.gender}</Text>
          <Text style={styles.profileDetails}>Location: {USER.location}</Text>
        </View>
      </View>
      {/* Allies Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Allies</Text>
          <TouchableOpacity onPress={() => alert('Edit Allies')} style={styles.sectionEditBtn}>
            <Text style={styles.sectionEditText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.alliesList}>
          <View style={styles.allyRow}>
            <Text style={styles.allyName}>Priya Sharma</Text>
            <Text style={styles.allyContact}>+91 9876543210</Text>
          </View>
          <View style={styles.allyRow}>
            <Text style={styles.allyName}>Amit Verma</Text>
            <Text style={styles.allyContact}>+91 9123456780</Text>
          </View>
          <View style={styles.allyRow}>
            <Text style={styles.allyName}>Neha Singh</Text>
            <Text style={styles.allyContact}>+91 9988776655</Text>
          </View>
        </View>
      </View>
      {/* Codeword Section (audio) */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Codeword (Audio)</Text>
        </View>
        <View style={{ marginTop: 8, alignItems: 'flex-start' }}>
          {!isRecording && (
            <TouchableOpacity
              onPress={startCodewordRecording}
              style={{ backgroundColor: '#e75480', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 18, marginBottom: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Record Codeword</Text>
            </TouchableOpacity>
          )}
          {isRecording && (
            <TouchableOpacity
              onPress={stopCodewordRecording}
              style={{ backgroundColor: '#e11d48', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 18, marginBottom: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Stop Recording</Text>
            </TouchableOpacity>
          )}
          {codewordUri && !isRecording && (
            <TouchableOpacity
              onPress={playCodewordAudio}
              style={{ backgroundColor: '#ffe4ec', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 18, marginBottom: 8 }}
              disabled={isPlaying}
            >
              <Text style={{ color: '#e75480', fontWeight: 'bold', fontSize: 15 }}>{isPlaying ? 'Playing...' : 'Play Codeword'}</Text>
            </TouchableOpacity>
          )}
          {codewordUri && !isRecording && (
            <TouchableOpacity
              onPress={saveCodewordAudio}
              style={{ backgroundColor: '#4ade80', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 18, marginBottom: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Save Codeword</Text>
            </TouchableOpacity>
          )}
          {codewordSaved && (
            <Text style={{ color: '#4ade80', marginTop: 6 }}>Codeword saved!</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default VictimProfile;

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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 24,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    backgroundColor: '#ffe4ec',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    backgroundColor: '#ffe4ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    color: '#e75480',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e75480',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 18,
    padding: 18,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e75480',
  },
  sectionEditBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#ffe4ec',
    borderRadius: 12,
  },
  sectionEditText: {
    color: '#e75480',
    fontWeight: 'bold',
    fontSize: 14,
  },
  alliesList: {
    marginTop: 4,
    marginBottom: 2,
  },
  allyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginLeft: 6,
    marginRight: 6,
  },
  allyName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  allyContact: {
    fontSize: 13,
    color: '#e75480',
    marginLeft: 12,
    fontWeight: '500',
  },
  codewordMicRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  micBtn: {
    backgroundColor: '#ffe4ec',
    borderRadius: 32,
    padding: 12,
    marginBottom: 4,
  },
  editLabel: {
    color: '#e75480',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe4ec',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  previewText: {
    color: '#e75480',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
});
