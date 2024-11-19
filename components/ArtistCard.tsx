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
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const { textSize, currentColors } = useAccessibility(); // Tilgjengelighetsinnstillinger

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: currentColors.primary }, // Dynamisk farge basert på tilgjengelighetsinnstillinger
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
    flexWrap: "wrap", // Sørger for at teksten brytes
    width: "100%", // Sikrer at teksten holder seg innenfor containeren
  },
  bio: {
    flexWrap: "wrap",
    width: "100%",
  },
});
