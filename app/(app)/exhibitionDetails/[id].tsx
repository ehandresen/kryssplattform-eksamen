/**
 * Viser detaljer om en exhibition, inkludert relaterte artwork.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import { useExhibition } from "@/hooks/useExhibition";
import { Artwork } from "@/types/artwork";
import { useArtwork } from "@/hooks/useArtwork";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const ExhibitionDetails = () => {
  // Henter exhibition ID fra URL-parametere
  const { id } = useLocalSearchParams();

  // State for å lagre exhibition-data og relaterte artwork
  const [exhibition, setExhibition] = useState<Exhibition | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);

  // Henter funksjoner og data fra hooks
  const { getExhibitionById } = useExhibition();
  const { artworks } = useArtwork();
  const router = useRouter();
  const { role } = useAuth();

  /**
   * useEffect kjører ved første lasting eller når ID endres.
   * - Henter exhibition-data og relaterte artwork.
   */
  useEffect(() => {
    fetchExhibition();
  }, [id]);

  /**
   * Henter exhibition-data fra databasen.
   * - Lagrer exhibition-informasjon og tilknyttede artwork i state.
   */
  const fetchExhibition = async () => {
    try {
      console.log("Henter exhibition med ID:", id); // Debugging

      // Hent data om exhibition
      const fetchedExhibition = await getExhibitionById(id as string);
      setExhibition(fetchedExhibition);

      // Filtrer artwork knyttet til denne exhibition
      const filteredArtworks = artworks.filter(
        (artwork) => artwork.exhibitionId === id
      );
      setRelatedArtworks(filteredArtworks);
    } catch (error) {
      console.error("Feil ved henting av exhibition:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Viser melding for gjestebrukere som ikke er logget inn.
   */
  if (role === "guest") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-600 text-center">
          Du må være logget inn for å se exhibition detaljer.
        </Text>
      </View>
    );
  }

  /**
   * Viser lasteskjerm mens data hentes.
   */
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg text-gray-700">
          Laster exhibition-data...
        </Text>
      </View>
    );
  }

  /**
   * Viser en feilmelding dersom exhibition ikke finnes.
   */
  if (!exhibition) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-600">Fant ingen exhibition.</Text>
      </View>
    );
  }

  /**
   * Returnerer UI-komponenter for exhibition-detaljer og tilhørende artwork.
   */
  return (
    <View className="flex-1 p-4 bg-white">
      {/* Viser exhibition-informasjon */}
      <Text className="text-2xl font-bold text-gray-800 mb-3">
        {exhibition.title}
      </Text>
      <Text className="text-xl text-gray-600 mb-2">{exhibition.location}</Text>
      <Text className="text-lg text-gray-500">
        {exhibition.startDate} - {exhibition.endDate}
      </Text>

      {/* Seksjon for relaterte artwork */}
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Related Artworks:
      </Text>
      {relatedArtworks.length > 0 ? (
        <FlatList
          data={relatedArtworks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/artworkDetails/${item.id}`)}
              className="bg-white shadow-md rounded-lg mb-4 p-4 hover:bg-gray-100 transition duration-150"
            >
              {/* Viser artworkets tittel og kunstner */}
              <Text className="text-lg font-bold text-gray-800">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Artist: {item.artistId}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No artworks available for this exhibition.</Text>
      )}
    </View>
  );
};

export default ExhibitionDetails;
