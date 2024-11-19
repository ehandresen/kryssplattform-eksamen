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
  reloadUser: () => Promise<void>; // New function to refresh user data
  session?: string | null;
  user: User | null;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  role: "guest" | "authenticated";
  loginAsGuest: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<"guest" | "authenticated">("guest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user.email);
        setUser(user);
        setRole("authenticated");
      } else {
        setSession(null);
        setUser(null);
        setRole("guest");
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAsGuest = () => {
    console.log("role from auth:", role);
    setRole("guest");
    setSession("guest-session"); // dummy data for guest logg inn
    setUser(null);
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | void> => {
    try {
      const userCredential = await authApi.signIn(email, password);
      if (userCredential) {
        setSession(userCredential.user.email); // Update session with user email after sign-in
        setUser(userCredential.user); // Update user state after sign-in
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
      setUser(null); // Clear user on sign-out
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      setSession(auth.currentUser.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        reloadUser, // Pass reloadUser to context
        session,
        user,
        isLoading,
        setIsLoading,
        role,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
