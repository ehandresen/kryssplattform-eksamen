import React, { createContext, useContext, useState, ReactNode } from "react";
import { Colors } from "../constants/colors"; // Import your color constants
import { TextSize } from "../constants/textSize"; // Import your text size constants

type AccessibilityContextType = {
  // Color Blind Filter
  isColorBlindFilterEnabled: boolean;
  toggleColorBlindFilter: () => void;
  currentColors: typeof Colors.normal | typeof Colors.colorBlind;

  // Text Size
  textSize: number;
  increaseTextSize: () => void;
  resetTextSize: () => void;
  isTextSizeIncreased: boolean;
};

export const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // State for color blind filter
  const [isColorBlindFilterEnabled, setIsColorBlindFilterEnabled] =
    useState(false);

  const toggleColorBlindFilter = () => {
    setIsColorBlindFilterEnabled((prev) => !prev);
  };

  const currentColors = isColorBlindFilterEnabled
    ? Colors.colorBlind
    : Colors.normal;

  // State for text size
  const [textSize, setTextSize] = useState(TextSize.normal);
  const [isTextSizeIncreased, setIsTextSizeIncreased] = useState(false);

  const increaseTextSize = () => {
    if (!isTextSizeIncreased) {
      setTextSize(TextSize.increased);
      setIsTextSizeIncreased(true);
    } else {
      setTextSize(TextSize.normal);
      setIsTextSizeIncreased(false);
    }
  };

  const resetTextSize = () => {
    setTextSize(TextSize.normal);
    setIsTextSizeIncreased(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isColorBlindFilterEnabled,
        toggleColorBlindFilter,
        currentColors,
        textSize,
        increaseTextSize,
        resetTextSize,
        isTextSizeIncreased,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;
