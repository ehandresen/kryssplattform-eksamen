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

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ArtistCard
          artist={item}
          onPress={() => router.push(`/artistDetails/${item.id}`)}
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
