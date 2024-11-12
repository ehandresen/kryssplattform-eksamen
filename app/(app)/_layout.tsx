import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname, Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { StyleSheet } from "react-native";

export default function AppLayout() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
