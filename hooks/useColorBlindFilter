import { useContext } from "react";
import { ColorBlindContext } from "../context/colorBlindContext"; // Adjust the path if necessary

export const useColorBlindFilter = () => {
  const context = useContext(ColorBlindContext);
  if (!context) {
    throw new Error(
      "useColorBlindFilter must be used within a ColorBlindProvider"
    );
  }
  return context;
};
