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
