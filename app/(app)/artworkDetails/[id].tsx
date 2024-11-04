import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const ArtworkDetails = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>id: {id}</Text>
    </View>
  );
};

export default ArtworkDetails;
