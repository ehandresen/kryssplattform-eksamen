// components/Search.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Artwork } from "@/types/artwork";
import { searchByKey } from "@/utils/functions/search"; // Import searchByKey function

/**
 * Props for Search-komponenten
 * @param allArtworks - Liste over alle kunstverk
 * @param setFilteredData - Funksjon for å oppdatere filtrerte data
 * @param isSearchVisible - Bestemmer om søkefeltet er synlig
 * @param setIsSearchVisible - Funksjon for å oppdatere synlighet av søkefeltet
 */
interface SearchProps {
  allArtworks: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  isSearchVisible: boolean;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Search-komponenten lar brukeren filtrere kunstverk basert på søkestrenger.
 * Søkeresultater oppdateres dynamisk.
 */
export default function Search({
  allArtworks,
  setFilteredData,
  isSearchVisible,
  setIsSearchVisible,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(""); // Tilstand for søketekst
  const searchInputRef = useRef<TextInput>(null); // Referanse til søkefeltet

  // Effekt som filtrerer kunstverk når søkestrengen endres
  useEffect(() => {
    // Bruk searchByKey for å filtrere basert på søkestrengen og ønsket nøkkel
    const filtered = searchQuery
      ? searchByKey(allArtworks, searchQuery, "title") // Du kan endre "title" til ønsket nøkkel
      : allArtworks;
    setFilteredData(filtered); // Oppdaterer listen med filtrerte data
  }, [searchQuery, allArtworks, setFilteredData]);

  // Effekt som skjuler søkefeltet når tastaturet lukkes
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsSearchVisible(false) // Set isSearchVisible to false when keyboard hides
    );

    return () => {
      keyboardDidHideListener.remove(); // Fjern lytteren ved demontering av komponenten
    };
  }, [setIsSearchVisible]);

  // Hvis isSearchVisible er false, returner null og skjul komponenten
  if (!isSearchVisible) return null;

  return (
    <View style={styles.searchContainer}>
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search by title"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true} // Automatically focus on input field when search is opened
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()} // Dismiss keyboard when submit
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
  },
});
