import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "@/firebaseConfig";
import * as authApi from "@/api/authApi";
import { onAuthStateChanged, UserCredential } from "firebase/auth";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<UserCredential | void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Set session to a non-null value to simulate a logged-in state
  const [session, setSession] = useState<string | null>("bypassed-session");
  const [isLoading, setIsLoading] = useState(false); // Set isLoading to false by default

  // Comment out the useEffect that listens for authentication state changes
  /*
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        console.log("user:", user?.displayName);
        setSession(user ? user.displayName : null);
        setIsLoading(false);
      });
    }, []);
    */

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | void> => {
    try {
      setIsLoading(true); // Set loading before attempting sign-in
      const userCredential = await authApi.signIn(email, password);
      if (userCredential) {
        setSession(userCredential.user.email); // Update session with user email after sign-in
        return userCredential;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsLoading(false); // Set loading back to false after attempt
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: async () => {
          await authApi.signOut();
          setSession(null);
        },
        session,
        isLoading,
        setIsLoading: (value) => setIsLoading(value),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
