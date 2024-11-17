import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Artwork } from "../types/artwork";
import { Colors } from "../constants/colors"; // Import the colors from constants/colors.ts
import { useColorBlindFilter } from "@/hooks/useColorBlindFilter"; // Import the context
import { getArtistById } from "@/api/artistApi"; // Import API to fetch artist details

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
  const { currentColors } = useColorBlindFilter(); // Access the color-blind friendly colors
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
        { backgroundColor: currentColors.primary || Colors.primary }, // Use color-blind mode or fallback to default color
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
            fontSize: textSize,
            color: currentColors.secondary || Colors.secondary,
          }, // Apply dynamic text color
        ]}
      >
        {artwork.title}
      </Text>
      <Text
        style={[
          styles.artist,
          {
            fontSize: textSize - 2,
            color: currentColors.secondary || Colors.secondary,
          }, // Apply dynamic text color
        ]}
      >
        by {artistName}
      </Text>
      <Text
        style={[
          styles.description,
          {
            fontSize: textSize - 4,
            color: currentColors.secondary || Colors.secondary,
          }, // Apply dynamic text color
        ]}
      >
        {artwork.description}
      </Text>

      <Text
        style={[
          styles.likes,
          {
            fontSize: textSize - 4,
            color: currentColors.secondary || Colors.secondary,
          }, // Apply dynamic text color
        ]}
      >
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </Text>

      <Pressable onPress={toggleLike} style={styles.likeButton}>
        <Text
          style={{
            fontSize: textSize - 2,
            color: isLiked
              ? currentColors.primary || Colors.primary
              : currentColors.secondary || Colors.secondary, // Adjust like button color
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
