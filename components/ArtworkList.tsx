/**
 * ArtworkList-komponent
 * Viser en liste over kunstverk i form av en FlatList.
 * Inkluderer støtte for oppdatering av data, "like"-funksjonalitet, og navigasjon til detaljerte kunstverkssider.
 */

import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "../types/artwork";
import { useRouter } from "expo-router"; // Navigasjon
import { useAuth } from "@/hooks/useAuth"; // Håndterer brukerens autentisering
import * as artworkApi from "@/api/artworkApi"; // API for å hente og oppdatere kunstverk

interface ArtworkListProps {
  data: Artwork[]; // Array av kunstverk som skal vises
  textSize: number; // Dynamisk tekststørrelse
}

export default function ArtworkList({ data }: ArtworkListProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(data); // Lokal state for kunstverk
  const [refreshing, setRefreshing] = useState(false); // Kontroll for oppdatering
  const router = useRouter(); // Router for navigasjon
  const { user } = useAuth(); // Henter autentisert bruker

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
    setRefreshing(true);
    try {
      const updatedArtworks = await artworkApi.getAllArtworks();
      setArtworks(updatedArtworks); // Oppdaterer lokal state
    } catch (error) {
      console.error("Feil ved henting av kunstverk:", error); // Debugging
    } finally {
      setRefreshing(false); // Deaktiver oppdateringsindikatoren
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
            ? artwork.likes.filter((uid) => uid !== user?.uid) // Fjern "like"
            : [...artwork.likes, user?.uid ?? ""]; // Legg til "like"

          return { ...artwork, likes: updatedLikes };
        }
        return artwork; // Returner uendret kunstverk
      })
    );

    // Oppdaterer databasen
    try {
      await artworkApi.updateArtworkLikes(id, user?.uid ?? "");
    } catch (error) {
      console.error("Feil ved oppdatering av likes:", error); // Debugging
    }
  };

  return (
    <FlatList
      data={artworks} // Data for kunstverk
      keyExtractor={(item) => item.id} // Unik nøkkel for hvert element
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchArtworks} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/artworkDetails/${item.id}`)} // Naviger til detaljer
          style={{
            backgroundColor: "white",
            marginVertical: 16,
          }}
        >
          <ArtworkCard
            artwork={item} // Sender kunstverket som prop til ArtworkCard
            isLiked={item.likes.includes(user?.uid ?? "")} // Sjekker om brukeren har likt
            numLikes={item.likes.length} // Viser antall likes
            toggleLike={() => handleToggleLike(item.id)} // Funksjon for å like/unlike
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
