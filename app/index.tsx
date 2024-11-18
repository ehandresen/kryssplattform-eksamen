import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

/**
 * Index er startsiden for applikasjonen.
 * Den viser en velkomstskjerm og omdirigerer brukeren til innloggingssiden etter 3 sekunder.
 */
export default function Index() {
  const router = useRouter(); // Henter router-funksjonen for navigasjon

  useEffect(() => {
    // Oppretter en timer som omdirigerer brukeren etter 3 sekunder
    const timer = setTimeout(() => {
      router.push("/login"); // Navigerer til innloggingssiden
    }, 3000);

    // Rydder opp timeren hvis komponenten avmonteres
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Viser velkomsttekst */}
      <Text style={styles.welcomeText}>Velkommen til ArtVista</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fyller hele skjermen
    justifyContent: "center", // Sentraliserer innholdet vertikalt
    alignItems: "center", // Sentraliserer innholdet horisontalt
    padding: 16, // Marg rundt innholdet
    backgroundColor: "#fff", // Bakgrunnsfarge
  },
  welcomeText: {
    fontSize: 28, // Størrelsen på velkomstteksten
    fontWeight: "bold", // Fet tekst
    textAlign: "center", // Sentraliserer teksten
    color: "#1D6F6B", // Tekstfarge (tilpasset fargepalett)
  },
});
