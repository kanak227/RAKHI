import { Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../components/ui/navbar';

type Rec = { id: string; title: string; description: string; uri: string; createdAt: string };

export default function RecordingsScreen() {
  const router = useRouter();
  const [recs, setRecs] = useState<Rec[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('shared_recordings').then(stored => {
      try {
        const parsed = stored ? JSON.parse(stored) : [];
        if (Array.isArray(parsed)) setRecs(parsed);
      } catch {}
    });
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const handlePlayToggle = async (rec: Rec) => {
    try {
      // If tapping the currently loaded item
      if (sound && currentId === rec.id) {
        const status = await sound.getStatusAsync();
        if ('isLoaded' in status && status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        }
        return;
      }

      // Load new sound
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const onStatus = (st: Audio.AVPlaybackStatus) => {
        if (!('isLoaded' in st) || !st.isLoaded) return;
        setIsPlaying(!!st.isPlaying);
        setPositionMs(st.positionMillis || 0);
        setDurationMs(st.durationMillis || 0);
      };
      const { sound: s } = await Audio.Sound.createAsync({ uri: rec.uri }, { shouldPlay: true }, onStatus);
      setSound(s);
      setCurrentId(rec.id);
    } catch (e) {
      alert('Failed to play: ' + (e as Error).message);
    }
  };
  const handleMenu = (id: string) => {
    // Menu logic here
    alert('Menu for recording ' + id);
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <Navbar onLogout={() => router.replace('/')} />
      <View style={styles.listSection}>
        <FlatList
          data={recs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.recordingItem}>
              <TouchableOpacity onPress={() => handlePlayToggle(item)} style={styles.playBtn}>
                <Ionicons
                  name={currentId === item.id && isPlaying ? 'pause-circle' : 'play-circle'}
                  size={36}
                  color="#e75480"
                />
              </TouchableOpacity>
              <View style={styles.recordingInfo}>
                <Text style={styles.recordingTitle}>{item.title}</Text>
                <Text style={styles.recordingDesc}>{item.description}</Text>
                {currentId === item.id && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${durationMs ? Math.min(100, (positionMs / durationMs) * 100) : 0}%` }]} />
                    </View>
                    <Text style={styles.progressTime}>
                      {formatTime(positionMs)} / {formatTime(durationMs)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.rightIcons}>
                <TouchableOpacity onPress={() => handleMenu(item.id)}>
                  <Entypo name="dots-three-vertical" size={20} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function formatTime(ms: number) {
  const totalSec = Math.floor((ms || 0) / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

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
  listSection: {
    flex: 1,
    padding: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  playBtn: {
    marginRight: 16,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e75480',
  },
  recordingDesc: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#ffe4ec',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#e75480',
  },
  progressTime: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
});
