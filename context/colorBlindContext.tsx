import React, { createContext, useContext, useState, ReactNode } from "react";
import { Colors } from "../constants/colors"; // Import Colors from constants/colors.ts

type ColorBlindContextType = {
  isColorBlindFilterEnabled: boolean;
  toggleColorBlindFilter: () => void;
  currentColors: typeof Colors.normal | typeof Colors.colorBlind; // The colors based on the mode
};

export const ColorBlindContext = createContext<
  ColorBlindContextType | undefined
>(undefined);

export const ColorBlindProvider = ({ children }: { children: ReactNode }) => {
  const [isColorBlindFilterEnabled, setIsColorBlindFilterEnabled] =
    useState(false);

  const toggleColorBlindFilter = () => {
    setIsColorBlindFilterEnabled((prev) => !prev);
  };

  // Determine current color set based on the filter state
  const currentColors = isColorBlindFilterEnabled
    ? Colors.colorBlind
    : Colors.normal;

  return (
    <ColorBlindContext.Provider
      value={{
        isColorBlindFilterEnabled,
        toggleColorBlindFilter,
        currentColors,
      }}
    >
      {children}
    </ColorBlindContext.Provider>
  );
};

export default ColorBlindContext;
