// components/SortBtn.tsx
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

type SortBtnProps = {
  onSortAZ: () => void;
  onSortDate: () => void;
  style?: ViewStyle;
};

const SortBtn = ({ onSortAZ, onSortDate, style }: SortBtnProps) => {
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={toggleSortOptions} style={styles.mainButton}>
        <MaterialCommunityIcons name="sort" size={24} color="black" />
      </TouchableOpacity>

      {isSortOptionsVisible && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={onSortAZ} style={styles.optionButton}>
            <Text style={styles.optionText}>A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSortDate} style={styles.optionButton}>
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
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionsContainer: {
    position: "absolute",
    left: -100, // Adjust this to control positioning of the options
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

export default SortBtn;
