import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ArtistCard from "./ArtistCard";
import { useRouter } from "expo-router";
import { Artist } from "@/types/artist";

interface ArtistListProps {
  artists: Artist[];
  textSize?: number; // Legger til textSize som valgfri egenskap
}

export default function ArtistList({
  artists,
  textSize = 16,
}: ArtistListProps) {
  const router = useRouter();

  // Debugging: Log the artists array to ensure correct data is passed
  console.log("ArtistList received artists:", artists);

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ArtistCard
          artist={item}
          onPress={() => router.push(`/artistDetails/${item.id}`)}
          textSize={textSize} // Bruker textSize her
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
});
