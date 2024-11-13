import { AuthProvider } from "@/context/authContext";
import { ExhibitionProvider } from "./exhibitionContext";
import { ReactNode } from "react";

// this file wraps all the providers
const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ExhibitionProvider>{children}</ExhibitionProvider>
    </AuthProvider>
  );
};

export default AppProviders;
