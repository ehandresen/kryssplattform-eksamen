import { AuthContext } from '@/context/authContext';
import { useContext } from 'react';

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an AuthContext Provider');
  }

  return value;
};
