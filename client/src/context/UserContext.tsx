import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Define la interfaz para el contexto
interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  id: string;
  setId: (id: string) => void;
}

// Crea el contexto con un valor por defecto
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const token = document.cookie.split('=')[1];

    if (!token) return;

    axios.get('/profile')
      .then(res => {
        setId(res.data.userId)
        setUsername(res.data.username)
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};