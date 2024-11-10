// ArtworkCard.tsx
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Artwork } from "../types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
  isLiked: boolean;
  numLikes: number;
  toggleLike: () => void;
  textSize: number; // Add textSize prop
}

export default function ArtworkCard({
  artwork,
  isLiked,
  numLikes,
  toggleLike,
  textSize,
}: ArtworkCardProps) {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowOpacity: 0.2,
        marginBottom: 16,
      }}
    >
      <Image
        source={{ uri: artwork.imageUrl }}
        style={{
          width: "100%",
          aspectRatio: 1.5,
          borderRadius: 8,
          marginBottom: 12,
        }}
        onError={(error) =>
          console.log("Image load error:", error.nativeEvent.error)
        }
      />

      <Text style={{ fontSize: textSize, fontWeight: "bold", marginBottom: 8 }}>
        {artwork.title}
      </Text>
      <Text style={{ fontSize: textSize - 2, color: "#555", marginBottom: 8 }}>
        by {artwork.artistId}
      </Text>
      <Text style={{ fontSize: textSize - 4, color: "#333" }}>
        {artwork.description}
      </Text>

      <Text style={{ fontSize: textSize - 4, color: "#333", marginTop: 8 }}>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </Text>

      <Pressable onPress={toggleLike} style={{ marginTop: 10 }}>
        <Text
          style={{ fontSize: textSize - 2, color: isLiked ? "blue" : "gray" }}
        >
          {isLiked ? "Unlike" : "Like"}
        </Text>
      </Pressable>
    </View>
  );
}
