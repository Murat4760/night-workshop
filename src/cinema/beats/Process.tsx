import { useRef } from 'react'
import { gsap, useGSAP, MQ, type MotionConditions } from '../motion'
import { BriefIcon, BuildIcon, ShipIcon } from '../art/ProcessArt'
import { useCopy } from '../../i18n/lang'

const ICONS = [BriefIcon, BuildIcon, ShipIcon]

export function Process() {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
        const { reduced } = ctx.conditions as MotionConditions

        gsap.from('.proc__head .line > span', {
          yPercent: 115,
          duration: reduced ? 0.4 : 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        })

        gsap.from('.proc__step', {
          autoAlpha: 0,
          y: reduced ? 0 : 44,
          duration: reduced ? 0.4 : 1,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: { trigger: '.proc__track', start: 'top 78%', once: true },
        })

        if (reduced) return

        // Hand-drawn connector draws itself as the section scrolls through.
        gsap.utils.toArray<SVGPathElement>('[data-draw]', root.current).forEach((path) => {
          const len = path.getTotalLength()
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.proc__track',
              start: 'top 72%',
              end: 'bottom 62%',
              scrub: 1,
            },
          })
        })

        gsap.utils.toArray<HTMLElement>('.proc__icon', root.current).forEach((el, i) => {
          gsap.to(el, {
            y: -8,
            duration: 3 + i * 0.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="beat proc" id="process" ref={root}>
      <div className="shell">
        <div className="proc__head">
          <p className="eyebrow line">
            <span>{t.proc.index}</span>
          </p>
          <h2 className="display proc__title">
            <span className="line">
              <span>{t.proc.title}</span>
            </span>
          </h2>
        </div>

        <div className="proc__track">
          {/* desktop connector */}
          <svg className="proc__line proc__line--h" viewBox="0 0 1200 160" fill="none" aria-hidden="true">
            <path
              data-draw
              d="M110 96 C 240 30, 320 150, 460 92 S 700 24, 820 96 S 1010 150, 1110 74"
              stroke="var(--violet)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="0"
              opacity="0.55"
            />
          </svg>
          {/* mobile connector */}
          <svg className="proc__line proc__line--v" viewBox="0 0 120 900" fill="none" aria-hidden="true">
            <path
              data-draw
              d="M60 40 C 10 200, 110 300, 60 450 S 10 700, 60 860"
              stroke="var(--violet)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>

          {t.proc.steps.map((step, i) => {
            const Icon = ICONS[i]
            return (
              <article className="proc__step" key={step.k}>
                <div className="proc__icon">
                  <Icon />
                </div>
                <p className="eyebrow eyebrow--accent">{step.k}</p>
                <h3 className="display proc__stepTitle">{step.t}</h3>
                <p className="proc__stepBody">{step.d}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
