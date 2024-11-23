/**
 * Viser detaljer om en spesifikk artist og deres artworks.
 */

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getArtistById } from "@/api/artistApi";
import { getAllArtworks } from "@/api/artworkApi";
import ArtistCard from "@/components/ArtistCard";
import ArtworkList from "@/components/ArtworkList";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Artist } from "@/types/artist";
import { Artwork } from "@/types/artwork";
import { useAuth } from "@/hooks/useAuth";

export default function ArtistDetails() {
  const { id } = useLocalSearchParams();
  const { textSize, currentColors } = useAccessibility();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { role } = useAuth();

  /**
   * Henter informasjon om artisten og deres artworks.
   */
  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      try {
        const artistData = await getArtistById(id as string);
        if (!artistData) {
          setError("Fant ingen artist med gitt ID.");
          setLoading(false);
          return;
        }
        setArtist(artistData);

        const allArtworks = await getAllArtworks();
        const filteredArtworks = allArtworks.filter(
          (artwork) => artwork.artistId === id
        );
        setArtworks(filteredArtworks);
      } catch (error) {
        setError("En feil oppsto under henting av data.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndArtworks();
  }, [id]);

  /**
   * Viser en melding hvis brukeren ikke er logget inn.
   */
  if (role === "guest") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-600 text-center">
          Du må være logget inn for å se artist detaljer.
        </Text>
      </View>
    );
  }

  /**
   * Viser en lasteskjerm mens data hentes.
   */
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color={currentColors.secondary} />
        <Text className="mt-2 text-lg text-gray-700">Laster data...</Text>
      </View>
    );
  }

  /**
   * Viser en feilmelding hvis det oppstår en feil.
   */
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-600">{error}</Text>
      </View>
    );
  }

  /**
   * Viser en melding hvis artisten ikke finnes.
   */
  if (!artist) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-600">Fant ingen artist.</Text>
      </View>
    );
  }

  /**
   * Viser artistens detaljer og en liste over deres artwork.
   */
  return (
    <View className="flex-1 bg-white p-4">
      <ArtistCard artist={artist} />
      <View className="flex-1 mt-4">
        <Text
          className="text-lg font-bold text-primary mb-3"
          style={{ fontSize: textSize }}
        >
          Kunstverk av {artist.displayName}
        </Text>
        <ArtworkList
          data={artworks}
          textSize={textSize}
          disableRefresh={true}
        />
      </View>
    </View>
  );
}
