// LogOutBtn.tsx

// Importerer nødvendige moduler og hooks for å håndtere brukerens logg-ut-funksjonalitet.
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
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
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text style={styles.logoutText}>
        Log{"\n"}out {/* Viser teksten med linjeskift for kompakt layout */}
      </Text>
    </TouchableOpacity>
  );
};

// Stiler for LogOutBtn-komponenten
const styles = StyleSheet.create({
  button: {
    padding: 5, // Gir litt plass rundt knappen
    alignItems: "center", // Sentrerer innholdet horisontalt
  },
  logoutText: {
    fontSize: 16, // Størrelse på teksten
    color: "red", // Rød farge for å indikere en viktig handling
    fontWeight: "bold", // Fet tekst for synlighet
    textAlign: "center", // Sentrerer teksten
  },
});

// Eksporterer komponenten som standard
export default LogOutBtn;
