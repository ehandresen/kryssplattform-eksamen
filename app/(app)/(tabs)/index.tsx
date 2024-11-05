import { View, Text, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'expo-router';
import ArtworkCard from '@/components/ArtworkCard';
import * as artworkApi from '@/api/artworkApi';
import { Artwork } from '@/types/artwork';

const HomeScreen = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const { signOut } = useAuth();

  useEffect(() => {
    fetchArtworksFromFirebase();
  }, []);

  const fetchArtworksFromFirebase = async () => {
    try {
      const data = await artworkApi.getAllArtworks();
      setArtworks(data);
    } catch (error) {
      console.log(error);
    }
  };

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
        data={artworks}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/artworkDetails/[id]',
              params: { id: item.id },
            }}
          >
            <ArtworkCard
              title={item.title}
              artist={item.artistId || ''}
              imageUrl={item.imageUrl}
              caption={item.caption || ''}
              viewsCount={item.viewsCount || 0}
              likesCount={item.likesCount || 0}
            />
          </Link>
        )}
      />
      <Button title="sign out" onPress={() => signOut()} />
    </View>
  );
};

export default HomeScreen;
