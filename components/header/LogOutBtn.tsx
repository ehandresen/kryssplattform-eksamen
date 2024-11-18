// LogOutBtn.tsx

// Importerer nødvendige moduler og hooks for å håndtere brukerens logg-ut-funksjonalitet.
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router"; // Hook for navigasjon
import { useAuth } from "@/hooks/useAuth"; // Hook for autentisering og konteksttilgang

/**
 * Komponent som representerer en knapp for å logge ut brukeren.
 * - Logger brukeren ut av Firebase.
 * - Navigerer brukeren til hovedskjermen etter utlogging.
 */
const LogOutBtn = () => {
  const router = useRouter(); // Tilgang til navigasjonsfunksjoner
  const { signOut } = useAuth(); // Henter signOut-metoden fra autentiseringskonteksten

  /**
   * Håndterer trykk på logg ut-knappen:
   * - Logger brukeren ut av Firebase ved hjelp av signOut-funksjonen.
   * - Navigerer tilbake til hovedsiden.
   */
  const handlePress = async () => {
    try {
      await signOut(); // Utfører utlogging
      router.push("/"); // Navigerer til hovedskjermen
    } catch (error) {
      console.error("Feil ved utlogging:", error); // Logger feil ved utlogging
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="p-2 items-center bg-transparent"
    >
      <Text className="text-red-600 font-bold text-center text-lg">
        Log{"\n"}out
      </Text>
    </TouchableOpacity>
  );
};

// Eksporterer komponenten som standard
export default LogOutBtn;
