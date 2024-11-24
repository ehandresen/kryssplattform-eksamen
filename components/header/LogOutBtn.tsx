/**
 * Håndterer trykk på logg ut-knappen:
 * - Logger brukeren ut av Firebase ved hjelp av signOut-funksjonen.
 * - Navigerer tilbake til hovedsiden.
 */

import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const LogOutBtn = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handlePress = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Feil ved utlogging:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="p-2 items-center bg-transparent"
    >
      <Text className="text-red-600 font-bold text-center text-lg">
        Log{"\n"}out
      </Text>
    </TouchableOpacity>
  );
};

export default LogOutBtn;
