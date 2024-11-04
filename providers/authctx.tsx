// providers/authctx.tsx

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "expo-router";
//import * as authApi from "@/api/authApi"; // Placeholder for future use

type AuthContextType = {
  signIn: (username: string, password: string) => void;
  signOut: VoidFunction;
  userNameSession?: string | null;
  isLoading: boolean;
  user: any | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: (username: string, password: string) => {},
  signOut: () => {},
  userNameSession: null,
  isLoading: false,
  user: null,
});

export function useAuthSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthSession must be used within an AuthContextProvider"
    );
  }
  return context;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Placeholder useEffect for real-time auth check (for future Firebase integration)
  /*
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserSession(user.displayName);
        setUser(user);
      } else {
        setUserSession(null);
        setUser(null);
      }
      router.replace("/");
      setIsLoading(false);
    });
  }, []);
  */

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username: string, password: string) => {
          console.log(`Simulating sign-in for ${username}`);
          // Future integration logic can go here
          // await authApi.signIn(username, password);
        },
        signOut: async () => {
          console.log("Simulating sign-out");
          // Future integration logic can go here
          // await authApi.signOut();
          setUserSession(null);
          setUser(null);
        },
        userNameSession: userSession,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
