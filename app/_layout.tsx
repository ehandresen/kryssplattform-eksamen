import { AuthProvider } from "@/context/authContext";
import { TextSizeProvider } from "@/context/textSizeContext"; // Import TextSizeProvider
import { Slot } from "expo-router";
import "../global.css";

const RootLayout = () => {
  return (
    <AuthProvider>
      <TextSizeProvider>
        {/* Wrap with TextSizeProvider */}
        <Slot />
      </TextSizeProvider>
    </AuthProvider>
  );
};

export default RootLayout;
