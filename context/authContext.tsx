import { createContext, ReactNode, useContext, useState } from 'react';
import * as authApi from '@/api/authApi';

type AuthContextType = {
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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
