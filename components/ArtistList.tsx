import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import ArtistCard from "./ArtistCard"; // Komponent for å vise hver artist som et kort
import { Artist } from "@/types/artist"; // Typedefinisjon for Artist
import { useRouter } from "expo-router"; // Navigasjon for detaljer
import * as artistApi from "@/api/artistApi"; // API for å hente og oppdatere kunstv

interface ArtistListProps {
  data: Artist[]; // Liste over artister som skal vises
  textSize: number; // Dynamisk tekststørrelse
}

export default function ArtistList({ data }: ArtistListProps) {
  const [artists, setArtists] = useState<Artist[]>(data); // Lokal state for kunstverk
  const [refreshing, setRefreshing] = useState(false); // Kontroll for oppdatering
  const router = useRouter(); // Router for navigasjon

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
      console.error("Feil ved henting av artists:", error); // Debugging
    } finally {
      setRefreshing(false); // Deaktiver oppdateringsindikatoren
    }
  };

  return (
    <FlatList
      data={artists} // Data for artistene
      keyExtractor={(item) => item.id} // Unik nøkkel for hver artist
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchArtists} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/artistDetails/${item.id}`)} // Naviger til detaljer
          style={{
            backgroundColor: "white",
            marginVertical: 16,
          }}
        >
          <ArtistCard
            artist={item} // Sender artistdata til ArtistCard
          />
        </TouchableOpacity>
      )}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingBottom: 16, // Justering for spacing
      }}
    />
  );
}
