import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

// useAuth Hook for accessing AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
