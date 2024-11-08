import { AuthProvider } from "@/context/authContext";
import { Slot } from "expo-router";
import "../global.css";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default RootLayout;
