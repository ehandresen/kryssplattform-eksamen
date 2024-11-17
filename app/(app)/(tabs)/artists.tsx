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
      try {
        const artistData = await getAllArtists();

        // Debugging: Log fetched artist data
        console.log("Fetched artists:", artistData);

        // Validate data structure
        if (Array.isArray(artistData)) {
          setAllArtists(artistData);
          setFilteredArtists(artistData);
        } else {
          console.error("Unexpected data format:", artistData);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
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
        artist.bio?.toLowerCase().includes(query.toLowerCase())
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
      {/* Artist List */}
      <View style={styles.listContainer}>
        <ArtistList artists={filteredArtists} textSize={textSize} />
      </View>

      {/* Menu */}
      <Menu
        isVisible={isSearchVisible}
        onSearchPress={() => setIsSearchVisible(true)}
        onClearAll={handleClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        allArtworks={allArtists} // Reuse for consistency
        setFilteredData={setFilteredArtists}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={Array.from(
          new Set(allArtists.map((artist) => artist.bio).filter(Boolean)) // Unique bios as hashtags
        )}
        onSortAZ={handleSortAZ}
        onSortDate={() => {}} // Placeholder for date sorting if needed
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
