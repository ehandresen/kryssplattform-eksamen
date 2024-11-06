import { Slot, usePathname, Redirect } from "expo-router";
import React from "react";
import Header from "../../components/header/Header";
import { useAuth } from "@/hooks/useAuth";
import { View } from "react-native";

export default function AppLayout() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth();
  const isProfileScreen = pathname === "/profile";

  return (
    <View>
      {isProfileScreen && (
        <Header
          subtitle="Profile"
          showReturnButton={true}
          showLogoutButton={true}
        />
      )}

      {!isLoading && !session && pathname !== "/login" ? (
        <Redirect href="/login" />
      ) : (
        <Slot />
      )}
    </View>
  );
}
