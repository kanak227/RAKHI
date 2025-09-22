import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>RAKHI</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => alert('Logout!')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
      {/* Codeword Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Codeword</Text>
          <TouchableOpacity onPress={() => alert('Preview codeword')}
            style={styles.previewBtn}>
            <Ionicons name="play-circle" size={24} color="#e75480" />
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.codewordMicRow}>
          <TouchableOpacity onPress={() => alert('Edit/Record Codeword')} style={styles.micBtn}>
            <MaterialCommunityIcons name="microphone" size={32} color="#e75480" />
          </TouchableOpacity>
          <Text style={styles.editLabel}>Tap mic to edit codeword</Text>
        </View>
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
