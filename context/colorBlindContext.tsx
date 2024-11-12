import React, { createContext, useContext, useState, ReactNode } from "react";

type ColorBlindContextType = {
  isColorBlindFilterEnabled: boolean;
  toggleColorBlindFilter: () => void;
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

  return (
    <ColorBlindContext.Provider
      value={{ isColorBlindFilterEnabled, toggleColorBlindFilter }}
    >
      {children}
    </ColorBlindContext.Provider>
  );
};

export const useColorBlindFilter = () => {
  const context = useContext(ColorBlindContext);
  if (!context) {
    throw new Error(
      "useColorBlindFilter must be used within a ColorBlindProvider"
    );
  }
  return context;
};
