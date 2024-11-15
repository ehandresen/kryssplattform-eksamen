import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "../../../components/menu/Menu";
import Search from "../../../components/menu/Search"; // Import Search here
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useTextSize } from "@/hooks/useTextSize";
import { useColorBlindFilter } from "@/hooks/useColorBlindFilter";
import { sortAZ, sortDate } from "@/utils/functions/sort";
import Upload from "../../../components/menu/Upload"; // Import the new Upload component

export default function GalleryScreen() {
  const { textSize, increaseTextSize } = useTextSize();
  const { currentColors, toggleColorBlindFilter } = useColorBlindFilter(); // Use currentColors here
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Manage search visibility here
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
    setFilteredData(allArtworks); // Reset to original artwork data
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.background }, // Use dynamic background color
      ]}
    >
      <View style={styles.listContainer}>
        <ArtworkList data={filteredData} textSize={textSize} />
      </View>
      <Menu
        isVisible
        onUploadPress={() => setIsSearchVisible(true)} // Trigger upload visibility
        onClearAll={handleClearAll} // Pass the function for clearing all data
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter} // Toggle color-blind filter
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
        onSearchPress={() => setIsSearchVisible(true)} // Toggle search visibility
      />

      {/* Render the Upload component */}
      <Upload
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      {/* Render the Search component separately */}
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
