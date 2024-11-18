/**
 * Komponent som viser en liste over artister som kort.
 * Bruker `FlatList` for å optimalisere rendering av mange artister.
 * Hver artist vises med et `ArtistCard`, og brukeren kan navigere til artistens detaljer.
 */

import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ArtistCard from "./ArtistCard"; // Komponent for å vise hver artist som et kort
import { useRouter } from "expo-router"; // Navigasjon for detaljer
import { Artist } from "@/types/artist"; // Typedefinisjon for Artist

interface ArtistListProps {
  artists: Artist[]; // Liste over artister som skal vises
  textSize?: number; // Valgfri tekststørrelse, standardverdi er satt
}

export default function ArtistList({
  artists,
  textSize = 16,
}: ArtistListProps) {
  const router = useRouter(); // Henter router for navigasjon

  // Debugging: Logger artistlisten for å sikre at riktig data blir sendt inn
  console.log("ArtistList mottok artistdata:", artists);

  return (
    <FlatList
      data={artists} // Data som skal vises i listen
      keyExtractor={(item) => item.id} // Unik nøkkel for hver artist
      renderItem={({ item }) => (
        // Renderer hvert artistkort
        <ArtistCard
          artist={item} // Sender artistdata til ArtistCard
          onPress={() => {
            console.log("Navigerer til detaljer for artist:", item.id); // Debugging
            router.push(`/artistDetails/${item.id}`); // Navigerer til artistdetaljer
          }}
          textSize={textSize} // Sender tekststørrelse til ArtistCard
        />
      )}
      contentContainerStyle={styles.listContainer} // Styling for listen
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16, // Gir mellomrom rundt listen
  },
});
