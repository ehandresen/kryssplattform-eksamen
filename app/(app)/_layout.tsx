// app/(app)/_layout.tsx
import { AuthSessionProvider } from "@/providers/authctx";
import { Slot } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <AuthSessionProvider>
      <Slot />
    </AuthSessionProvider>
  );
}
