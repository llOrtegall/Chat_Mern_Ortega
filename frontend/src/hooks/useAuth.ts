import { AuthContext } from '../context/auth/AuthContext';
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('context provider not exist or no aply into app');
  }

  return context
}