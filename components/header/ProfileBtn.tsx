// ProfileBtn.tsx

// Importerer nødvendige moduler og biblioteker for profilknappen.
import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Hook for navigasjon
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // Ikonbibliotek

/**
 * ProfileBtn-komponent som representerer en knapp for å navigere til brukerens profilsiden.
 */
const ProfileBtn = () => {
  const router = useRouter(); // Henter navigasjonsfunksjonalitet fra Expo Router

  /**
   * Håndterer trykk på profilikonet:
   * - Navigerer brukeren til profilsiden.
   */
  const handlePress = () => {
    router.push("/profile"); // Navigerer til profilsiden
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="p-2" // Tailwind klasse for padding
    >
      {/* Bruker FontAwesome5 for å vise et profilikon */}
      <FontAwesome5 name="user-circle" size={24} color="black" />
    </TouchableOpacity>
  );
};

// Eksporterer komponenten som standard
export default ProfileBtn;
