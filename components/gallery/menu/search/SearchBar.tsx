// components/SearchBar.tsx

import React, { RefObject } from "react";
import { TextInput, StyleSheet } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  searchInputRef: RefObject<TextInput>;
}

export default function SearchBar({
  searchQuery,
  onSearch,
  searchInputRef,
}: SearchBarProps) {
  return (
    <TextInput
      ref={searchInputRef}
      style={styles.searchInput}
      placeholder="Search artworks..."
      value={searchQuery}
      onChangeText={onSearch}
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 10,
  },
});
