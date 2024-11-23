/**
 * RootLayout er den øverste layout-komponenten for applikasjonen.
 * Den pakker alle andre komponenter i nødvendige kontekst-leverandører
 * og sørger for at alle deler av applikasjonen har tilgang til globale data.
 */

import { Slot } from "expo-router";
import AppProviders from "@/context/AppProviders";
import "../global.css";
import { AccessibilityProvider } from "@/context/accessibilityContext";
import Toast from "react-native-toast-message";

const RootLayout = () => {
  return (
    // AppProviders håndterer alle globale tilbydere som autentisering, tema osv.
    <AppProviders>
      {/* AccessibilityProvider håndterer tilgjengelighetsinnstillinger som farger og tekststørrelse */}
      <AccessibilityProvider>
        {/* Slot er en plassholder som blir fylt med innhold fra de gjeldende sidene */}
        <Slot />

        {/* Toast må legges til i root for å være tilgjennlig for bruk i andre komponenter */}
        <Toast />
      </AccessibilityProvider>
    </AppProviders>
  );
};

export default RootLayout;
