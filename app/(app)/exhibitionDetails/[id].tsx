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

const ExhibitionDetails = () => {
  const [exhibition, setExhibition] = useState<Exhibition | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);

  const { id } = useLocalSearchParams();
  const { getExhibitionById } = useExhibition();
  const { artworks } = useArtwork();
  const router = useRouter();

  useEffect(() => {
    fetchExhibition();
  }, [id]);

  const fetchExhibition = async () => {
    try {
      const fetchedExhibition = await getExhibitionById(id as string);
      setExhibition(fetchedExhibition);

      const filteredArtworks = artworks.filter(
        (artwork) => artwork.exhibitionId === id
      );
      setRelatedArtworks(filteredArtworks);
    } catch (error) {
      console.log("Error fetching exhibition:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!exhibition) {
    return <Text>Exhibition not found.</Text>;
  }

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        {exhibition.title}
      </Text>
      <Text className="text-lg text-gray-600 mb-2">{exhibition.location}</Text>
      <Text className="text-base text-gray-500 mb-4">
        {exhibition.startDate} - {exhibition.endDate}
      </Text>

      {/* Display artworks */}
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
