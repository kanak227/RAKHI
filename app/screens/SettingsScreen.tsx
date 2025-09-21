import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, FlatList, Text } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 24px 16px 0 16px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
`;

const AllyItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const NavLink = styled.TouchableOpacity`
  margin-top: 16px;
`;

export default function SettingsScreen() {
  // No navigation hook needed, using Link for navigation
  const [codeword, setCodeword] = useState('');
  const [ally, setAlly] = useState('');
  const [allies, setAllies] = useState<string[]>([]);

  const addAlly = () => {
    if (ally.trim()) {
      setAllies([...allies, ally.trim()]);
      setAlly('');
    }
  };

  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Settings</Text>
      <Label>Codeword</Label>
      <Input
        value={codeword}
        onChangeText={setCodeword}
        placeholder="Enter your codeword"
      />
      <Label>Allies</Label>
      <Input
        value={ally}
        onChangeText={setAlly}
        placeholder="Add ally (email or phone)"
        onSubmitEditing={addAlly}
      />
      <Button title="Add Ally" onPress={addAlly} />
      <FlatList
        data={allies}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <AllyItem>
            <Text>{item}</Text>
          </AllyItem>
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
