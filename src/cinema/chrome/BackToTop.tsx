import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../motion'
import { scrollToId } from '../useSmoothScroll'
import { useCopy } from '../../i18n/lang'

/** Appears once the hero has scrolled past; uses the same cursor hooks as everything else. */
export function BackToTop() {
  const root = useRef<HTMLButtonElement>(null)
  const t = useCopy()

  useGSAP(() => {
    gsap.set(root.current, { autoAlpha: 0, y: 16 })
    const hero = document.querySelector('.hero')
    if (!hero) return

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',
      onEnter: () => gsap.to(root.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to(root.current, { autoAlpha: 0, y: 16, duration: 0.3, ease: 'power3.in' }),
    })
    return () => st.kill()
  })

  return (
    <button
      type="button"
      className="totop"
      ref={root}
      data-hover
      data-magnetic
      data-cursor-label={t.backToTop}
      aria-label={t.backToTop}
      onClick={() => scrollToId('#top')}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
