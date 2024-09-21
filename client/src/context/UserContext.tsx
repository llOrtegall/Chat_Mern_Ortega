import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import axios from 'axios'

interface UserContextType {
  email: string
  setEmail: (email: string) => void
  id: string
  setId: (id: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

export const UserContext = createContext<UserContextType | null>(null)

export function UserContextProvider ({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    axios.get('/profile')
      .then(res => {
        setEmail(res.data.email)
        setId(res.data.id)
      })
      .catch(err => console.error(err))
  }, [isAuthenticated])

  return (
    <UserContext.Provider value={{ email, setEmail, id, setId, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider')
  }
  return context
}
