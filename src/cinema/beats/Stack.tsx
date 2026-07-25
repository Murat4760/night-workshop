import { useRef } from 'react'
import { gsap, useGSAP, INTENSITY, MQ, isTouch, type MotionConditions } from '../motion'
import { useCopy } from '../../i18n/lang'

/** Placeholder marks — swap the coloured square for a real logo per tool. */
const ROW_A = ['Claude Code', 'Lovable', 'Next.js', 'React', 'TypeScript', 'Supabase']
const ROW_B = ['GSAP', 'Tailwind', 'Vercel', 'Figma', 'Postgres', 'Framer Motion']

function Tag({ label, i }: { label: string; i: number }) {
  return (
    <li className="tag" data-hover>
      <span className="tag__mark" data-mark={i % 3} />
      <span>{label}</span>
    </li>
  )
}

export function Stack() {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
        const { full, reduced } = ctx.conditions as MotionConditions
        const k = full ? INTENSITY.full : INTENSITY.lite

        const enter = {
          trigger: root.current,
          start: 'top 78%',
          once: true,
        } as const

        gsap.from('.stack__head .line > span', {
          yPercent: 115,
          duration: reduced ? 0.4 : 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: enter,
        })

        // Beat 2 entrance: fade + slide, staggered along each row.
        gsap.from('.stack__row--a .tag', {
          autoAlpha: 0,
          x: reduced ? 0 : 60,
          duration: reduced ? 0.4 : 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: enter,
        })
        gsap.from('.stack__row--b .tag', {
          autoAlpha: 0,
          x: reduced ? 0 : -60,
          duration: reduced ? 0.4 : 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { ...enter, start: 'top 68%' },
        })

        if (reduced) return

        // Horizontal drift while the section crosses the viewport (stays in flow).
        const drift = {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        } as const

        gsap.fromTo('.stack__row--a', { xPercent: -6 * k }, { xPercent: 6 * k, ease: 'none', scrollTrigger: drift })
        gsap.fromTo('.stack__row--b', { xPercent: 6 * k }, { xPercent: -6 * k, ease: 'none', scrollTrigger: drift })

        /* ---- tags lean away as the cursor passes through the row ---- */
        if (!full || isTouch()) return

        const RADIUS = 130
        const tags = gsap.utils.toArray<HTMLElement>('.tag', root.current).map((el) => ({
          el,
          y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }),
          s: gsap.quickTo(el, 'scale', { duration: 0.6, ease: 'power3' }),
          lifted: false,
        }))

        const onMove = (e: PointerEvent) => {
          for (const tag of tags) {
            const r = tag.el.getBoundingClientRect()
            const dx = e.clientX - (r.left + r.width / 2)
            const dy = e.clientY - (r.top + r.height / 2)
            const d = Math.hypot(dx, dy)
            if (d < RADIUS) {
              const f = 1 - d / RADIUS
              tag.lifted = true
              tag.y(-10 * f)
              tag.s(1 + 0.06 * f)
            } else if (tag.lifted) {
              tag.lifted = false
              tag.y(0)
              tag.s(1)
            }
          }
        }

        const rows = root.current!.querySelector<HTMLElement>('.stack__rows')!
        rows.addEventListener('pointermove', onMove)
        return () => rows.removeEventListener('pointermove', onMove)
      })
    },
    { scope: root },
  )

  return (
    <section className="beat stack" id="stack" ref={root}>
      <div className="shell stack__head">
        <p className="eyebrow line">
          <span>{t.stack.index}</span>
        </p>
        <h2 className="display stack__title">
          <span className="line">
            <span>{t.stack.title}</span>
          </span>
        </h2>
      </div>

      <div className="stack__rows">
        <ul className="stack__row stack__row--a">
          {ROW_A.map((t, i) => (
            <Tag key={t} label={t} i={i} />
          ))}
        </ul>
        <ul className="stack__row stack__row--b">
          {ROW_B.map((t, i) => (
            <Tag key={t} label={t} i={i + 1} />
          ))}
        </ul>
      </div>
    </section>
  )
}
