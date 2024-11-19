import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

/**
 * Index er startsiden for applikasjonen.
 * Den viser en velkomstskjerm og omdirigerer brukeren til innloggingssiden etter 3 sekunder.
 */
export default function Index() {
  const router = useRouter(); // Henter router-funksjonen for navigasjon

  useEffect(() => {
    // Oppretter en timer som omdirigerer brukeren etter 3 sekunder
    const timer = setTimeout(() => {
      router.push("/login"); // Navigerer til innloggingssiden
    }, 3000);

    // Rydder opp timeren hvis komponenten avmonteres
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      {/* Viser velkomsttekst */}
      <Text className="text-4xl font-bold text-center text-teal-600">
        ArtVista
      </Text>
    </View>
  );
}
