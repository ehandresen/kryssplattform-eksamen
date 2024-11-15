// components/Accessibility.tsx
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

type AccessibilitnProps = {
  onIncreaseTextSize: () => void;
  onEnableColorBlindFilter: () => void;
  isTextSizeIncreased: boolean; // Track if the text size has been increased
  style?: ViewStyle;
};

const Accessibility = ({
  onIncreaseTextSize,
  onEnableColorBlindFilter,
  isTextSizeIncreased,
  style,
}: AccessibilitnProps) => {
  const [isAccessibilityOptionsVisible, setIsAccessibilityOptionsVisible] =
    useState(false);

  const toggleAccessibilityOptions = () => {
    setIsAccessibilityOptionsVisible(!isAccessibilityOptionsVisible);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={toggleAccessibilityOptions}
        style={styles.mainButton}
      >
        <MaterialCommunityIcons name="human" size={24} color="black" />
      </TouchableOpacity>

      {isAccessibilityOptionsVisible && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("Increase Text Size Button Pressed"); // Debug log
              onIncreaseTextSize();
            }}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>
              {isTextSizeIncreased ? "Reset Text Size" : "Increase Text Size"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onEnableColorBlindFilter}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Color Blind Filter</Text>
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
    left: -100,
    alignItems: "center",
  },
  optionButton: {
    width: 120,
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

export default Accessibility;
