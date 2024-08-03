import React, { createContext, useState } from 'react'

// Definir el tipo para el contexto
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

// Crear el contexto
export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {}
})

// Crear el proveedor del contexto
export const ThemeProvider = ({ children }: { children : React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false)

  // Función para cambiar el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
