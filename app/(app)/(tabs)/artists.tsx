/**
 * Håndterer visning av artister.
 */

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
  const [isLoading, setIsLoading] = useState(true);

  // Henter alle artister ved oppstart
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await getAllArtists();
        setAllArtists(artists);
        setFilteredData(artists);
      } catch (error) {
        console.error("Feil ved henting av artists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        {/* Laster-indikator som vises mens data hentes */}
        <ActivityIndicator size="large" color="#008080" />
        <Text className="mt-4 text-lg text-gray-600">Laster artister...</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      {/* Menykomponent for søk, filtrering og tilgjengelighetsalternativer */}
      <Menu
        sortTitle={false}
        onSortAZ={() => {}}
        onSortZA={() => {}}
        allData={allArtists}
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
        searchKey="displayName"
      />

      {/* Liste over artister med støtte for dynamisk tekststørrelse */}
      <ArtistList data={filteredData} textSize={textSize} />
    </View>
  );
}
