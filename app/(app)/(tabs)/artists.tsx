import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
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
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const artistData = await getAllArtists();
      setAllArtists(artistData);
      setFilteredArtists(artistData);
    };

    fetchArtists();
  }, []);

  const handleSortAZ = () => {
    const sorted = [...filteredArtists].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
    setFilteredArtists(sorted);
  };

  const handleSearch = (query: string) => {
    const results = allArtists.filter(
      (artist) =>
        artist.displayName.toLowerCase().includes(query.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(query.toLowerCase()) // Include bio in search
    );
    setFilteredArtists(results);
  };

  const handleClearAll = () => {
    setSelectedFilter(null);
    setFilteredArtists(allArtists);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <View style={styles.listContainer}>
        <ArtistList artists={filteredArtists} textSize={textSize} />
      </View>
      <Menu
        isVisible
        onSearchPress={() => setIsSearchVisible(true)} // Trigger Search visibility
        onClearAll={handleClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        allArtworks={allArtists} // Pass artists as "allArtworks"
        setFilteredData={setFilteredArtists}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={Array.from(
          new Set(allArtists.map((artist) => artist.bio).filter(Boolean)) // Extract unique bio terms for filtering
        )}
        onSortAZ={handleSortAZ}
        onSortDate={() => {}} // Optional: Implement date sorting for artists if applicable
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
});
