import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  sortTitleAZ,
  sortTitleZA,
  sortNameAZ,
  sortNameZA,
} from "@/utils/functions/sort";

/**
 * Props for Sort-komponenten
 * @param filteredData - Listen over filtrerte kunstverk som skal sorteres
 * @param setFilteredData - Funksjon for å oppdatere den sorterte listen
 * @param style - Valgfri tilpasset stil for hovedkomponenten
 * @param sortTitle - En boolsk prop for å bestemme hvilken sortering som skal vises (true for Title, false for Name)
 */
type SortProps = {
  filteredData: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  style?: ViewStyle;
  sortTitle: boolean; // Determines whether to show title-based or name-based sorting
};

/**
 * Komponent for å håndtere sortering av kunstverk.
 * Gir brukeren mulighet til å sortere alfabetisk (A-Z) eller etter dato.
 */
const Sort = ({
  filteredData,
  setFilteredData,
  style,
  sortTitle,
}: SortProps) => {
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false); // Controls whether the sort options are visible

  /**
   * Toggles the visibility of the sort options
   */
  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  /**
   * Handles sorting based on the selected key (either title or name) and the order (asc or desc)
   * @param key - Key to sort by (title or name)
   * @param order - Sort order (asc or desc)
   */
  const handleSort = (key: string, order: string) => {
    let sortedData;
    console.log(`Sort by ${key} (${order}) - sortTitle is: ${sortTitle}`);

    // Perform sorting based on the 'key' (title or name) and 'order' (asc or desc)
    if (key === "displayName") {
      sortedData =
        order === "asc" ? sortNameAZ(filteredData) : sortNameZA(filteredData);
    } else {
      sortedData =
        order === "asc" ? sortTitleAZ(filteredData) : sortTitleZA(filteredData);
    }
    // Update the filtered data with the sorted result
    setFilteredData(sortedData);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Main button to toggle sort options */}
      <TouchableOpacity onPress={toggleSortOptions} style={styles.mainButton}>
        <MaterialCommunityIcons name="sort" size={24} color="black" />
      </TouchableOpacity>

      {/* Sort options visible when 'isSortOptionsVisible' is true */}
      {isSortOptionsVisible && (
        <View style={styles.optionsContainer}>
          {/* Show title sorting options if 'sortTitle' is true */}
          {sortTitle ? (
            <>
              <TouchableOpacity
                onPress={() => handleSort("title", "asc")}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>Title A-Z</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSort("title", "desc")}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>Title Z-A</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Show name sorting options if 'sortTitle' is false */}
              <TouchableOpacity
                onPress={() => handleSort("displayName", "asc")}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>Name A-Z</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSort("displayName", "desc")}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>Name Z-A</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
};

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
