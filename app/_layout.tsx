import { Slot } from "expo-router";
import AppProviders from "@/context/AppProviders";
import "../global.css";
import { AccessibilityProvider } from "@/context/accessibilityContext"; // Import the unified provider

const RootLayout = () => {
  return (
    <AppProviders>
      <AccessibilityProvider>
        <Slot />
      </AccessibilityProvider>
    </AppProviders>
  );
};

export default RootLayout;
