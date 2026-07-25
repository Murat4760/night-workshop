import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Three motion contexts, used by every beat via gsap.matchMedia().
 * - full     : desktop, pins + full-intensity parallax
 * - lite     : <768px, no pins on heavy sections, parallax at 40% (≈60% reduction)
 * - reduced  : prefers-reduced-motion, fades only
 */
export const MQ = {
  full: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  lite: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

export type MotionConditions = {
  full?: boolean
  lite?: boolean
  reduced?: boolean
}

/** Parallax intensity multiplier per context. Mobile is reduced by ~60%. */
export const INTENSITY = { full: 1, lite: 0.4 } as const

export const isTouch = () => !window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const prefersReduced = () => window.matchMedia(MQ.reduced).matches

export { gsap, ScrollTrigger, useGSAP }
