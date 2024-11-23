/**
 * ArtworkList-komponent
 * Viser en liste over kunstverk i form av en FlatList.
 * Inkluderer støtte for oppdatering av data, "like"-funksjonalitet, og navigasjon til detaljerte kunstverkssider.
 */

import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "../types/artwork";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import * as artworkApi from "@/api/artworkApi";

interface ArtworkListProps {
  data: Artwork[];
  textSize: number;
  disableRefresh?: boolean;
}

export default function ArtworkList({
  data,
  disableRefresh,
}: ArtworkListProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(data);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  /**
   * Oppdaterer lokal state når nye data sendes som prop.
   */
  useEffect(() => {
    setArtworks(data);
  }, [data]);

  /**
   * Henter oppdaterte kunstverk fra API og oppdaterer state.
   * Vises ved å dra ned for å oppdatere.
   */
  const fetchArtworks = async () => {
    if (disableRefresh) return;
    setRefreshing(true);
    try {
      const updatedArtworks = await artworkApi.getAllArtworks();
      setArtworks(updatedArtworks);
    } catch (error) {
      console.error("Error fetching artwork:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Håndterer "like"-funksjonalitet for et kunstverk.
   * Oppdaterer både lokalt og i databasen.
   * @param id ID-en til kunstverket som skal oppdateres
   */
  const handleToggleLike = async (id: string) => {
    // Oppdaterer lokalt for å gi en responsiv opplevelse
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

    // Oppdaterer databasen
    try {
      await artworkApi.updateArtworkLikes(id, user?.uid ?? "");
    } catch (error) {
      console.error("Feil ved oppdatering av likes:", error);
    }
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
