/**
 * Liste over exhibitions
 */

import { useExhibition } from "@/hooks/useExhibition";
import { Exhibition } from "@/types/exhibition";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

const ExhibitionScreen = () => {
  const { exhibitions, isLoading } = useExhibition();

  /**
   * Viser en indikator mens data lastes
   */
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg text-gray-700">
          Laster utstillinger...
        </Text>
      </View>
    );
  }

  /**
   * Viser melding hvis listen er tom
   */
  const renderEmptyList = () => (
    <Text className="text-center text-lg text-gray-400">
      Ingen utstillinger tilgjengelig.
    </Text>
  );

  /**
   * Viser en enkelt exhibition med lenke
   */
  const renderExhibition = ({ item }: { item: Exhibition }) => {
    return (
      <TouchableOpacity className="p-4 mb-3 bg-gray-100 rounded-lg shadow-md">
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
            <Text className="text-sm text-gray-600">{item.location}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {item.startDate} - {item.endDate}
            </Text>
          </View>
        </Link>
      </TouchableOpacity>
    );
  };

  /**
   * Viser liste over exhibitions
   */
  return (
    <FlatList
      data={exhibitions}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmptyList}
      renderItem={renderExhibition}
    />
  );
};

export default ExhibitionScreen;
