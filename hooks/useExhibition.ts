import { ExhibitionContext } from "@/context/exhibitionContext";
import { useContext } from "react";

export const useExhibition = () => {
  const context = useContext(ExhibitionContext);

  if (!context) {
    throw new Error("useExhibitions must be used within an ExhibitionProvider");
  }

  return context;
};
