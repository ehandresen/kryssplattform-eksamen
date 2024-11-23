/**
 * Håndterer den overordnede strukturen for appen, inkludert navigasjon og
 * ruteautorisasjon. Sørger for at brukeren er autentisert før tilgang til innhold.
 */

import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname, Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth();

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
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Home",
          }}
        />
        <Stack.Screen
          name="artworkDetails/[id]"
          options={{
            title: "Artwork Details",
          }}
        />
        <Stack.Screen
          name="artistDetails/[id]"
          options={{
            title: "Artist Details",
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            title: "Map",
          }}
        />
        <Stack.Screen
          name="exhibitionDetails/[id]"
          options={{
            title: "Exhibition Details",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Profil",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
