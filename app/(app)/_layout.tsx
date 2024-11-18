import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname, Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * AppLayout håndterer den overordnede strukturen for appen, inkludert navigasjon og
 * ruteautorisasjon. Sørger for at brukeren er autentisert før tilgang til innhold.
 */
export default function AppLayout() {
  const pathname = usePathname(); // Henter gjeldende rute for debugging eller betinget logikk
  const { session, isLoading } = useAuth(); // Tilgang til autentisering og brukerdata

  /**
   * Hvis brukeren ikke er logget inn, omdirigeres de til påloggingssiden.
   */
  if (!session) {
    console.log("Ingen aktiv sesjon, omdirigerer til login."); // Debugging
    return <Redirect href="/login" />;
  }

  /**
   * Returnerer strukturen for appen med navigasjon og sideinnhold.
   */
  return (
    <SafeAreaView className="flex-1">
      <Stack>
        {/* Definerer de ulike skjermene og deres tilhørende innstillinger */}
        <Stack.Screen
          name="(tabs)" // Tab-navigasjon
          options={{
            headerShown: false, // Skjuler overskriften
            title: "Gallery", // Tittel på skjermen
          }}
        />
        <Stack.Screen
          name="artworkDetails/[id]" // Skjerm for detaljer om kunstverk
          options={{
            title: "Artwork Details", // Setter tittelen som vises i overskriften
          }}
        />
        <Stack.Screen
          name="map" // Kartskjerm
          options={{
            title: "Map", // Tittel for kartsiden
          }}
        />
        <Stack.Screen
          name="exhibitionDetails/[id]" // Skjerm for utstillingsdetaljer
          options={{
            title: "Exhibition Details", // Tittel for utstillingsdetaljer (kan tilpasses)
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
