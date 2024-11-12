import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Artwork } from "../types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
  isLiked: boolean;
  numLikes: number;
  toggleLike: () => void;
  textSize: number;
}

export default function ArtworkCard({
  artwork,
  isLiked,
  numLikes,
  toggleLike,
  textSize,
}: ArtworkCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: artwork.imageUrl }}
        style={styles.image}
        onError={() => console.log("Image failed to load.")}
        defaultSource={require("../assets/placeholder.png")} // Placeholder
      />

      <Text style={[styles.title, { fontSize: textSize }]}>
        {artwork.title}
      </Text>
      <Text style={[styles.artist, { fontSize: textSize - 2 }]}>
        by {artwork.artistId}
      </Text>
      <Text style={[styles.description, { fontSize: textSize - 4 }]}>
        {artwork.description}
      </Text>

      <Text style={[styles.likes, { fontSize: textSize - 4 }]}>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </Text>

      <Pressable onPress={toggleLike} style={styles.likeButton}>
        <Text
          style={{
            fontSize: textSize - 2,
            color: isLiked ? "blue" : "gray",
          }}
        >
          {isLiked ? "Unlike" : "Like"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowOpacity: 0.2,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200, // Explicit height for consistent sizing
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  artist: {
    color: "#555",
    marginBottom: 8,
  },
  description: {
    color: "#333",
  },
  likes: {
    color: "#333",
    marginTop: 8,
  },
  likeButton: {
    marginTop: 10,
  },
});
