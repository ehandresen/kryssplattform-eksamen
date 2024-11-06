// components/ArtworkList.tsx

import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ArtworkCard from "./ArtworkCard";
import { ArtworkData } from "../../utils/artworkData";

interface ArtworkListProps {
  data: ArtworkData[];
}

export default function ArtworkList({ data }: ArtworkListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArtworkCard artwork={item} />}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 160, // Adjust to avoid overlap with buttons
  },
});
