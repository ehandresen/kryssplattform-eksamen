import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

type AccessibilityProps = {
  onIncreaseTextSize: () => void;
  onEnableColorBlindFilter: () => void;
  style?: ViewStyle;
};

/**
 * Accessibility-komponent:
 * - Gir brukeren muligheten til å aktivere tekststørrelse og fargeblindfilter.
 * - Viser knapp for tilgjengelighet som åpner et sett med alternativer.
 */
const Accessibility = ({
  onIncreaseTextSize,
  onEnableColorBlindFilter,
  style,
}: AccessibilityProps) => {
  const [isAccessibilityOptionsVisible, setIsAccessibilityOptionsVisible] =
    useState(false);

  // Funksjon for å veksle synlighet for tilgjengelighetsalternativer.
  const toggleAccessibilityOptions = () => {
    setIsAccessibilityOptionsVisible(!isAccessibilityOptionsVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Hovedknapp for å åpne/stenge tilgjengelighetsalternativer */}
      <TouchableOpacity
        onPress={toggleAccessibilityOptions}
        style={styles.mainButton}
      >
        <MaterialCommunityIcons name="human" size={24} color="black" />
      </TouchableOpacity>

      {/* Synlige tilgjengelighetsalternativer */}
      {isAccessibilityOptionsVisible && (
        <View style={styles.optionsContainer}>
          {/* Knapp for å øke eller tilbakestille tekststørrelsen */}
          <TouchableOpacity
            onPress={() => {
              console.log("Button for adjusting text size");
              onIncreaseTextSize();
            }}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Increase Text</Text>
          </TouchableOpacity>

          {/* Knapp for å aktivere fargeblindfilter */}
          <TouchableOpacity
            onPress={() => {
              console.log("Button for activating colorblind colors");
              onEnableColorBlindFilter();
            }}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Colorblind</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Stiler for komponenten.
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
    left: -125,
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
