// components/menu/Menu.tsx

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import Clear from "./Clear"; // Knapp for å tilbakestille alle filtre
import Accessibility from "./Accessibility"; // Komponent for tilgjengelighetsalternativer
import Filter from "./Filter"; // Modal for filtreringsvalg
import Sort from "./Sort"; // Komponent for sorteringsfunksjonalitet

/**
 * Props for `Menu`-komponenten
 * @param onClearAll - Funksjon for å tilbakestille alle filtre
 * @param onIncreaseTextSize - Funksjon for å øke tekststørrelsen
 * @param onEnableColorBlindFilter - Funksjon for å aktivere fargeblindfilter
 * @param onSearchPress - Funksjon for å aktivere søk
 * @param onUploadPress - Funksjon for å åpne opplastingsmodal
 * @param isVisible - Bestemmer om menyen skal være synlig
 * @param allArtworks - Liste over alle kunstverk
 * @param setFilteredData - Funksjon for å oppdatere filtrert data
 * @param selectedFilter - Gjeldende valgt filter
 * @param setSelectedFilter - Funksjon for å oppdatere valgt filter
 * @param hashtags - Liste over tilgjengelige filtre/hashtags
 * @param onSortAZ - Funksjon for å sortere alfabetisk (A-Z)
 * @param onSortDate - Funksjon for å sortere etter dato
 */
type MenuProps = {
  onClearAll: () => void;
  onIncreaseTextSize: () => void;
  onEnableColorBlindFilter: () => void;
  onSearchPress: () => void;
  onUploadPress: () => void;
  isVisible: boolean;
  allArtworks: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  hashtags: string[];
  onSortAZ: () => void;
  onSortDate: () => void;
};

/**
 * `Menu`-komponent som gir tilgang til søk, filter, sortering og tilgjengelighetsalternativer.
 * @param props Inneholder funksjoner og tilstand for menyens funksjonalitet.
 */
export default function Menu({
  onClearAll,
  onIncreaseTextSize,
  onEnableColorBlindFilter,
  onSearchPress,
  onUploadPress,
  isVisible,
  allArtworks,
  setFilteredData,
  selectedFilter,
  setSelectedFilter,
  hashtags,
  onSortAZ,
  onSortDate,
}: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Tilstand for menyens synlighet
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Tilstand for filtermodal

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Bytt menyens synlighet
  const onFilterPress = () => setIsFilterVisible(true); // Åpne filtermodal
  const closeFilter = () => setIsFilterVisible(false); // Lukk filtermodal

  if (!isVisible) return null; // Skjul menyen hvis `isVisible` er `false`

  return (
    <View style={styles.container}>
      {/* Hovedmeny-knapp */}
      <TouchableOpacity
        onPress={toggleMenu}
        activeOpacity={0.7}
        style={styles.menuButton}
      >
        <View
          style={[
            styles.iconButton,
            { backgroundColor: isMenuOpen ? "#ff4d4d" : "#e0b3b3" },
          ]}
        >
          {isMenuOpen ? (
            <AntDesign name="close" size={24} color="white" />
          ) : (
            <Entypo name="menu" size={24} color="black" />
          )}
        </View>
      </TouchableOpacity>

      {/* Menyinnhold */}
      {isMenuOpen && (
        <>
          <Clear onClearAll={onClearAll} style={styles.clearAllButton} />
          <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <AntDesign name="filter" size={24} color="black" />
          </TouchableOpacity>
          <Sort
            filteredData={allArtworks}
            setFilteredData={setFilteredData}
            style={styles.sortButton}
          />
          <Accessibility
            onIncreaseTextSize={onIncreaseTextSize}
            onEnableColorBlindFilter={onEnableColorBlindFilter}
            style={styles.accessibilityButton}
            isTextSizeIncreased={false}
          />
          <TouchableOpacity onPress={onUploadPress} style={styles.uploadButton}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
          {/* Sortering-knapper */}
          <TouchableOpacity onPress={onSortAZ} style={styles.sortButton}>
            <FontAwesome name="sort-alpha-desc" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSortDate} style={styles.sortButton}>
            <AntDesign name="calendar" size={24} color="black" />
          </TouchableOpacity>
        </>
      )}

      {/* Filtermodal */}
      <Filter
        visible={isFilterVisible}
        onClose={closeFilter}
        allArtworks={allArtworks}
        setFilteredData={setFilteredData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={hashtags}
      />
    </View>
  );
}

// Stiler for komponenten
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
  },
  menuButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  clearAllButton: {
    position: "absolute",
    bottom: 40,
    right: 80,
    backgroundColor: "#e0b3b3",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    position: "absolute",
    bottom: 80,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    position: "absolute",
    bottom: 150,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButton: {
    position: "absolute",
    bottom: 220,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  accessibilityButton: {
    position: "absolute",
    bottom: 290,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    position: "absolute",
    bottom: 360,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
