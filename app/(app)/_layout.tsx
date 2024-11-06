import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname, Redirect } from "expo-router";
import React from "react";
import Header from "../../components/header/Header";
import { useAuth } from "@/hooks/useAuth";
import { View, StyleSheet } from "react-native";

export default function AppLayout() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth();
  const isProfileScreen = pathname === "/profile";

  /*
  if (!isLoading && !session && pathname !== "/login") {
    return <Redirect href="/login" />;
  }
  */

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isProfileScreen && (
          <Header
            subtitle="Profile"
            showReturnButton={true}
            showLogoutButton={true}
          />
        )}
        <Slot />
      </View>
    </SafeAreaView>
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
