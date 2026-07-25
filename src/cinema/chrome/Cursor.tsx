import { useRef } from 'react'
import { gsap, useGSAP, isTouch, prefersReduced } from '../motion'

const HOVERABLE = 'a, button, [data-hover]'

/**
 * The cursor field — one pointermove listener drives everything that reacts to
 * where you are on the page:
 *
 *   · dot + trailing ring, dot scales over anything interactive
 *   · [data-cursor-label="…"] turns the ring into a labelled pill
 *   · [data-magnetic] elements lean toward the cursor when it comes close
 *
 * Desktop pointers only — no touch, no reduced motion. Section-local effects
 * (the work-index spotlight, the tag proximity lift) live with their beats.
 */
const MAGNET_RADIUS = 110
const MAGNET_PULL = 0.34

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (isTouch() || prefersReduced()) return

    document.documentElement.dataset.cursor = 'custom'

    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.42, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.42, ease: 'power3' })

    /* ---------------- magnetic elements ---------------- */
    // Measured live rather than cached: pins, the loader and language switches
    // all move these after mount, and a stale centre makes the element jump as
    // you approach it. Only a couple of nodes carry [data-magnetic], so two
    // rect reads per pointermove is cheaper than keeping a cache honest.
    const magnets = gsap.utils.toArray<HTMLElement>('[data-magnetic]').map((el) => ({
      el,
      x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }),
      active: false,
    }))

    /* ---------------- pointer ---------------- */
    let shown = false
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)

      for (const m of magnets) {
        const r = m.el.getBoundingClientRect()
        // Subtract the pull already applied, or the element chases itself.
        const cx = r.left + r.width / 2 - (gsap.getProperty(m.el, 'x') as number)
        const cy = r.top + r.height / 2 - (gsap.getProperty(m.el, 'y') as number)
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const near = Math.hypot(dx, dy) < MAGNET_RADIUS
        if (near) {
          m.active = true
          m.x(dx * MAGNET_PULL)
          m.y(dy * MAGNET_PULL)
        } else if (m.active) {
          m.active = false
          m.x(0)
          m.y(0)
        }
      }
    }

    /* ---------------- hover + label states ---------------- */
    // Delegated so it covers nodes mounted later (language switches, etc).
    const onOver = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return
      const hit = e.target.closest(HOVERABLE)
      const labelled = e.target.closest<HTMLElement>('[data-cursor-label]')
      const text = labelled?.dataset.cursorLabel ?? ''

      if (label.current) label.current.textContent = text
      ring.current?.setAttribute('data-labelled', String(!!text))

      gsap.to(dot.current, {
        scale: text ? 0 : hit ? 3.4 : 1,
        duration: 0.32,
        ease: 'power3.out',
      })
      gsap.to(ring.current, {
        scale: text ? 1 : hit ? 1.5 : 1,
        opacity: text ? 1 : hit ? 0.25 : 0.6,
        duration: 0.32,
        ease: 'power3.out',
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      delete document.documentElement.dataset.cursor
    }
  })

  return (
    <>
      <div className="cursor cursor--ring" ref={ring} aria-hidden="true" data-labelled="false">
        <span className="cursor__label" ref={label} />
      </div>
      <div className="cursor cursor--dot" ref={dot} aria-hidden="true" />
    </>
  )
}
