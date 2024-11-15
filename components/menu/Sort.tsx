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

type SortProps = {
  filteredData: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  style?: ViewStyle;
};

const Sort = ({ filteredData, setFilteredData, style }: SortProps) => {
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  const handleSortAZ = () => setFilteredData(sortAZ(filteredData));
  const handleSortDate = () => setFilteredData(sortDate(filteredData));

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={toggleSortOptions} style={styles.mainButton}>
        <MaterialCommunityIcons name="sort" size={24} color="black" />
      </TouchableOpacity>

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
