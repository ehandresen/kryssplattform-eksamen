/**
 * ArtworkCard-komponent
 * Viser et enkelt kunstverk med bilde, tittel, kunstnerens navn, beskrivelse, og liker-status.
 * Inkluderer funksjonalitet for å "like" og "unlike" et kunstverk.
 */

import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Artwork } from "../types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility";
import { getArtistById } from "@/api/artistApi";

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
  const { textSize, currentColors } = useAccessibility();
  const [artistName, setArtistName] = useState<string>("");

  /**
   * Henter kunstnerens navn basert på artistId fra kunstverket.
   * Logger eventuelle feil hvis kunstnerdetaljene ikke kan hentes.
   */
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
      style={[styles.cardContainer, { backgroundColor: currentColors.card }]}
    >
      {/* Bilde av kunstverket */}
      <Image
        source={{ uri: artwork.imageUrl }}
        style={styles.image}
        onError={() => console.log("Error uploading image ved.")}
        defaultSource={require("../assets/placeholder.png")}
      />

      {/* Tittel på kunstverket */}
      <Text
        style={[
          styles.title,
          {
            fontSize: textSize,
            color: currentColors.text,
          },
        ]}
      >
        {artwork.title}
      </Text>

      {/* Kunstnerens navn */}
      <Text
        style={[
          styles.artist,
          {
            fontSize: textSize - 2,
            color: currentColors.text,
          },
        ]}
      >
        by {artistName}
      </Text>

      {/* Beskrivelse av kunstverket */}
      <Text
        style={[
          styles.description,
          {
            fontSize: textSize - 4,
            color: currentColors.text,
          },
        ]}
      >
        {artwork.description}
      </Text>

      {/* Antall likes */}
      <Text
        style={[
          styles.likes,
          {
            fontSize: textSize - 4,
            color: currentColors.special,
          },
        ]}
      >
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </Text>

      {/* Knapp for å like/unlike kunstverket */}
      <Pressable onPress={toggleLike} style={styles.likeButton}>
        <Text
          style={{
            fontSize: textSize - 2,
            color: isLiked ? currentColors.error : currentColors.special,
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
    flexWrap: "wrap",
    width: "100%",
  },
  artist: {
    marginBottom: 8,
    flexWrap: "wrap",
    width: "100%",
  },
  description: {
    flexWrap: "wrap",
    width: "100%",
  },
  likes: {
    marginTop: 8,
    flexWrap: "wrap",
    width: "100%",
  },
  likeButton: {
    marginTop: 10,
  },
});
