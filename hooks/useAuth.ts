import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

// Custom hook to use AuthContext in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
