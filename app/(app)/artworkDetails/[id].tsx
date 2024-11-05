import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import ArtworkCard from '@/components/ArtworkCard';
import * as artworkApi from '@/api/artworkApi';
import { Artwork } from '@/types/artwork';

const ArtworkDetails = () => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchArtworkFromFirebase();
  }, []);

  const fetchArtworkFromFirebase = async () => {
    try {
      const artworkObj = await artworkApi.getArtworkById(id as string);

      if (artworkObj) {
        setArtwork(artworkObj);
      }
    } catch (error) {
      console.log('failed to fetch post');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {artwork && (
        <ArtworkCard
          title={artwork.title}
          artist={artwork.artistId || ''}
          imageUrl={artwork.imageUrl}
          caption={artwork.caption || ''}
          viewsCount={artwork.viewsCount || 0}
          likesCount={artwork.likesCount || 0}
        />
      )}
    </View>
  );
};

export default ArtworkDetails;
