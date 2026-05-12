import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="981857007683-nl18mff22tbrmkj4m7f24nr4gu1ncasr.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton />
    </GoogleOAuthProvider>
  </StrictMode>,
)
