// components/menu/Search.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, StyleSheet, Keyboard } from "react-native";
import { Artwork } from "@/types/artwork";
import { filterArtworksByQuery } from "@/utils/functions/search";

interface SearchProps {
  allArtworks: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  isSearchVisible: boolean;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Search({
  allArtworks,
  setFilteredData,
  isSearchVisible,
  setIsSearchVisible,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Filter artworks based on the search query
    const filtered = searchQuery
      ? filterArtworksByQuery(allArtworks, searchQuery)
      : allArtworks;
    setFilteredData(filtered);
  }, [searchQuery, allArtworks, setFilteredData]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsSearchVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [setIsSearchVisible]);

  if (!isSearchVisible) return null;

  return (
    <View style={styles.container}>
      <TextInput
        ref={searchInputRef}
        style={styles.searchInput}
        placeholder="Search artworks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10, // Adjust margin as necessary to position above the keyboard
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
