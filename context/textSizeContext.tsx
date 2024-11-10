// contexts/textSizeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type TextSizeContextType = {
  textSize: number;
  increaseTextSize: () => void;
  resetTextSize: () => void;
};

const TextSizeContext = createContext<TextSizeContextType | undefined>(
  undefined
);

export const TextSizeProvider = ({ children }: { children: ReactNode }) => {
  const [textSize, setTextSize] = useState(16); // Default text size

  const increaseTextSize = () => {
    setTextSize((prevSize) => Math.min(prevSize + 2, 24)); // Increase by 2 up to a max of 24
  };

  const resetTextSize = () => {
    setTextSize(16); // Reset to default size
  };

  return (
    <TextSizeContext.Provider
      value={{ textSize, increaseTextSize, resetTextSize }}
    >
      {children}
    </TextSizeContext.Provider>
  );
};

export default TextSizeContext;
