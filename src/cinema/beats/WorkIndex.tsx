import { useRef } from 'react'
import { gsap, useGSAP, MQ, isTouch, type MotionConditions } from '../motion'
import { useCopy } from '../../i18n/lang'

/**
 * BEAT 4 — an index, not a card grid. Rows read like a table of contents; the
 * preview only exists where the cursor is, which is the point of the section.
 * Names/years aren't translated, so they live here; type/result come from copy
 * in the same order.
 */
const WORK_ROWS = [
  { name: 'Celo Restaurant', year: '2026', tint: 'var(--orange)' },
  { name: 'Sultan Grill House', year: '2026', tint: 'var(--mid-lift)' },
  { name: 'Akanlar Yapı', year: '2025', tint: 'var(--violet)' },
  { name: 'Saraykapı', year: '2026', tint: 'var(--orange)' },
]

/** Placeholder thumbnail — swap for a real screenshot per project. */
function Thumb({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      <rect width="320" height="200" rx="10" fill="var(--mid-deep)" />
      <rect x="0" y="0" width="320" height="26" rx="10" fill="var(--bg)" opacity="0.6" />
      <circle cx="18" cy="13" r="4" fill={tint} opacity="0.8" />
      <rect x="34" y="9" width="70" height="8" rx="4" fill="var(--text)" opacity="0.12" />
      <rect x="16" y="42" width="288" height="78" rx="8" fill={tint} opacity="0.28" />
      <rect x="30" y="66" width="104" height="12" rx="6" fill="var(--text)" opacity="0.5" />
      <rect x="30" y="86" width="64" height="8" rx="4" fill="var(--text)" opacity="0.25" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={16 + i * 100} y="134" width="88" height="48" rx="8" fill="var(--text)" opacity="0.08" />
      ))}
    </svg>
  )
}

export function WorkIndex() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
        const { full, reduced } = ctx.conditions as MotionConditions

        /* ---- entrance: rows arrive as masked lines ---- */
        gsap.from('.wk__head .line > span', {
          yPercent: 115,
          duration: reduced ? 0.4 : 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 76%', once: true },
        })
        gsap.from('.wk__row', {
          autoAlpha: 0,
          y: reduced ? 0 : 40,
          duration: reduced ? 0.4 : 0.9,
          ease: 'power3.out',
          stagger: reduced ? 0.05 : 0.11,
          scrollTrigger: { trigger: '.wk__list', start: 'top 82%', once: true },
        })

        /* ---- cursor-following preview (desktop pointers only) ---- */
        if (!full || isTouch()) return

        const px = gsap.quickTo(preview.current, 'x', { duration: 0.55, ease: 'power3' })
        const py = gsap.quickTo(preview.current, 'y', { duration: 0.55, ease: 'power3' })
        const rot = gsap.quickTo(preview.current, 'rotate', { duration: 0.7, ease: 'power3' })
        const rows = gsap.utils.toArray<HTMLElement>('.wk__row', root.current)
        const list = root.current!.querySelector<HTMLElement>('.wk__list')!

        let last = 0
        const onMove = (e: PointerEvent) => {
          px(e.clientX + 28)
          py(e.clientY - 110)
          // tilt with horizontal speed, so it feels like it's being dragged along
          const dx = e.clientX - last
          last = e.clientX
          rot(gsap.utils.clamp(-9, 9, dx * 0.5))

          // spotlight tracks the cursor inside whichever row it's over
          const row = (e.target as Element)?.closest?.('.wk__row') as HTMLElement | null
          if (row) {
            const r = row.getBoundingClientRect()
            row.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
          }
        }

        const show = (i: number) => {
          gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' })
          gsap.utils.toArray<HTMLElement>('.wk__thumb').forEach((th, j) => {
            gsap.to(th, { autoAlpha: i === j ? 1 : 0, duration: 0.28, ease: 'none' })
          })
        }
        const hide = () => gsap.to(preview.current, { autoAlpha: 0, scale: 0.9, duration: 0.3 })

        rows.forEach((row, i) => {
          row.addEventListener('pointerenter', () => show(i))
        })
        list.addEventListener('pointerleave', hide)
        list.addEventListener('pointermove', onMove)

        return () => {
          list.removeEventListener('pointerleave', hide)
          list.removeEventListener('pointermove', onMove)
        }
      })
    },
    { scope: root },
  )

  return (
    <section className="beat wk" ref={root}>
      <div className="shell">
        <div className="wk__head">
          <p className="eyebrow line">
            <span>{t.work.index}</span>
          </p>
          <h2 className="display wk__title">
            <span className="line">
              <span>{t.work.title}</span>
            </span>
          </h2>
        </div>

        <ul className="wk__list">
          {WORK_ROWS.map((row, i) => (
            <li className="wk__row" key={row.name}>
              <a href="#work" data-hover data-cursor-label={t.work.cursor}>
                <span className="wk__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="wk__name display">{row.name}</span>
                <span className="wk__type">{t.work.rows[i]?.type}</span>
                <span className="wk__result">{t.work.rows[i]?.result}</span>
                <span className="wk__year">{row.year}</span>
                <svg className="wk__arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H8M17 7v9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* floats with the cursor; never in the layout */}
      <div className="wk__preview" ref={preview} aria-hidden="true">
        {WORK_ROWS.map((row) => (
          <div className="wk__thumb" key={row.name}>
            <Thumb tint={row.tint} />
          </div>
        ))}
      </div>
    </section>
  )
}
