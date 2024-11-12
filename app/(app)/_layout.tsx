import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname, Redirect, Stack } from "expo-router";
import React from "react";
import Header from "../../components/header/Header";
import { useAuth } from "@/hooks/useAuth";
import { View, StyleSheet } from "react-native";

export default function AppLayout() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth();
  const isProfileScreen = pathname === "/profile";

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="artworkDetails/[id]"
        options={{
          title: "Artwork Details",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
