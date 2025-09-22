import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MainScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>RAKHI</Text>
      </View>
      <View style={styles.optionsContainer}>
  <TouchableOpacity style={styles.button} onPress={() => router.replace('/victim/dashboard')}>
          <Text style={styles.buttonText}>Continue as Victim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/ally/dashboard')}>
          <Text style={styles.buttonText}>Continue as Ally</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffb6c1', // light pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e75480', // deeper pink
    letterSpacing: 6,
    fontFamily: 'serif',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    // Add smoothness
  },
  optionsContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#e75480',
    paddingVertical: 18,
    borderRadius: 32,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
