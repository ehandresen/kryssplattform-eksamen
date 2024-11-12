import React, { RefObject } from "react";
import { TextInput, StyleSheet, View } from "react-native";

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
    <View style={styles.container}>
      <TextInput
        ref={searchInputRef}
        style={styles.searchInput}
        placeholder="Search artworks..."
        value={searchQuery}
        onChangeText={onSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
