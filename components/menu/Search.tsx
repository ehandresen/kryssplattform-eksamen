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
import { filterArtworksByQuery } from "@/utils/functions/search";

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

  useEffect(() => {
    // Filtrer kunstverk basert på søkestrengen
    const filtered = searchQuery
      ? filterArtworksByQuery(allArtworks, searchQuery)
      : allArtworks;
    setFilteredData(filtered); // Oppdaterer listen med filtrerte data
  }, [searchQuery, allArtworks, setFilteredData]);

  useEffect(() => {
    // Skjul søkefeltet når tastaturet lukkes
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsSearchVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove(); // Fjern lytteren når komponenten demonteres
    };
  }, [setIsSearchVisible]);

  if (!isSearchVisible) return null; // Returner ingenting hvis søkefeltet ikke er synlig

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.overlay}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search artworks..." // Plassholdertekst i søkefeltet
            value={searchQuery}
            onChangeText={setSearchQuery} // Oppdater søketekst ved endring
            autoFocus // Åpne tastaturet automatisk når søkefeltet vises
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Stiler for komponenten
const styles = StyleSheet.create({
  container: {
    position: "absolute", // Plassering nederst på skjermen
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    zIndex: 10,
  },
  overlay: {
    width: "100%",
    padding: 10,
  },
  searchInput: {
    height: 40, // Høyde på søkefeltet
    borderColor: "#ccc", // Kantfarge
    borderWidth: 1, // Kantbredde
    borderRadius: 8, // Runde kanter
    paddingHorizontal: 10, // Innvendig padding horisontalt
    backgroundColor: "#fff", // Hvit bakgrunn
    width: "100%", // Fyll hele bredden
  },
});
