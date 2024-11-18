import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View, TouchableOpacity } from "react-native";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "../types/artwork";
import { useRouter } from "expo-router"; // Use the router for navigation
import { useAuth } from "@/hooks/useAuth";
import * as artworkApi from "@/api/artworkApi";

interface ArtworkListProps {
  data: Artwork[];
  textSize: number;
}

export default function ArtworkList({ data, textSize }: ArtworkListProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(data);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter(); // Initialize the router
  const { user } = useAuth();

  useEffect(() => {
    setArtworks(data);
  }, [data]);

  const fetchArtworks = async () => {
    setRefreshing(true);
    const updatedArtworks = await artworkApi.getAllArtworks();
    setArtworks(updatedArtworks);
    setRefreshing(false);
  };

  const handleToggleLike = async (id: string) => {
    setArtworks((prevArtworks) =>
      prevArtworks.map((artwork) => {
        if (artwork.id === id) {
          const isLiked = artwork.likes.includes(user?.uid ?? "");
          const updatedLikes = isLiked
            ? artwork.likes.filter((uid) => uid !== user?.uid)
            : [...artwork.likes, user?.uid ?? ""];

          return { ...artwork, likes: updatedLikes };
        }
        return artwork;
      })
    );

    await artworkApi.updateArtworkLikes(id, user?.uid ?? "");
  };

  return (
    <FlatList
      data={artworks}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchArtworks} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/artworkDetails/${item.id}`)}
          style={{
            backgroundColor: "white",
            marginVertical: 16,
          }}
        >
          <ArtworkCard
            artwork={item}
            isLiked={item.likes.includes(user?.uid ?? "")}
            numLikes={item.likes.length}
            toggleLike={() => handleToggleLike(item.id)}
            textSize={textSize}
          />
        </TouchableOpacity>
      )}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingBottom: 16,
      }}
    />
  );
}
