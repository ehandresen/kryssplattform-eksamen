import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Keyboard, TextInput } from "react-native";
import UploadForm from "../../../components/menu/upload/UploadForm";
import ArtworkList from "../../../components/ArtworkList";
import SearchBar from "../../../components/menu/search/SearchBar";
import MenuBtn from "../../../components/menu/MenuBtn";
import FilterList from "../../../components/menu/filter/FilterList";
import ClearAllBtn from "../../../components/menu/ClearAllBtn";
import SearchBtn from "../../../components/menu/SearchBtn"; // Import SearchBtn
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useTextSize } from "@/hooks/useTextSize";
import { useColorBlindFilter } from "@/context/colorBlindContext";

export default function GalleryScreen() {
  const { textSize, increaseTextSize, resetTextSize } = useTextSize();
  const { isColorBlindFilterEnabled, toggleColorBlindFilter } =
    useColorBlindFilter();
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
      setFilteredData(artworks); // Set initial filtered data to all artworks
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
    setFilteredData(allArtworks); // Reset filtered data to show all artworks
    resetTextSize();
    setSelectedFilter(null); // Clear selected filter
    console.log("Cleared filter, showing all artworks"); // Debug log
  };

  const filterData = (query: string, filter: string | null) => {
    const filtered = allArtworks.filter((artwork) => {
      const matchesQuery = query
        ? artwork.title?.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesFilter = filter ? artwork.category === filter : true;
      return matchesQuery && matchesFilter;
    });
    setFilteredData(filtered);
    console.log("Filtered data updated:", filtered); // Debug log
  };

  // Run filterData every time selectedFilter or searchQuery changes
  useEffect(() => {
    filterData(searchQuery, selectedFilter);
  }, [selectedFilter, searchQuery]);

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
    console.log("Sorted data:", sorted); // Debug log
  };

  const onSearchPress = () => {
    setIsSearchVisible(true);
    searchInputRef.current?.focus(); // Automatically focus the TextInput when search is pressed
  };

  return (
    <View
      style={[
        styles.container,
        isColorBlindFilterEnabled && styles.colorBlindMode,
      ]}
    >
      <ArtworkList data={filteredData} textSize={textSize} />
      <MenuBtn
        isVisible={!isKeyboardVisible}
        onUploadPress={openForm}
        onSearchPress={onSearchPress} // Call onSearchPress to open search bar and focus input
        onFilterPress={() => setIsFilterVisible(!isFilterVisible)}
        onSortAZ={() => sortData("A-Z")}
        onSortDate={() => sortData("Date")}
        onClearAll={onClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
      />
      <ClearAllBtn onPress={onClearAll} style={{ bottom: 0, left: -110 }} />
      {isSearchVisible && (
        <SearchBar
          searchQuery={searchQuery}
          onSearch={(query) => {
            setSearchQuery(query);
            console.log("Search query updated:", query); // Debug log
          }}
          searchInputRef={searchInputRef} // Pass the input ref to SearchBar
          textSize={textSize}
        />
      )}
      <FilterList
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onSelect={(filter) => {
          setSelectedFilter(filter); // Update selected filter
          setIsFilterVisible(false);
          console.log("Selected filter:", filter); // Debug log
          filterData(searchQuery, filter); // Ensure immediate update
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
    backgroundColor: "#EFEFEF",
  },
});
