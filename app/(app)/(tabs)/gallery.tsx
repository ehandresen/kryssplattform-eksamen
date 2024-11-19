import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "@/components/menu/Menu";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook

export default function GalleryScreen() {
  const { textSize, currentColors, toggleColorBlindFilter, increaseTextSize } =
    useAccessibility();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artwork[]>([]);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const artworks = await getAllArtworks();
        setAllArtworks(artworks);
        setFilteredData(artworks); // Standardvisning
      } catch (error) {
        console.error("Feil ved henting av kunstverk:", error);
      }
    };

    fetchArtworks();
  }, []);

  const handleUploadPress = () => {
    setIsUploadVisible(!isUploadVisible);
  };

  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      <Menu
        sortTitle={true}
        onSortAZ={() => {}}
        onSortZA={() => {}}
        allData={allArtworks}
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
