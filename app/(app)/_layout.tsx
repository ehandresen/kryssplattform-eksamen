// app/(app)/_layout.tsx
import { AuthSessionProvider } from "@/providers/authctx";
import { Slot, usePathname } from "expo-router";
import React from "react";
import Header from "../../components/Header";

export default function AppLayout() {
  const pathname = usePathname();
  const isProfileScreen = pathname === "/profile";

  return (
    <AuthSessionProvider>
      {/* Header for Profile screen */}
      {isProfileScreen && (
        <Header
          subtitle="Profile"
          showReturnButton={true} // Show Return on the left
          showLogoutButton={true} // Show Log out on the right
        />
      )}
      <Slot />
    </AuthSessionProvider>
  );
}
