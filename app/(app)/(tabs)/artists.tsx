import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ArtistList from "../../../components/ArtistList";
import Menu from "../../../components/menu/Menu";
import { getAllArtists } from "@/api/artistApi";
import { Artist } from "@/types/artist";
import { useAccessibility } from "@/hooks/useAccessibility";

export default function ArtistsScreen() {
  const { textSize, currentColors, toggleColorBlindFilter, increaseTextSize } =
    useAccessibility();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artist[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await getAllArtists();
        setAllArtists(artists);
        setFilteredData(artists); // Standardvisning
      } catch (error) {
        console.error("Feil ved henting av artists:", error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      <Menu
        sortTitle={false}
        onSortAZ={() => {}}
        onSortZA={() => {}}
        allData={allArtists} // Generisk data
        setFilteredData={setFilteredData}
        isSearchVisible={isSearchVisible}
        setIsSearchVisible={setIsSearchVisible}
        isUploadVisible={false}
        onUploadPress={() => {}}
        setIsUploadVisible={() => {}}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        isVisible={true}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        searchKey="displayName" // Endret til displayName
      />

      <ArtistList data={filteredData} textSize={textSize} />
    </View>
  );
}
