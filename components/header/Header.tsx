// Header.tsx

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "./Title"; // Viser en sentrert tittel
import ProfileBtn from "./ProfileBtn"; // Knapp for å navigere til profil
import ReturnBtn from "./ReturnBtn"; // Knapp for å navigere tilbake
import LogOutBtn from "./LogOutBtn"; // Knapp for å logge ut

// Definerer hvilke data som sendes til Header-komponenten via props.
type HeaderProps = {
  subtitle: string; // Undertekst som vises midt i headeren
  showProfileButton?: boolean; // Valgfritt: Skal profil-knappen vises?
  showReturnButton?: boolean; // Valgfritt: Skal tilbake-knappen vises?
  showLogoutButton?: boolean; // Valgfritt: Skal logg ut-knappen vises?
};

/**
 * Header-komponent:
 * - Ansvarlig for å vise en toppseksjon som inneholder:
 *   - En valgfri knapp på venstre side (Return eller Log Out).
 *   - En tittel i midten.
 *   - En valgfri knapp på høyre side (Profil eller Log Out).
 */
const Header = ({
  subtitle, // Tekst som vises i midten av headeren
  showProfileButton = false, // Standardverdi er at profil-knappen ikke vises
  showReturnButton = false, // Standardverdi er at tilbake-knappen ikke vises
  showLogoutButton = false, // Standardverdi er at logg ut-knappen ikke vises
}: HeaderProps) => {
  // Debugging: Logger hvilke props som sendes til komponenten
  console.debug("Header props:", {
    subtitle,
    showProfileButton,
    showReturnButton,
    showLogoutButton,
  });

  // Feilhåndtering: Sikrer at `subtitle` alltid er definert.
  if (!subtitle) {
    console.error("Feil: `subtitle` er påkrevd for Header-komponenten.");
    return null; // Stopper rendering hvis `subtitle` mangler
  }

  return (
    <SafeAreaView edges={["top"]} className="bg-white">
      <View className="flex-row items-center justify-between px-4 bg-white border-b border-gray-300">
        {/* Venstre seksjon: Viser enten tilbake-knappen, logg ut-knappen, eller en tom plassholder */}
        {showReturnButton ? (
          <ReturnBtn />
        ) : showLogoutButton ? (
          <LogOutBtn />
        ) : (
          <View className="w-10" /> // Sørger for visuell balanse hvis ingen knapp vises
        )}

        {/* Midten: Tittel */}
        <Title subtitle={subtitle} />

        {/* Høyre seksjon: Viser enten profil-knappen, logg ut-knappen, eller en tom plassholder */}
        {showProfileButton ? (
          <ProfileBtn />
        ) : showLogoutButton && showReturnButton ? (
          <LogOutBtn />
        ) : (
          <View className="w-10" /> // Sørger for visuell balanse hvis ingen knapp vises
        )}
      </View>
    </SafeAreaView>
  );
};

// Eksporterer komponenten som standard
export default Header;
