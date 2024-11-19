/**
 * ArtworkCard-komponent
 * Viser et enkelt kunstverk med bilde, tittel, kunstnerens navn, beskrivelse, og liker-status.
 * Inkluderer funksjonalitet for å "like" og "unlike" et kunstverk.
 */

import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Artwork } from "../types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Tilgjengelighetshook for tekststørrelse og farger
import { getArtistById } from "@/api/artistApi"; // Henter kunstnerdetaljer fra API

interface ArtworkCardProps {
  artwork: Artwork; // Kunstverket som vises
  isLiked: boolean; // Om brukeren har likt kunstverket
  numLikes: number; // Antall likes kunstverket har
  toggleLike: () => void; // Funksjon for å like/unlike kunstverket
}

export default function ArtworkCard({
  artwork,
  isLiked,
  numLikes,
  toggleLike,
}: ArtworkCardProps) {
  const { textSize, currentColors } = useAccessibility(); // Tilgjengelighetsinnstillinger for tekst og farger
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
          console.error("Feil ved henting av kunstnerens navn:", error);
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
        { backgroundColor: currentColors.primary }, // Dynamisk farge basert på tilgjengelighetsinnstillinger
      ]}
    >
      {/* Bilde av kunstverket */}
      <Image
        source={{ uri: artwork.imageUrl }}
        style={styles.image}
        onError={() => console.log("Feil ved innlasting av bilde.")} // Debugging for bildeinnlasting
        defaultSource={require("../assets/placeholder.png")} // Placeholder-bilde hvis bilde mangler
      />

      {/* Tittel på kunstverket */}
      <Text
        style={[
          styles.title,
          {
            fontSize: textSize, // Dynamisk tekststørrelse
            color: currentColors.secondary, // Dynamisk farge
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
            fontSize: textSize - 2, // Litt mindre enn tittelen
            color: currentColors.secondary,
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
            fontSize: textSize - 4, // Enda mindre tekststørrelse
            color: currentColors.secondary,
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
            color: currentColors.secondary,
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
            color: isLiked
              ? currentColors.primary // Dynamisk farge hvis likt
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
    flexWrap: "wrap", // Sørger for at teksten brytes
    width: "100%", // Sikrer at teksten holder seg innenfor containeren
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
