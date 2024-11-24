import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

// Definerer typer for komponentens props.
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
    useState(false); // State for å spore synligheten av tilgjengelighetsalternativene.

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
    alignItems: "center", // Sentraliserer innhold horisontalt.
  },
  mainButton: {
    width: 60,
    height: 60,
    backgroundColor: "#e0b3b3", // Lys bakgrunnsfarge for hovedknappen.
    borderRadius: 30, // Gjør knappen sirkulær.
    alignItems: "center", // Sentraliserer ikonet horisontalt.
    justifyContent: "center", // Sentraliserer ikonet vertikalt.
    shadowColor: "#000", // Legger til en skygge.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5, // For ekstra dybdeeffekt på Android.
  },
  optionsContainer: {
    position: "absolute", // Posisjonerer alternativene i forhold til hovedknappen.
    left: -125, // Flytter alternativene til venstre.
    alignItems: "center", // Sentraliserer knappene horisontalt.
  },
  optionButton: {
    width: 120, // Bredde på hver alternativ-knapp.
    height: 40, // Høyde på hver alternativ-knapp.
    backgroundColor: "#e0b3b3", // Lys bakgrunnsfarge for knappene.
    borderRadius: 5, // Runde kanter for knappene.
    alignItems: "center", // Sentraliserer tekst horisontalt.
    justifyContent: "center", // Sentraliserer tekst vertikalt.
    marginVertical: 5, // Avstand mellom knappene.
  },
  optionText: {
    color: "black", // Svart tekstfarge.
    fontSize: 12, // Tekststørrelse for alternativene.
  },
});

export default Accessibility;
