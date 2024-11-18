import { AuthProvider } from "@/context/authContext";
import { ExhibitionProvider } from "./exhibitionContext";
import { ReactNode } from "react";
import { ArtworkProvider } from "./artworkContext";

// this file wraps all the providers
const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ExhibitionProvider>
        <ArtworkProvider>{children}</ArtworkProvider>
      </ExhibitionProvider>
    </AuthProvider>
  );
};

export default AppProviders;
