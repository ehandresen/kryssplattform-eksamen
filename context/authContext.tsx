import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '@/firebaseConfig';
import * as authApi from '@/api/authApi';
import { onAuthStateChanged, UserCredential } from 'firebase/auth';

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
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user:', user?.displayName);
      if (user) {
        setSession(user.displayName);
      } else {
        setSession(null);
      }

      setIsLoading(false);
    });
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
      console.error('Error during sign-in:', error);
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
