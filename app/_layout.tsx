import { AuthProvider } from "@/context/authContext";
import { Slot } from "expo-router";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default RootLayout;
