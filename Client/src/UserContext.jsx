import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({})

// eslint-disable-next-line react/prop-types
export function UserContextProvider ({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/profile')
      .then(response => {
        console.log(response.data)
        setUser(response.data)
      })
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
