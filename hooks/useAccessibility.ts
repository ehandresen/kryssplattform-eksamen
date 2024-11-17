import { useContext } from "react";
import { AccessibilityContext } from "../context/accessibilityContext"; // Adjust the path if necessary

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
