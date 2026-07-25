import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { gsap, ScrollTrigger } from './cinema/motion'
import { getLenis } from './cinema/useSmoothScroll'
import './styles/tokens.css'
import './styles/base.css'
import './styles/chrome.css'
import './styles/beats.css'

// Loader owns the scroll lock until the counter finishes.
document.body.dataset.locked = 'true'

// Dev-only bridge so scroll choreography can be driven and inspected from the console.
if (import.meta.env.DEV) {
  Object.assign(window, { __nw: { gsap, ScrollTrigger, getLenis } })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
