import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import UploadForm from "../../../components/menu/upload/UploadForm";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "../../../components/menu/Menu";
import Search from "../../../components/menu/Search"; // Import Search here
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useTextSize } from "@/hooks/useTextSize";
import { useColorBlindFilter } from "@/context/colorBlindContext";
import { sortAZ, sortDate } from "@/utils/functions/sort";

export default function GalleryScreen() {
  const { textSize, increaseTextSize } = useTextSize();
  const { isColorBlindFilterEnabled, toggleColorBlindFilter } =
    useColorBlindFilter();
  const [isFormVisible, setIsFormVisible] = useState(false);
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
    setFilteredData(allArtworks);
  };

  return (
    <View
      style={[
        styles.container,
        isColorBlindFilterEnabled && styles.colorBlindMode,
      ]}
    >
      <View style={styles.listContainer}>
        <ArtworkList data={filteredData} textSize={textSize} />
      </View>
      <Menu
        isVisible
        onUploadPress={() => setIsFormVisible(true)}
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
        onSearchPress={() => setIsSearchVisible(true)} // Toggle search visibility
      />
      <UploadForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
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
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
  },
  colorBlindMode: {
    backgroundColor: "#EFEFEF",
  },
});
