// app/(app)/(tabs)/artDetails/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function ArtDetailsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: "Artwork Details" }} />
    </Stack>
  );
}
