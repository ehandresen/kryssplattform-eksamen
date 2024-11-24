/**
 * Komponent for å håndtere sortering av kunstverk.
 * Gir brukeren mulighet til å sortere alfabetisk (A-Z) eller etter dato.
 */

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
 * @param filteredData
 * @param setFilteredData
 * @param style
 * @param sortTitle
 */
type SortProps = {
  filteredData: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  style?: ViewStyle;
  sortTitle: boolean;
};

const Sort = ({
  filteredData,
  setFilteredData,
  style,
  sortTitle,
}: SortProps) => {
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  /**
   * Toggles the visibility of the sort options
   */
  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  /**
   * Handles sorting based on the selected key (either title or name) and the order (asc or desc)
   * @param key
   * @param order
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
    alignItems: "center",
  },
  mainButton: {
    width: 60,
    height: 60,
    backgroundColor: "#e0b3b3",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  optionsContainer: {
    position: "absolute",
    right: 70,
    alignItems: "center",
  },
  optionButton: {
    width: 60,
    height: 40,
    backgroundColor: "#e0b3b3",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  optionText: {
    color: "black",
    fontSize: 12,
  },
});

export default Sort;
