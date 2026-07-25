import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger, prefersReduced } from './motion'

let lenis: Lenis | null = null

/** Anchor links + the loader need to talk to the scroller. */
export function getLenis() {
  return lenis
}

export function scrollToId(id: string) {
  const el = document.querySelector(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/** Mount once, at the app root. */
export function useSmoothScroll() {
  useEffect(() => {
    // Reduced motion: leave the browser's native scroll alone entirely.
    if (prefersReduced()) return

    const instance = new Lenis({ autoRaf: false, lerp: 0.1 })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Late-arriving webfonts shift every trigger's measurements.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}
