/**
 * Viser en liste over kunstverk med støtte for søk, filtrering og tilgjengelighetsalternativer.
 */

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "@/components/menu/Menu";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useArtwork } from "@/hooks/useArtwork";
import { Artwork } from "@/types/artwork";

export default function GalleryScreen() {
  const { textSize, currentColors, toggleColorBlindFilter, increaseTextSize } =
    useAccessibility();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artwork[]>([]);

  // Henter kunstverk fra context
  const { artworks, isLoading } = useArtwork();

  // Oppdaterer filtrert data når kunstverk endres
  useEffect(() => {
    setFilteredData(artworks);
  }, [artworks]);

  // Håndterer visning av opplastingsmodal
  const handleUploadPress = () => {
    setIsUploadVisible(!isUploadVisible);
  };

  // Viser laster-indikator mens data hentes
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg text-gray-700">Laster kunstverk...</Text>
      </View>
    );
  }

  // Viser hovedinnholdet med meny og kunstverkliste
  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      <Menu
        sortTitle={true}
        onSortAZ={() => {}}
        onSortZA={() => {}}
        allData={artworks}
        setFilteredData={setFilteredData}
        isSearchVisible={isSearchVisible}
        setIsSearchVisible={setIsSearchVisible}
        isUploadVisible={isUploadVisible}
        onUploadPress={handleUploadPress}
        setIsUploadVisible={setIsUploadVisible}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        isVisible={true}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        searchKey="title"
      />

      <ArtworkList data={filteredData} textSize={textSize} />
    </View>
  );
}
