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
import { onAuthStateChanged, User, UserCredential } from "firebase/auth";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<UserCredential | void>;
  signOut: () => Promise<void>;
  session?: string | null;
  user: User | null;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user:", user?.displayName);
      setSession(user ? user.displayName : null); // Use user email for session
      setUser(user ? user : null);
      setIsLoading(false);
    });

    return unsubscribe; // Clean up on component unmount
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | void> => {
    try {
      const userCredential = await authApi.signIn(email, password);
      if (userCredential) {
        setSession(userCredential.user.email); // Update session with user email after sign-in
        return userCredential;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
      setSession(null); // Clear session on sign-out
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
