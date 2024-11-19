// Clear.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from "react-native";

/**
 * Typedefinisjon for komponentens props
 * @param onClearAll - Funksjon som trigges når brukeren trykker på knappen.
 * @param style - Valgfri egendefinert stil som kan overstyre standardstilen.
 */
type ClearProps = {
  onClearAll: () => void;
  style?: ViewStyle;
};

/**
 * Clear-komponent:
 * - En knapp som utfører en spesifisert "Clear All"-handling.
 * - Har fleksibilitet for egendefinerte stiler gjennom `style`-propen.
 */
const Clear = ({ onClearAll, style }: ClearProps) => {
  // Debugging: Logger når knappen trykkes
  const handlePress = () => {
    console.log("Clear All-knappen ble trykket");
    onClearAll();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>Clear All</Text>
    </TouchableOpacity>
  );
};

// Stiler for Clear-knappen
const styles = StyleSheet.create({
  button: {
    position: "absolute", // Absolutt posisjonering, egnet for flytende plassering i UI.
    right: 20, // Avstand fra høyre kant.
    backgroundColor: "#e0b3b3", // Lys bakgrunnsfarge.
    width: 100, // Bredde på knappen.
    height: 60, // Høyde på knappen.
    borderRadius: 30, // Runde hjørner for en moderne stil.
    alignItems: "center", // Sentraliserer tekst horisontalt.
    justifyContent: "center", // Sentraliserer tekst vertikalt.
    shadowColor: "#000", // Legger til en skyggeeffekt.
    shadowOffset: { width: 0, height: 2 }, // Skyggeposisjon.
    shadowOpacity: 0.3, // Skyggegjenomsiktighet.
    shadowRadius: 2, // Skyggens spredning.
    elevation: 5, // For dybdeeffekt på Android-enheter.
  },
  buttonText: {
    color: "black", // Tekstfarge.
    fontSize: 16, // Tekststørrelse.
    fontWeight: "bold", // Fet tekst for tydelighet.
  },
});

export default Clear;
