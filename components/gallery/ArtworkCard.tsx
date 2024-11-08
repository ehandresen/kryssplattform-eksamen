import React from "react";
import { View, Text, Image } from "react-native";
import { Artwork } from "../../types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md mb-4">
      <Image
        source={{ uri: artwork.imageUrl }}
        style={{ width: "100%", aspectRatio: 1.5 }}
        className="rounded-lg mb-3"
      />
      <Text className="text-lg font-bold mb-1">{artwork.title}</Text>
      <Text className="text-sm text-gray-600 mb-2">by {artwork.artistId}</Text>
      <Text className="text-sm text-gray-700">{artwork.description}</Text>
    </View>
  );
}
