import React, { createContext, useContext, useState, ReactNode } from "react";
import { TextSize } from "../constants/textSize"; // Import the text sizes from constants/textSize.ts

type TextSizeContextType = {
  textSize: number;
  increaseTextSize: () => void;
  resetTextSize: () => void;
  isTextSizeIncreased: boolean;
};

const TextSizeContext = createContext<TextSizeContextType | undefined>(
  undefined
);

export const TextSizeProvider = ({ children }: { children: ReactNode }) => {
  const [textSize, setTextSize] = useState(TextSize.normal); // Default to normal text size
  const [isTextSizeIncreased, setIsTextSizeIncreased] = useState(false); // Boolean to track increased state

  const increaseTextSize = () => {
    if (!isTextSizeIncreased) {
      setTextSize(TextSize.increased); // Increase to the increased text size
      setIsTextSizeIncreased(true); // Set the state to indicate text size is increased
    } else {
      setTextSize(TextSize.normal); // Reset to the normal size
      setIsTextSizeIncreased(false); // Set the state to indicate text size is normal
    }
  };

  const resetTextSize = () => {
    setTextSize(TextSize.normal); // Reset to normal size
    setIsTextSizeIncreased(false); // Reset the increase state
  };

  return (
    <TextSizeContext.Provider
      value={{ textSize, increaseTextSize, resetTextSize, isTextSizeIncreased }}
    >
      {children}
    </TextSizeContext.Provider>
  );
};

export default TextSizeContext;
