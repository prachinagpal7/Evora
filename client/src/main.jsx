import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { clerkAppearance } from './clerkAppearance.js'

createRoot(document.getElementById('root')).render(
  <ClerkProvider appearance={clerkAppearance}  publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </ClerkProvider>
)
