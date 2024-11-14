// app/(app)/(tabs)/GalleryScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Keyboard, TextInput } from "react-native";
import UploadForm from "../../../components/menu/upload/UploadForm";
import ArtworkList from "../../../components/ArtworkList";
import SearchBar from "../../../components/menu/search/SearchBar";
import Menu from "../../../components/menu/Menu";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useTextSize } from "@/hooks/useTextSize";
import { useColorBlindFilter } from "@/context/colorBlindContext";
import { sortAZ, sortDate } from "@/utils/functions/sort";

export default function GalleryScreen() {
  const { textSize, increaseTextSize, resetTextSize } = useTextSize();
  const { isColorBlindFilterEnabled, toggleColorBlindFilter } =
    useColorBlindFilter();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artwork[]>([]);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      const artworks = await getAllArtworks();
      setAllArtworks(artworks);
      setFilteredData(artworks);
    };

    fetchArtworks();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsSearchVisible(false)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsSearchVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onSearchPress = () => {
    setIsSearchVisible(true);
    searchInputRef.current?.focus();
  };

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
        isVisible={!isSearchVisible}
        onUploadPress={() => setIsFormVisible(true)}
        onSearchPress={onSearchPress}
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
      {isSearchVisible && (
        <SearchBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchInputRef={searchInputRef}
          textSize={textSize}
        />
      )}
      <UploadForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1, // Allows ArtworkList to take up remaining space
  },
  colorBlindMode: {
    backgroundColor: "#EFEFEF",
  },
});
