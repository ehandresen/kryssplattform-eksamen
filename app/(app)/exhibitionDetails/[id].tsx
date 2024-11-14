import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import { useExhibition } from "@/hooks/useExhibition";

const ExhibitionDetails = () => {
  const { id } = useLocalSearchParams();
  const [exhibition, setExhibition] = useState<Exhibition | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const { getExhibitionById } = useExhibition();

  useEffect(() => {
    fetchExhibition();
  }, [id]);

  const fetchExhibition = async () => {
    try {
      const fetchedExhibition = await getExhibitionById(id as string);
      setExhibition(fetchedExhibition);
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
      {/* <Text className="text-base text-gray-800">{exhibition.description}</Text> */}
    </View>
  );
};

export default ExhibitionDetails;
