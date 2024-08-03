import axios from 'axios'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface UserContextType {
  username: string
  setUsername: (username: string) => void
  id: string
  setId: (id: string) => void
}

export const UserContext = createContext<UserContextType | null>(null)

export function UserContextProvider ({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>('')
  const [id, setId] = useState<string>('')

  useEffect(() => {
    axios.get('/profile')
      .then(res => {
        setUsername(res.data.username)
        setId(res.data.id)
      })
      .catch(err => console.error(err))
  }, [username])

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
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
