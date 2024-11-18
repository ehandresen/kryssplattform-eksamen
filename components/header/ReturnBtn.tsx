// ReturnBtn.tsx

// Importerer nødvendige moduler for å lage en tilbake-knapp.
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Hook for navigasjon
import AntDesign from "@expo/vector-icons/AntDesign"; // Ikonbibliotek

/**
 * ReturnBtn-komponent:
 * - Representerer en knapp som navigerer brukeren tilbake til forrige skjermbilde.
 */
const ReturnBtn = () => {
  const router = useRouter(); // Henter navigasjonsfunksjonalitet fra Expo Router

  /**
   * Håndterer trykk på tilbake-knappen:
   * - Navigerer brukeren tilbake til forrige skjermbilde i navigasjonsstakken.
   */
  const handlePress = () => {
    router.back(); // Går ett steg tilbake i navigasjonsstakken
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      {/* Bruker AntDesign for å vise en pil som symboliserer tilbake */}
      <AntDesign name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
  );
};

// Stiler for ReturnBtn-komponenten
const styles = StyleSheet.create({
  button: {
    padding: 5, // Liten padding for å gjøre knappen enklere å trykke på
  },
});

// Eksporterer komponenten som standard
export default ReturnBtn;
