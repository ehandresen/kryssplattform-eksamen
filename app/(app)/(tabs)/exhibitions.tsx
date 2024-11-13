import { useExhibitions } from "@/hooks/useExhibitions";
import { Exhibition } from "@/types/exhibition";
import { Link, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

const ExhibitionScreen = () => {
  const { exhibitions, isLoading } = useExhibitions();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={exhibitions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No exhibitions available.</Text>}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="p-4 mb-3 bg-gray-100 rounded-lg shadow-sm">
            <Link
              href={{
                pathname: "/exhibitionDetails/[id]",
                params: { id: item.id },
              }}
            >
              <View>
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {item.title}
                </Text>
                <Text className="text-base text-gray-600">{item.location}</Text>
                <Text className="text-sm text-gray-500">
                  {item.startDate} - {item.endDate}
                </Text>
              </View>
            </Link>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default ExhibitionScreen;
