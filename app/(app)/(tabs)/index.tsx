import { View, Text, Button, FlatList } from 'react-native';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { mockData } from '@/mockData';
import { Link } from 'expo-router';
import ArtworkCard from '@/components/ArtworkCard';

const HomeScreen = () => {
  const { signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <FlatList
        data={mockData}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/artworkDetails/[id]',
              params: { id: item.id },
            }}
          >
            <ArtworkCard
              title={item.title}
              artist={item.artistId}
              image={item.photoURL}
            />
          </Link>
        )}
      />
      <Button title="sign out" onPress={() => signOut()} />
    </View>
  );
};

export default HomeScreen;
