/**
 * Header-komponent:
 * - Ansvarlig for å vise en toppseksjon som inneholder:
 *   - En valgfri knapp på venstre side (Return eller Log Out).
 *   - En tittel i midten.
 *   - En valgfri knapp på høyre side (Profil eller Log Out).
 */

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "./Title";
import ProfileBtn from "./ProfileBtn";
import ReturnBtn from "./ReturnBtn";
import LogOutBtn from "./LogOutBtn";

type HeaderProps = {
  subtitle: string;
  showProfileButton?: boolean;
  showReturnButton?: boolean;
  showLogoutButton?: boolean;
};

const Header = ({
  subtitle,
  showProfileButton = false,
  showReturnButton = false,
  showLogoutButton = false,
}: HeaderProps) => {
  if (!subtitle) {
    console.error("Feil: `subtitle` er påkrevd for Header-komponenten.");
    return null;
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
          <View className="w-10" />
        )}

        {/* Midten: Tittel */}
        <Title subtitle={subtitle} />

        {/* Høyre seksjon: Viser enten profil-knappen, logg ut-knappen, eller en tom plassholder */}
        {showProfileButton ? (
          <ProfileBtn />
        ) : showLogoutButton && showReturnButton ? (
          <LogOutBtn />
        ) : (
          <View className="w-10" />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;
