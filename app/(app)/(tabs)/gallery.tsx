import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "../../../components/menu/Menu";
import Search from "../../../components/menu/Search";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook
import { sortAZ, sortDate } from "@/utils/functions/sort";
import Upload from "../../../components/menu/Upload";

export default function GalleryScreen() {
  const { textSize, currentColors, toggleColorBlindFilter, increaseTextSize } =
    useAccessibility();
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Separate state for Search
  const [isUploadVisible, setIsUploadVisible] = useState(false); // Separate state for Upload
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artwork[]>([]);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      const artworks = await getAllArtworks();
      setAllArtworks(artworks);
      setFilteredData(artworks);
    };

    fetchArtworks();
  }, []);

  const handleSortAZ = () => setFilteredData(sortAZ(filteredData));
  const handleSortDate = () => setFilteredData(sortDate(filteredData));

  const handleClearAll = () => {
    setSelectedFilter(null);
    setFilteredData(allArtworks);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <View style={styles.listContainer}>
        <ArtworkList data={filteredData} textSize={textSize} />
      </View>
      <Menu
        isVisible
        onSearchPress={() => setIsSearchVisible(true)} // Trigger Search visibility
        onUploadPress={() => setIsUploadVisible(true)} // Trigger Upload visibility
        onClearAll={handleClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        allArtworks={allArtworks}
        setFilteredData={setFilteredData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={Array.from(
          new Set(
            allArtworks.map((artwork) => artwork.category).filter(Boolean)
          )
        )}
        onSortAZ={handleSortAZ}
        onSortDate={handleSortDate}
      />

      {/* Render the Upload component */}
      {isUploadVisible && (
        <Upload
          visible={isUploadVisible}
          onClose={() => setIsUploadVisible(false)}
        />
      )}

      {/* Render the Search component */}
      {isSearchVisible && (
        <Search
          allArtworks={allArtworks}
          setFilteredData={setFilteredData}
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});
