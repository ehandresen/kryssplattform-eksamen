import { ArtworkContext } from "@/context/artworkContext";
import { useContext } from "react";

export const useArtwork = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error("useArtworkContext must be used within an ArtworkProvider");
  }
  return context;
};
