// hooks/useTextSize.ts
import { useContext } from "react";
import TextSizeContext from "../context/textSizeContext"; // Adjust the path if necessary

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error("useTextSize must be used within a TextSizeProvider");
  }
  return context;
};
