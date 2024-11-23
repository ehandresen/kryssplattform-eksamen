import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import ArtistCard from "./ArtistCard";
import { Artist } from "@/types/artist";
import { useRouter } from "expo-router";
import * as artistApi from "@/api/artistApi";

interface ArtistListProps {
  data: Artist[];
  textSize: number;
}

export default function ArtistList({ data }: ArtistListProps) {
  const [artists, setArtists] = useState<Artist[]>(data);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  /**
   * Oppdaterer lokal state når nye data sendes som prop.
   */
  useEffect(() => {
    setArtists(data);
  }, [data]);

  const fetchArtists = async () => {
    setRefreshing(true);
    try {
      const updatedArtists = await artistApi.getAllArtists();
      setArtists(updatedArtists); // Oppdaterer lokal state
    } catch (error) {
      console.error("Error fetching artists:", error); // Debugging
    } finally {
      setRefreshing(false); // Deaktiver oppdateringsindikatoren
    }
  };

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchArtists} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/artistDetails/${item.id}`)}
          style={{
            backgroundColor: "white",
            marginVertical: 16,
          }}
        >
          <ArtistCard artist={item} />
        </TouchableOpacity>
      )}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingBottom: 16,
      }}
    />
  );
}
