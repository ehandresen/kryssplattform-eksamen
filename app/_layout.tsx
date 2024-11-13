import { Slot } from "expo-router";
import AppProviders from "@/context/AppProviders";
import "../global.css";
import { ColorBlindProvider } from "@/context/colorBlindContext";
import { TextSizeProvider } from "@/context/textSizeContext";

const RootLayout = () => {
  return (
    <AppProviders>
      <TextSizeProvider>
        <ColorBlindProvider>
          <Slot />
        </ColorBlindProvider>
      </TextSizeProvider>
    </AppProviders>
  );
};

export default RootLayout;
