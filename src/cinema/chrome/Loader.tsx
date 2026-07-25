import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../motion'
import { useCopy } from '../../i18n/lang'

/**
 * Percentage counter. Runs to 92% on its own easing, then waits for the real
 * page-ready signal before finishing to 100 and wiping away.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const counter = { v: 0 }
      const paint = () => {
        if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        gsap.set(fill.current, { scaleX: counter.v / 100 })
      }
      paint()

      const pageReady = new Promise<void>((resolve) => {
        const done = () => resolve()
        if (document.readyState === 'complete') done()
        else window.addEventListener('load', done, { once: true })
      })

      const outro = () => {
        document.body.dataset.locked = 'false'
        ScrollTrigger.refresh()
        gsap
          .timeline({ onComplete: onDone })
          .to('.loader__row', { yPercent: -120, duration: 0.6, ease: 'power3.in', stagger: 0.06 })
          .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.25)
      }

      gsap.to(counter, {
        v: 92,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: paint,
        onComplete: () => {
          pageReady.then(() =>
            gsap.to(counter, {
              v: 100,
              duration: 0.45,
              ease: 'power2.inOut',
              onUpdate: paint,
              onComplete: outro,
            }),
          )
        },
      })
    },
    { scope: root },
  )

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__inner">
        <div className="loader__row">
          <span className="eyebrow">{t.loader.tag}</span>
        </div>
        <div className="loader__row loader__count display">
          <span ref={num}>000</span>
          <i>%</i>
        </div>
        <div className="loader__row loader__track">
          <span className="loader__fill" ref={fill} />
        </div>
      </div>
    </div>
  )
}
