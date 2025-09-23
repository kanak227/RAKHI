import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../../components/ui/navbar';
import { getSocket } from '../../utils/socket';

// Alert type
type AlertItem = {
  id: string;
  message: string;
  time: string;
  audioUri?: string;
};
// Start with static alerts, but allow real-time updates
const INITIAL_ALERTS: AlertItem[] = [
  { id: '1', message: 'Victim triggered emergency alert', time: '2 min ago' },
  { id: '2', message: 'Audio received from victim', time: '10 min ago' },
  { id: '3', message: 'Victim marked safe', time: '1 day ago' },
];

const HELPLINES = [
  { id: '1', name: 'Women Helpline', contact: '1091' },
  { id: '2', name: 'National Commission for Women', contact: '7827-170-170' },
  { id: '3', name: 'NGO: Sakshi', contact: '+91 9876543210' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  useEffect(() => {
    // Load persisted alerts on mount
    AsyncStorage.getItem('ally_alerts').then(stored => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAlerts(parsed);
          }
        } catch {}
      }
    });

    const socket = getSocket();
    // Join as ally (use static id for now)
    socket.emit('join-ally', '1');
    // Listen for emergency alerts
    socket.on('emergency-alert', (data: { audioUri?: string }) => {
      setAlerts(prev => {
        const next = [
          {
            id: Date.now().toString(),
            message: 'Victim triggered emergency alert',
            time: 'Just now',
            audioUri: data.audioUri,
          },
          ...prev,
        ];
        AsyncStorage.setItem('ally_alerts', JSON.stringify(next)).catch(() => {});
        return next;
      });
    });
    return () => {
      socket.off('emergency-alert');
    };
  }, []);

  const handleLogout = () => {
    router.replace('/');
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, Ally!</Text>
        </View>
        {/* Alerts Section */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Recent Alerts from Victim</Text>
          {alerts.map(item => (
            <View key={item.id} style={styles.alertItem}>
              <Text style={styles.alertMsg}>{item.message}</Text>
              <Text style={styles.alertTime}>{item.time}</Text>
              {item.audioUri && (
                <Text style={{ color: '#e75480', fontSize: 12 }}>Audio: {item.audioUri}</Text>
              )}
            </View>
          ))}
        </View>
        {/* Graph Section */}
        <View style={styles.graphSection}>
          <Text style={styles.sectionTitle}>Victim Alerts Raised</Text>
          {/* Simple Bar Chart */}
          <View style={styles.barChartContainerWithMargin}>
            {[5, 2, 4].map((count, idx) => (
              <View key={idx} style={styles.barItem}>
                <View style={[styles.bar, { height: count * 16 }]} />
                <Text style={styles.barLabel}>Day {idx + 1}</Text>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Helpline Section */}
        <View style={styles.helplineSection}>
          <Text style={styles.sectionTitle}>Helpline Contacts</Text>
          <ScrollView style={{ maxHeight: 120 }}>
            {HELPLINES.map(h => (
              <View key={h.id} style={styles.helplineItem}>
                <Text style={styles.helplineName}>{h.name}</Text>
                <Text style={styles.helplineContact}>{h.contact}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  alertsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  alertItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffe4ec',
    paddingVertical: 8,
  },
  alertMsg: {
    fontSize: 15,
    color: '#e75480',
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  graphSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 0,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: 100,
    marginTop: 8,
    gap: 16,
  },
  barChartContainerWithMargin: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: 100,
    marginTop: 24,
    gap: 16,
  },
  barItem: {
    alignItems: 'center',
    width: 36,
  },
  bar: {
    width: 24,
    backgroundColor: '#e75480',
    borderRadius: 8,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  barCount: {
    fontSize: 13,
    color: '#e75480',
    fontWeight: 'bold',
    marginTop: 2,
  },
  helplineSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginLeft: 8,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    minWidth: 120,
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 0,
  },
  helplineItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffe4ec',
    paddingVertical: 8,
  },
  helplineName: {
    fontSize: 15,
    color: '#e75480',
    fontWeight: '600',
  },
  helplineContact: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e75480',
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
