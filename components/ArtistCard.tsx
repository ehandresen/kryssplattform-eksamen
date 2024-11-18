import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

interface ArtistCardProps {
  artist: {
    id: string;
    displayName?: string; // Optional to avoid crashing if missing
    email?: string;
    profileImageUrl?: string;
    bio?: string;
  };
  onPress: () => void;
  textSize: number; // Add textSize prop
}

export default function ArtistCard({
  artist,
  onPress,
  textSize,
}: ArtistCardProps) {
  // Debugging: Log the artist data
  console.log("ArtistCard received data:", artist);

  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      {/* Profile Image */}
      <Image
        source={{
          uri: artist.profileImageUrl || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />

      {/* Display Name */}
      <Text style={[styles.name, { fontSize: textSize }]}>
        {artist.displayName || "Unknown Artist"}
      </Text>

      {/* Bio */}
      <Text style={[styles.bio, { fontSize: textSize - 2 }]}>
        {artist.bio || "No bio available."}
      </Text>
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
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#333",
  },
  bio: {
    color: "#666",
    textAlign: "center",
  },
});
