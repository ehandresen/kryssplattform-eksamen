import { Tabs, usePathname } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import Header from "../../../components/header/Header";
import { View, StyleSheet, Text } from "react-native"; // Importerer Text

/**
 * TabsLayout er hovedlayouten som håndterer navigasjon mellom de tre skjermene:
 * Gallery, Artists og Exhibitions. Layouten inkluderer en tilpasset Header
 * og navigasjonsfaner med ikoner og tilpassede stiler. Den håndterer også dynamisk
 * oppsett av undertittelen basert på aktiv skjerm.
 */
const TabsLayout = () => {
  try {
    const pathname = usePathname(); // Henter nåværende sti i appen (f.eks. "/gallery")
    console.log("Aktiv sti:", pathname); // Debugging: Logg den aktive stien for å spore navigasjon

    // Sjekker hvilken skjerm som vises basert på stien
    const isGalleryScreen = pathname === "/gallery";
    const isArtistsScreen = pathname === "/artists";

    // Setter undertittel basert på hvilken skjerm som er aktiv
    const subtitle = isGalleryScreen
      ? "Gallery" // Undertittel for Gallery-skjermen
      : isArtistsScreen
      ? "Artists" // Undertittel for Artists-skjermen
      : "Exhibitions"; // Standard undertittel for Exhibitions-skjermen

    return (
      <View style={styles.container}>
        {/* Header-komponent som vises øverst i layouten */}
        <Header
          subtitle={subtitle} // Dynamisk undertittel basert på aktiv skjerm
          showLogoutButton={true} // Viser Logg ut-knappen på venstre side
          showProfileButton={true} // Viser Profil-knappen på høyre side
        />

        {/* Tab-navigasjon for å bytte mellom Gallery, Artists og Exhibitions */}
        <Tabs
          screenOptions={{
            tabBarStyle: styles.tabBarStyle, // Tilpasset stil for fanene
            tabBarLabelStyle: { fontSize: 14 }, // Skriftstørrelse for etikettene
            tabBarActiveTintColor: "red", // Farge for aktiv fane
            tabBarInactiveTintColor: "black", // Farge for inaktive faner
            headerShown: false, // Skjuler standard header fra navigasjonen
            tabBarHideOnKeyboard: true, // Skjuler fanene når tastaturet er aktivt
          }}
        >
          {/* Fane for Gallery-skjermen */}
          <Tabs.Screen
            name="gallery"
            options={{
              title: "Gallery", // Tittel for fanen
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="images" size={22} color={color} />
              ), // Ikon for fanen
            }}
          />
          {/* Fane for Artists-skjermen */}
          <Tabs.Screen
            name="artists"
            options={{
              title: "Artists", // Tittel for fanen
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="users" size={22} color={color} />
              ), // Ikon for fanen
            }}
          />
          {/* Fane for Exhibitions-skjermen */}
          <Tabs.Screen
            name="exhibitions"
            options={{
              title: "Exhibitions", // Tittel for fanen
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="landmark" size={22} color={color} />
              ), // Ikon for fanen
            }}
          />
        </Tabs>
      </View>
    );
  } catch (error) {
    // Feilhåndtering for TabsLayout
    if (error instanceof Error) {
      console.error("Feil i TabsLayout:", error.message);
    } else {
      console.error("Ukjent feil i TabsLayout:", error);
    }
    // Returnerer en fallback-komponent hvis noe går galt
    return (
      <View style={styles.container}>
        <Header
          subtitle="Error"
          showLogoutButton={false}
          showProfileButton={false}
        />
        <View>
          {/* Feilmelding til brukeren */}
          <Text style={styles.errorText}>
            Det oppstod en feil i navigasjonen. Prøv igjen senere.
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Gjør at layouten fyller hele skjermen
  },
  tabBarStyle: {
    height: 80, // Høyde på fanebaren
    position: "relative", // Sørger for at fanebaren er riktig plassert nederst
    paddingTop: 5, // Liten avstand over fanebaren
  },
  errorText: {
    color: "red", // Rød tekst for å indikere en feil
    fontSize: 16, // Størrelse på teksten
    textAlign: "center", // Sentrerer teksten
    marginTop: 20, // Avstand fra toppen
  },
});

export default TabsLayout;
