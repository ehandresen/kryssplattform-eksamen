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
        <View className="px-4 my-2">
          <Link
            href={{
              pathname: "/artworkDetails/[id]",
              params: { id: item.id },
            }}
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
