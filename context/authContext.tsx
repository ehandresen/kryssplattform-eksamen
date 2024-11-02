import { createContext, ReactNode, useContext, useState } from 'react';
import * as authApi from '@/api/authApi';

type AuthContextType = {
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an AuthContext Provider');
  }

  return value;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        signIn: (email, password) => authApi.signIn(email, password),
        signOut: () => authApi.signOut(),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
