import { Slot } from "expo-router";
import AppProviders from "@/context/AppProviders"; // Import av konteksten som samler alle globale tilbydere
import "../global.css"; // Global stilimport
import { AccessibilityProvider } from "@/context/accessibilityContext"; // Import av tilgjengelighetskonteksten

/**
 * RootLayout er den øverste layout-komponenten for applikasjonen.
 * Den pakker alle andre komponenter i nødvendige kontekst-leverandører
 * og sørger for at alle deler av applikasjonen har tilgang til globale data.
 */
const RootLayout = () => {
  return (
    // AppProviders håndterer alle globale tilbydere som autentisering, tema osv.
    <AppProviders>
      {/* AccessibilityProvider håndterer tilgjengelighetsinnstillinger som farger og tekststørrelse */}
      <AccessibilityProvider>
        {/* Slot er en plassholder som blir fylt med innhold fra de gjeldende sidene */}
        <Slot />
      </AccessibilityProvider>
    </AppProviders>
  );
};

export default RootLayout;
