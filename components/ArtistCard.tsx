import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

interface ArtistCardProps {
  artist: {
    id: string;
    displayName: string;
    email: string;
    profileImageUrl?: string;
    bio?: string;
  };
  onPress: () => void;
}

export default function ArtistCard({ artist, onPress }: ArtistCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <Image
        source={{
          uri: artist.profileImageUrl || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <Text style={styles.name}>{artist.displayName}</Text>
      <Text style={styles.email}>{artist.email}</Text>
      {artist.bio && <Text style={styles.bio}>{artist.bio}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
  },
  bio: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
