import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import ArtistCard from "./ArtistCard"; // Komponent for å vise hver artist som et kort
import { useRouter } from "expo-router"; // Navigasjon for detaljer
import { Artist } from "@/types/artist"; // Typedefinisjon for Artist

interface ArtistListProps {
  artists: Artist[]; // Liste over artister som skal vises
  textSize?: number; // Valgfri tekststørrelse, standardverdi er satt
  onRefresh: () => Promise<void>; // Funksjon for oppdatering
  refreshing: boolean; // Indikator for oppdateringsstatus
}

export default function ArtistList({
  artists,
  textSize = 16,
  onRefresh,
  refreshing,
}: ArtistListProps) {
  const router = useRouter(); // Henter router for navigasjon

  return (
    <FlatList
      data={artists} // Data for artistene
      keyExtractor={(item) => item.id} // Unik nøkkel for hver artist
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <ArtistCard
          artist={item} // Sender artistdata til ArtistCard
          onPress={() => router.push(`/artistDetails/${item.id}`)} // Navigerer til detaljer
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
