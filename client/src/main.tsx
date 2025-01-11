import { UserContextProvider } from '@/context/UserContext.tsx'
import { ThemeProvider } from '@/context/ThemeProvider.tsx'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <UserContextProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </UserContextProvider>
)
