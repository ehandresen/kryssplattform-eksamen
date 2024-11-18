/**
 * Komponent for å vise informasjon om en artist.
 * Denne komponenten presenterer artistens profilbilde, navn og biografi.
 * Brukeren kan trykke på kortet for å utføre en handling via `onPress`.
 */

import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

interface ArtistCardProps {
  artist: {
    id: string;
    displayName?: string; // Valgfritt navn for å unngå krasj hvis det mangler
    email?: string;
    profileImageUrl?: string; // Valgfritt profilbilde
    bio?: string; // Valgfri biografi
  };
  onPress: () => void; // Handling som utføres ved trykk på kortet
  textSize: number; // Dynamisk tekststørrelse
}

export default function ArtistCard({
  artist,
  onPress,
  textSize,
}: ArtistCardProps) {
  // Debugging: Logger artistdata for å sikre korrekt input
  console.log("ArtistCard mottok data:", artist);

  return (
    <Pressable
      onPress={onPress}
      style={styles.cardContainer}
      // Debugging: Logger når kortet trykkes
      onPressIn={() => console.log("ArtistCard trykket:", artist.id)}
    >
      {/* Profilbilde */}
      <Image
        source={{
          uri: artist.profileImageUrl || "https://via.placeholder.com/150", // Placeholder for manglende bilder
        }}
        style={styles.image}
        // Debugging: Logger bilde-URL
        onError={(error) =>
          console.error(
            `Feil ved innlasting av bilde for artist ${artist.id}:`,
            error.nativeEvent
          )
        }
      />

      {/* Artistens navn */}
      <Text style={[styles.name, { fontSize: textSize }]}>
        {artist.displayName || "Ukjent artist"}{" "}
        {/* Standard tekst hvis navn mangler */}
      </Text>

      {/* Artistens biografi */}
      <Text style={[styles.bio, { fontSize: textSize - 2 }]}>
        {artist.bio || "Ingen biografi tilgjengelig."}{" "}
        {/* Standard tekst hvis bio mangler */}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Stil for kortets container
  cardContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9", // Lys bakgrunnsfarge
    shadowColor: "#000", // Skyggefarge
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Hever kortet visuelt
    alignItems: "center",
    marginBottom: 16, // Mellomrom mellom kortene
  },
  // Stil for profilbildet
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // Gjør bildet rundt
    marginBottom: 12, // Mellomrom til teksten
  },
  // Stil for artistens navn
  name: {
    fontWeight: "bold",
    textAlign: "center", // Sentrerer teksten
    marginBottom: 4, // Mellomrom til bioen
    color: "#333", // Mørk tekstfarge
  },
  // Stil for artistens biografi
  bio: {
    color: "#666", // Grå tekstfarge
    textAlign: "center", // Sentrerer teksten
  },
});
