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
  textSize: number; // Add textSize prop
}

export default function ArtistCard({
  artist,
  onPress,
  textSize,
}: ArtistCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <Image
        source={{
          uri: artist.profileImageUrl || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <Text
        style={[
          styles.name,
          {
            fontSize: textSize, // Apply textSize
          },
        ]}
      >
        {artist.displayName}
      </Text>
      <Text
        style={[
          styles.email,
          {
            fontSize: textSize - 2, // Slightly smaller than display name
          },
        ]}
      >
        {artist.email}
      </Text>
      {artist.bio && (
        <Text
          style={[
            styles.bio,
            {
              fontSize: textSize - 4, // Slightly smaller for bio
            },
          ]}
        >
          {artist.bio}
        </Text>
      )}
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
    marginBottom: 4,
  },
  email: {
    color: "gray",
    marginBottom: 4,
  },
  bio: {
    color: "#666",
    textAlign: "center",
  },
});
