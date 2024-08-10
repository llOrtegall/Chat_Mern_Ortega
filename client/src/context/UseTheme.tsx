import React, { createContext, useState, useEffect } from 'react'

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

  // Efecto para agregar o quitar la clase 'dark' del body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

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
