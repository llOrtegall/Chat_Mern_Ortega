import { createContext, useState } from "react";

interface User {
  id: string
  username: string
  email: string
}

interface AuhtContextInt {
  user: User | null;
  login: () => void
  logout: () => void
  isAuth: boolean
}

export const AuthContext = createContext<AuhtContextInt | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const login = () => {
    // Lógica de login (ejemplo estático)
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com'
    };
    setUser(mockUser);
    setIsAuth(true);
  }

  const logout = () => {
    setUser(null);
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, user }} >
      {children}
    </AuthContext.Provider>
  )
}