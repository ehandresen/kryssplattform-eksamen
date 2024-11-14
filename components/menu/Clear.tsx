import React from "react";
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from "react-native";

type ClearProps = {
  onClearAll: () => void;
  style?: ViewStyle;
};

const Clear = ({ onClearAll, style }: ClearProps) => {
  return (
    <TouchableOpacity onPress={onClearAll} style={[styles.button, style]}>
      <Text style={styles.buttonText}>Clear All</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    backgroundColor: "#e0b3b3",
    width: 100,
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
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Clear;
