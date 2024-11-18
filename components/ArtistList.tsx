import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ArtistCard from "./ArtistCard";
import { useRouter } from "expo-router";
import { Artist } from "@/types/artist";

interface ArtistListProps {
  artists: Artist[];
}

export default function ArtistList({ artists }: ArtistListProps) {
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
          textSize={16} // Set a reasonable default text size
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
