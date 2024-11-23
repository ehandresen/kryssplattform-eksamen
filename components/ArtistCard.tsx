import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useAccessibility } from "@/hooks/useAccessibility";

interface ArtistCardProps {
  artist: {
    id: string;
    displayName?: string;
    email?: string;
    profileImageUrl?: string;
    bio?: string;
  };
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const { textSize, currentColors } = useAccessibility();

  return (
    <View
      style={[styles.cardContainer, { backgroundColor: currentColors.card }]}
    >
      {/* Profilbilde */}
      <Image
        source={{
          uri: artist.profileImageUrl || "https://via.placeholder.com/150",
        }}
        style={styles.image}
        onError={(error) =>
          console.error(
            `Error uploading image by artist ${artist.id}:`,
            error.nativeEvent
          )
        }
      />

      {/* Artistens navn */}
      <Text
        style={[
          styles.name,
          {
            fontSize: textSize,
            color: currentColors.text,
          },
        ]}
      >
        {artist.displayName || "Uknknown artist"}
      </Text>

      {/* Artistens biografi */}
      <Text
        style={[
          styles.bio,
          {
            fontSize: textSize - 2,
            color: currentColors.text,
          },
        ]}
      >
        {artist.bio || "No bio available."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 8,
    shadowOpacity: 0.2,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 8,
    flexWrap: "wrap",
    width: "100%",
  },
  bio: {
    flexWrap: "wrap",
    width: "100%",
  },
});
