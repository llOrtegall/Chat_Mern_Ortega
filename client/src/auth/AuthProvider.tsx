import { createContext, ReactNode, useContext, useState } from 'react';
import { type User } from '../types/interface';

interface AuthContextType {
  user: User | undefined;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null> (null);

export const AuthProvider = ({ children }:{ children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const login = (data:  User) => {
    setUser(data);
  };
  const logout = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}