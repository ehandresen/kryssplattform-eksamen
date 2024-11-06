// components/FilterBtn.tsx

import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type FilterBtnProps = {
  onPress: () => void;
  style?: ViewStyle;
};

const FilterBtn = ({ onPress, style }: FilterBtnProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <AntDesign name="filter" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    backgroundColor: "#e0b3b3",
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
});

export default FilterBtn;
