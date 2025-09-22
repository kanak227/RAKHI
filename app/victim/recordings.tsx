import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECORDINGS = [
  {
    id: '1',
    title: 'Recording 1',
    description: 'Conversation at the park',
    verified: true,
  },
  {
    id: '2',
    title: 'Recording 2',
    description: 'Call with support',
    verified: false,
  },
  {
    id: '3',
    title: 'Recording 3',
    description: 'Incident at office',
    verified: true,
  },
];

export default function RecordingsScreen() {
  const handlePlay = (id: string) => {
    // Play logic here
    alert('Play recording ' + id);
  };
  const handleMenu = (id: string) => {
    // Menu logic here
    alert('Menu for recording ' + id);
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>RAKHI</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => alert('Logout!')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listSection}>
        <FlatList
          data={RECORDINGS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.recordingItem}>
              <TouchableOpacity onPress={() => handlePlay(item.id)} style={styles.playBtn}>
                <Ionicons name="play-circle" size={36} color="#e75480" />
              </TouchableOpacity>
              <View style={styles.recordingInfo}>
                <Text style={styles.recordingTitle}>{item.title}</Text>
                <Text style={styles.recordingDesc}>{item.description}</Text>
              </View>
              <View style={styles.rightIcons}>
                {item.verified ? (
                  <MaterialIcons name="verified" size={24} color="#4ade80" style={{ marginRight: 8 }} />
                ) : (
                  <MaterialIcons name="error-outline" size={24} color="#fbbf24" style={{ marginRight: 8 }} />
                )}
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
});
