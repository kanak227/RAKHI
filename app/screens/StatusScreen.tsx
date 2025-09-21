import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 24px 16px 0 16px;
`;

const StatusItem = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const NavLink = styled.TouchableOpacity`
  margin-top: 16px;
`;

const statusData = [
  { id: '1', label: 'Recording started', status: 'Active' },
  { id: '2', label: 'Audio sent to allies', status: 'Delivered' },
  { id: '3', label: 'Ally confirmed receipt', status: 'Confirmed' },
];

export default function StatusScreen() {
  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Status</Text>
      <FlatList
        data={statusData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StatusItem>
            <Text style={{ fontSize: 18 }}>{item.label}</Text>
            <Text style={{ color: '#22c55e' }}>{item.status}</Text>
          </StatusItem>
        )}
      />
      <Link href="/(tabs)/home" asChild>
        <NavLink>
          <Text style={{ color: '#2563eb' }}>Back to Home</Text>
        </NavLink>
      </Link>
    </Container>
  );
}
