/**
 * ReturnBtn-komponent:
 * - Representerer en knapp som navigerer brukeren tilbake til forrige skjermbilde.
 */

import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const ReturnBtn = () => {
  const router = useRouter();

  /**
   * Håndterer trykk på tilbake-knappen:
   * - Navigerer brukeren tilbake til forrige skjermbilde i navigasjonsstakken.
   */
  const handlePress = () => {
    router.back();
  };

  return (
    <TouchableOpacity onPress={handlePress} className="p-2">
      {/* Bruker AntDesign for å vise en pil som symboliserer tilbake */}
      <AntDesign name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default ReturnBtn;
