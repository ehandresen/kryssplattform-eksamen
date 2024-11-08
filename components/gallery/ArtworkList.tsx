import React from "react";
import { FlatList, View } from "react-native";
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
        <View className="flex-1 px-4">
          <Link
            href={{
              pathname: "/artworkDetails/[id]",
              params: { id: item.id },
            }}
            className="flex-1"
          >
            <ArtworkCard artwork={item} />
          </Link>
        </View>
      )}
      contentContainerStyle={{
        paddingBottom: 160,
        paddingHorizontal: 8,
      }}
    />
  );
}
