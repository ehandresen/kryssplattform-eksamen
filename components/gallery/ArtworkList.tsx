// components/ArtworkList.tsx

import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "../../types/artwork";
import { Link } from "expo-router";

interface ArtworkListProps {
  data: Artwork[];
}

export default function ArtworkList({ data }: ArtworkListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.cardContainer}>
          <Link
            href={{
              pathname: "/artworkDetails/[id]",
              params: { id: item.id },
            }}
          >
            <ArtworkCard artwork={item} />
          </Link>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    // padding: 16,
    // marginVertical: 8,
    // marginHorizontal: 16,
    // backgroundColor: '#f9f9f9',
    // borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
  },

  listContent: {
    paddingBottom: 160, // Adjust to avoid overlap with buttons
  },
});
