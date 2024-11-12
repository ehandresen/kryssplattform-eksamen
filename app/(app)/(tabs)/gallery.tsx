// screens/GalleryScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Keyboard, TextInput } from "react-native";
import UploadForm from "../../../components/menu/upload/UploadForm";
import ArtworkList from "../../../components/ArtworkList";
import SearchBar from "../../../components/menu/search/SearchBar";
import MenuBtn from "../../../components/menu/MenuBtn";
import FilterList from "../../../components/menu/filter/FilterList";
import ClearAllBtn from "../../../components/menu/ClearAllBtn";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useTextSize } from "@/hooks/useTextSize";
import { useColorBlindFilter } from "@/context/colorBlindContext"; // Updated import path and hook name

export default function GalleryScreen() {
  const { textSize, increaseTextSize, resetTextSize } = useTextSize();
  const { isColorBlindFilterEnabled, toggleColorBlindFilter } =
    useColorBlindFilter(); // Updated hook name
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artwork[]>([]);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
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

  const onClearAll = () => {
    setFilteredData(allArtworks);
    resetTextSize();
  };

  const sortData = (criteria: "A-Z" | "Date") => {
    const sorted = [...filteredData].sort((a, b) => {
      if (criteria === "A-Z") {
        const titleA = a.title || "";
        const titleB = b.title || "";
        return titleA.localeCompare(titleB);
      } else if (criteria === "Date") {
        const dateA = new Date(a.createdDate || "").getTime();
        const dateB = new Date(b.createdDate || "").getTime();
        return dateB - dateA;
      }
      return 0;
    });
    setFilteredData(sorted);
  };

  return (
    <View
      style={[
        styles.container,
        isColorBlindFilterEnabled && styles.colorBlindMode, // Apply colorblind mode style conditionally
      ]}
    >
      <ArtworkList data={filteredData} textSize={textSize} />
      <MenuBtn
        isVisible={!isKeyboardVisible}
        onUploadPress={openForm}
        onSearchPress={() => setIsSearchVisible(!isSearchVisible)}
        onFilterPress={() => setIsFilterVisible(!isFilterVisible)}
        onSortAZ={() => sortData("A-Z")}
        onSortDate={() => sortData("Date")}
        onClearAll={onClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter} // Toggle colorblind filter
      />
      <ClearAllBtn onPress={onClearAll} style={{ bottom: 0, left: -110 }} />
      {isSearchVisible && (
        <SearchBar
          searchQuery={searchQuery}
          onSearch={(query) => {
            setSearchQuery(query);
            filterData(query, selectedFilter);
          }}
          searchInputRef={searchInputRef}
          textSize={textSize}
        />
      )}
      <FilterList
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onSelect={(filter) => {
          setSelectedFilter(filter);
          setIsFilterVisible(false);
          filterData(searchQuery, filter);
        }}
        hashtags={Array.from(
          new Set(
            allArtworks.map((artwork) => artwork.category).filter(Boolean)
          )
        )}
      />
      <UploadForm visible={isFormVisible} onClose={closeForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  colorBlindMode: {
    backgroundColor: "#EFEFEF", // Adjust this color for colorblind accessibility
  },
});
