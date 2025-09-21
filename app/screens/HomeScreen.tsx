import { Link } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const EmergencyButton = styled.TouchableOpacity`
  background-color: #e11d48;
  padding: 48px 64px;
  border-radius: 100px;
  margin-bottom: 32px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 32px;
  font-weight: bold;
`;

const NavLink = styled.TouchableOpacity`
  margin-top: 16px;
`;

export default function HomeScreen() {
  return (
    <Container>
      <EmergencyButton onPress={() => alert('Emergency Triggered!')}>
        <ButtonText>EMERGENCY</ButtonText>
      </EmergencyButton>
      <Link href="/(tabs)/status" asChild>
        <NavLink>
          <Text style={{ color: '#2563eb' }}>Go to Status</Text>
        </NavLink>
      </Link>
      <Link href="/(tabs)/settings" asChild>
        <NavLink>
          <Text style={{ color: '#2563eb' }}>Go to Settings</Text>
        </NavLink>
      </Link>
    </Container>
  );
}
