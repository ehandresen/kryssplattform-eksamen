// components/menu/Sort.tsx

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { sortAZ, sortDate } from "@/utils/functions/sort";
import { Artwork } from "@/types/artwork";

/**
 * Props for Sort-komponenten
 * @param filteredData - Listen over filtrerte kunstverk som skal sorteres
 * @param setFilteredData - Funksjon for å oppdatere den sorterte listen
 * @param style - Valgfri tilpasset stil for hovedkomponenten
 */
type SortProps = {
  filteredData: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  style?: ViewStyle;
};

/**
 * Komponent for å håndtere sortering av kunstverk.
 * Gir brukeren mulighet til å sortere alfabetisk (A-Z) eller etter dato.
 */
const Sort = ({ filteredData, setFilteredData, style }: SortProps) => {
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false); // Styrer visningen av sorteringsalternativer

  /**
   * Veksler mellom å vise og skjule sorteringsalternativene
   */
  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  /**
   * Sorterer kunstverk alfabetisk (A-Z) og oppdaterer listen
   */
  const handleSortAZ = () => setFilteredData(sortAZ(filteredData));

  /**
   * Sorterer kunstverk etter dato og oppdaterer listen
   */
  const handleSortDate = () => setFilteredData(sortDate(filteredData));

  return (
    <View style={[styles.container, style]}>
      {/* Hovedknappen for å vise sorteringsalternativer */}
      <TouchableOpacity onPress={toggleSortOptions} style={styles.mainButton}>
        <MaterialCommunityIcons name="sort" size={24} color="black" />
      </TouchableOpacity>

      {/* Sorteringsalternativer (vises kun hvis `isSortOptionsVisible` er true) */}
      {isSortOptionsVisible && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={handleSortAZ} style={styles.optionButton}>
            <Text style={styles.optionText}>A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSortDate}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Date</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Stiler for komponenten
const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Sentrerer innholdet horisontalt
  },
  mainButton: {
    width: 60, // Bredde på hovedknappen
    height: 60, // Høyde på hovedknappen
    backgroundColor: "#e0b3b3", // Rosa bakgrunnsfarge
    borderRadius: 30, // Runde kanter
    alignItems: "center", // Sentrerer ikon horisontalt
    justifyContent: "center", // Sentrerer ikon vertikalt
    shadowColor: "#000", // Skjermfarge for skygge
    shadowOffset: { width: 0, height: 2 }, // Skyggeforskyvning
    shadowOpacity: 0.3, // Skyggegjenomsiktighet
    shadowRadius: 2, // Skyggeradius
    elevation: 5, // Skyggeeffekt på Android
  },
  optionsContainer: {
    position: "absolute", // Plasserer alternativene utenfor hovedknappen
    right: 70, // Plasserer alternativene til høyre
    alignItems: "center", // Sentrerer alternativene
  },
  optionButton: {
    width: 60, // Bredde på hver sorteringsknapp
    height: 40, // Høyde på hver sorteringsknapp
    backgroundColor: "#e0b3b3", // Samme rosa bakgrunn som hovedknappen
    borderRadius: 5, // Runde kanter
    alignItems: "center", // Sentrerer teksten horisontalt
    justifyContent: "center", // Sentrerer teksten vertikalt
    marginVertical: 5, // Vertikal avstand mellom knappene
  },
  optionText: {
    color: "black", // Tekstfarge
    fontSize: 12, // Størrelse på tekst
  },
});

export default Sort;
