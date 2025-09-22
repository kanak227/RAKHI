import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../../components/ui/navbar';

const VICTIM = {
  firstName: 'Riya',
  lastName: 'Sharma',
};

const ALLIES = [
  { id: '1', name: 'Priya Sharma', contact: '+91 9876543210' },
  { id: '2', name: 'Amit Verma', contact: '+91 9123456780' },
  { id: '3', name: 'Neha Singh', contact: '+91 9988776655' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const handleLogout = () => {
    router.replace('/');
  };
  const handleStartRecording = () => {
    Alert.alert('Recording', 'Manual recording started!');
    // Add actual recording logic here
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />
      {/* Welcome */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome, {VICTIM.firstName}!</Text>
      </View>
      {/* Start Recording Button */}
      <TouchableOpacity style={styles.recordBtn} onPress={handleStartRecording}>
        <Text style={styles.recordBtnText}>START</Text>
      </TouchableOpacity>
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
  recordBtnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  alliesSection: {
    flex: 1,
    backgroundColor: '#fff0f5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    marginTop: 16,
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
