import { AuthProvider } from "@/context/authContext"; // Use the correct context provider
import { Slot, usePathname, Redirect } from "expo-router";
import React from "react";
import Header from "../../components/header/Header";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook for session access
import { View } from "react-native";

export default function AppLayout() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth(); // Get session and loading state from context
  const isProfileScreen = pathname === "/profile";

  return (
    <AuthProvider>
      {/* Render Header conditionally based on the current screen */}
      {isProfileScreen && (
        <Header
          subtitle="Profile"
          showReturnButton={true} // Show Return button on the left
          showLogoutButton={true} // Show Log out button on the right
        />
      )}

      {/* Protect routes based on authentication status */}
      {!session && pathname !== "/login" ? (
        <Redirect href="/login" /> // Redirect unauthenticated users to login
      ) : (
        <Slot /> // Render the main content if authenticated
      )}
    </AuthProvider>
  );
}
