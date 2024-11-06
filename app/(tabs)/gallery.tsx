// GalleryScreen with ClearAllBtn functionality
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Keyboard, TextInput } from "react-native";
import UploadForm from "../../components/gallery/menu/upload/UploadForm";
import ArtworkList from "../../components/gallery/ArtworkList";
import SearchBar from "../../components/gallery/menu/search/SearchBar";
import MenuBtn from "../../components/gallery/menu/MenuBtn";
import FilterList from "../../components/gallery/menu/filter/FilterList";
import { artworkData } from "../../utils/dummyArtworkData";

export default function GalleryScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(artworkData);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Extract unique hashtags from artworkData
  const uniqueHashtags = Array.from(
    new Set(artworkData.flatMap((artwork) => artwork.hashtags))
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
        setIsSearchVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  const toggleSearch = () => {
    if (!isSearchVisible) {
      setIsSearchVisible(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setIsSearchVisible(false);
      Keyboard.dismiss();
    }
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterData(query, selectedFilter);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterVisible(false);
    filterData(searchQuery, filter);
  };

  const filterData = (query: string, filter: string | null) => {
    const filtered = artworkData.filter(
      (artwork) =>
        (artwork.title.toLowerCase().includes(query.toLowerCase()) ||
          artwork.artist.toLowerCase().includes(query.toLowerCase()) ||
          artwork.description.toLowerCase().includes(query.toLowerCase())) &&
        (filter ? artwork.hashtags.includes(filter) : true)
    );
    setFilteredData(filtered);
  };

  // Clear all search, filters, and sorting
  const clearAll = () => {
    setSearchQuery("");
    setSelectedFilter(null);
    setFilteredData(artworkData); // Reset to original data
    setIsSearchVisible(false);
    setIsFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <ArtworkList data={filteredData} />
      <MenuBtn
        isVisible={!isKeyboardVisible}
        onUploadPress={openForm}
        onSearchPress={toggleSearch}
        onFilterPress={toggleFilter}
        onSortPress={() => console.log("Sort options here")}
        onClearAll={clearAll} // Pass clearAll as a prop
      />

      {isSearchVisible && (
        <SearchBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          searchInputRef={searchInputRef}
        />
      )}

      <FilterList
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onSelect={handleFilterSelect}
        hashtags={uniqueHashtags}
      />

      <UploadForm
        visible={isFormVisible}
        onClose={closeForm}
        onSubmit={() => {
          console.log("Uploading artwork...");
          closeForm();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
