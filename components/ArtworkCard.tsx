import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Artwork } from "../types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
  isLiked: boolean;
  numLikes: number;
  toggleLike: () => void;
}

export default function ArtworkCard({
  artwork,
  isLiked,
  numLikes,
  toggleLike,
}: ArtworkCardProps) {
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

      <Text>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </Text>

      <Pressable onPress={toggleLike} style={{ marginTop: 10 }}>
        <Text style={{ color: isLiked ? "blue" : "gray" }}>
          {isLiked ? "Unlike" : "Like"}
        </Text>
      </Pressable>
    </View>
  );
}
