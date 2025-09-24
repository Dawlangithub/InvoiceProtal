// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
)

// Hide splash after initial mount tick
queueMicrotask(() => {
  const splash = document.getElementById('splash')
  if (splash) {
    splash.classList.add('app-splash--hidden')
    window.setTimeout(() => splash.remove(), 300)
  }
})
