import { UserContextProvider } from './context/UserContext.tsx'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <UserContextProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </UserContextProvider>
)
