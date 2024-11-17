import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Artwork } from "../types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook
import { getArtistById } from "@/api/artistApi"; // Import API to fetch artist details

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
  const { textSize, currentColors } = useAccessibility(); // Unified logic for accessibility
  const [artistName, setArtistName] = useState<string>("");

  useEffect(() => {
    const fetchArtistName = async () => {
      if (artwork.artistId) {
        try {
          const artist = await getArtistById(artwork.artistId);
          setArtistName(artist?.displayName || "Unknown Artist");
        } catch (error) {
          console.error("Error fetching artist name:", error);
          setArtistName("Unknown Artist");
        }
      } else {
        setArtistName("Unknown Artist");
      }
    };

    fetchArtistName();
  }, [artwork.artistId]);

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: currentColors.primary }, // Apply currentColors
      ]}
    >
      <Image
        source={{ uri: artwork.imageUrl }}
        style={styles.image}
        onError={() => console.log("Image failed to load.")}
        defaultSource={require("../assets/placeholder.png")} // Placeholder
      />

      <Text
        style={[
          styles.title,
          {
            fontSize: textSize, // Apply textSize
            color: currentColors.secondary, // Apply currentColors
          },
        ]}
      >
        {artwork.title}
      </Text>
      <Text
        style={[
          styles.artist,
          {
            fontSize: textSize - 2, // Slightly smaller than title
            color: currentColors.secondary,
          },
        ]}
      >
        by {artistName}
      </Text>
      <Text
        style={[
          styles.description,
          {
            fontSize: textSize - 4, // Slightly smaller for descriptions
            color: currentColors.secondary,
          },
        ]}
      >
        {artwork.description}
      </Text>

      <Text
        style={[
          styles.likes,
          {
            fontSize: textSize - 4,
            color: currentColors.secondary,
          },
        ]}
      >
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </Text>

      <Pressable onPress={toggleLike} style={styles.likeButton}>
        <Text
          style={{
            fontSize: textSize - 2,
            color: isLiked
              ? currentColors.primary // Change color when liked
              : currentColors.secondary,
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
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    flexWrap: "wrap", // Ensures text wraps
    width: "100%", // Ensures text fits within container width
  },
  artist: {
    marginBottom: 8,
    flexWrap: "wrap", // Ensures text wraps
    width: "100%", // Ensures text fits within container width
  },
  description: {
    flexWrap: "wrap", // Ensures text wraps
    width: "100%", // Ensures text fits within container width
  },
  likes: {
    marginTop: 8,
    flexWrap: "wrap", // Ensures text wraps
    width: "100%", // Ensures text fits within container width
  },
  likeButton: {
    marginTop: 10,
  },
});
