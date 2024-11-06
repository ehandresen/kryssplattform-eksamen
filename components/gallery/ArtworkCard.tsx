// components/ArtworkCard.tsx

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ArtworkData } from "../../utils/artworkData";

interface ArtworkCardProps {
  artwork: ArtworkData;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <View style={styles.artworkCard}>
      <Image source={{ uri: artwork.image }} style={styles.artworkImage} />
      <Text style={styles.title}>{artwork.title}</Text>
      <Text style={styles.artist}>by {artwork.artist}</Text>
      <Text style={styles.description}>{artwork.description}</Text>
      <Text style={styles.hashtags}>{artwork.hashtags.join(" ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  artworkCard: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  artworkImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },
  hashtags: {
    fontSize: 12,
    color: "#0096C7",
  },
});
