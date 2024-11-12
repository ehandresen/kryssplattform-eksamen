// RootLayout.tsx
import { AuthProvider } from "@/context/authContext";
import { TextSizeProvider } from "@/context/textSizeContext";
import { ColorBlindProvider } from "@/context/colorBlindContext";
import { Slot } from "expo-router";
import "../global.css";

const RootLayout = () => {
  return (
    <AuthProvider>
      <TextSizeProvider>
        <ColorBlindProvider>
          <Slot />
        </ColorBlindProvider>
      </TextSizeProvider>
    </AuthProvider>
  );
};

export default RootLayout;
