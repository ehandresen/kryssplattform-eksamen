import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useAccessibility } from "@/hooks/useAccessibility"; // Tilgjengelighetshook for tekststørrelse og farger

interface ArtistCardProps {
  artist: {
    id: string;
    displayName?: string; // Valgfritt navn for å unngå krasj hvis det mangler
    email?: string;
    profileImageUrl?: string; // Valgfritt profilbilde
    bio?: string; // Valgfri biografi
  };
  onPress: () => void; // Handling som utføres ved trykk på kortet
}

export default function ArtistCard({ artist, onPress }: ArtistCardProps) {
  const { textSize, currentColors } = useAccessibility(); // Tilgjengelighetsinnstillinger

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cardContainer,
        { backgroundColor: currentColors.primary }, // Dynamisk bakgrunnsfarge
      ]}
    >
      {/* Profilbilde */}
      <Image
        source={{
          uri: artist.profileImageUrl || "https://via.placeholder.com/150", // Placeholder for manglende bilder
        }}
        style={styles.image}
        onError={(error) =>
          console.error(
            `Feil ved innlasting av bilde for artist ${artist.id}:`,
            error.nativeEvent
          )
        }
      />

      {/* Artistens navn */}
      <Text
        style={[
          styles.name,
          {
            fontSize: textSize, // Dynamisk tekststørrelse
            color: currentColors.secondary, // Dynamisk farge
          },
        ]}
      >
        {artist.displayName || "Ukjent artist"}
      </Text>

      {/* Artistens biografi */}
      <Text
        style={[
          styles.bio,
          {
            fontSize: textSize - 2, // Justert tekststørrelse
            color: currentColors.secondary, // Dynamisk farge
          },
        ]}
      >
        {artist.bio || "Ingen biografi tilgjengelig."}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 8,
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
  },
  bio: {
    textAlign: "center",
  },
});
