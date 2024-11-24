/**
 * ProfileBtn-komponent som representerer en knapp for å navigere til brukerens profilsiden.
 */

import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ProfileBtn = () => {
  const router = useRouter();

  /**
   * Håndterer trykk på profilikonet:
   * - Navigerer brukeren til profilsiden.
   */
  const handlePress = () => {
    router.push("/profile");
  };

  return (
    <TouchableOpacity onPress={handlePress} className="p-2">
      {/* Bruker FontAwesome5 for å vise et profilikon */}
      <FontAwesome5 name="user-circle" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default ProfileBtn;
