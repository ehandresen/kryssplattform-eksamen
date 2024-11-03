import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const HomeScreen = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="sign out" onPress={() => signOut()} />
    </View>
  );
};

export default HomeScreen;
