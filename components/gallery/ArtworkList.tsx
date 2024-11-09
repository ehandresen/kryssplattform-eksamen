import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "../../types/artwork";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import * as artworkApi from "@/api/artworkApi";

interface ArtworkListProps {
  data: Artwork[];
}

export default function ArtworkList({ data }: ArtworkListProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(data);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setRefreshing(true);
    const updatedArtworks = await artworkApi.getAllArtworks();
    setArtworks(updatedArtworks);
    setRefreshing(false);
  };

  const handleToggleLike = async (id: string) => {
    // update local state to immediately reflect like status in UI
    setArtworks((prevArtworks) =>
      prevArtworks.map((artwork) => {
        // check if the current artwork matches the one being liked/unliked
        if (artwork.id === id) {
          // check if user has already liked the artwork
          const isLiked = artwork.likes.includes(user?.uid ?? "");

          // update the likes array
          const updatedLikes = isLiked
            ? artwork.likes.filter((uid) => uid !== user?.uid) // remove like
            : [...artwork.likes, user?.uid ?? ""]; // add like

          // return updated artwork object with the modified likes array
          return { ...artwork, likes: updatedLikes };
        }
        // return original artwork if it doesn't match the id
        return artwork;
      })
    );

    // save like/unlike action to firestore
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
        <View className="px-4 my-2">
          <Link
            href={{
              pathname: "/artworkDetails/[id]",
              params: { id: item.id },
            }}
          >
            <ArtworkCard
              artwork={item}
              isLiked={item.likes.includes(user?.uid ?? "")} // if user id in the likes array, this is set to true
              numLikes={item.likes.length} // length of the likes array equals the number of likes
              toggleLike={() => handleToggleLike(item.id)}
            />
          </Link>
        </View>
      )}
      contentContainerStyle={{
        paddingHorizontal: 8,
      }}
    />
  );
}
