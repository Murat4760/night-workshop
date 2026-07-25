import { useRef } from 'react'
import { gsap, useGSAP, MQ, type MotionConditions } from '../motion'
import { useCopy } from '../../i18n/lang'

/** Order-matched to copy.numbers.statLabels. */
const STATS = [
  { to: 24, suffix: '+' },
  { to: 9, suffix: '' },
  { to: 98, suffix: '' },
  { to: 4, suffix: '' },
]

/**
 * BEAT 5 — counters and one pull quote, on an asymmetric split. Deliberately
 * not three cards in a row and not a wall of avatars: the numbers carry it and
 * a single client line does the vouching.
 */
export function Numbers() {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
        const { reduced } = ctx.conditions as MotionConditions
        const enter = { trigger: root.current, start: 'top 76%', once: true } as const

        gsap.from('.nm__head .line > span', {
          yPercent: 115,
          duration: reduced ? 0.4 : 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: enter,
        })

        // Count up. Under reduced motion the values are simply set.
        gsap.utils.toArray<HTMLElement>('.nm__value', root.current).forEach((el, i) => {
          const stat = STATS[i]
          if (reduced) {
            el.textContent = `${stat.to}${stat.suffix}`
            return
          }
          const counter = { v: 0 }
          gsap.to(counter, {
            v: stat.to,
            duration: 1.6,
            ease: 'power2.out',
            delay: i * 0.09,
            scrollTrigger: { trigger: '.nm__stats', start: 'top 84%', once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(counter.v)}${stat.suffix}`
            },
          })
        })

        gsap.from('.nm__stat', {
          autoAlpha: 0,
          y: reduced ? 0 : 26,
          duration: reduced ? 0.4 : 0.8,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: '.nm__stats', start: 'top 84%', once: true },
        })

        gsap.from('.nm__quote', {
          autoAlpha: 0,
          y: reduced ? 0 : 34,
          duration: reduced ? 0.4 : 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.nm__quote', start: 'top 86%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="beat nm" ref={root}>
      <div className="shell nm__grid">
        <div className="nm__head">
          <p className="eyebrow line">
            <span>{t.numbers.index}</span>
          </p>
          <h2 className="display nm__title">
            <span className="line">
              <span>{t.numbers.title}</span>
            </span>
          </h2>
        </div>

        <ul className="nm__stats">
          {t.numbers.statLabels.map((label, i) => (
            <li className="nm__stat" key={label}>
              <span className="display nm__value" data-i={i}>
                0
              </span>
              <span className="nm__label">{label}</span>
            </li>
          ))}
        </ul>

        <figure className="nm__quote">
          <span className="nm__mark" aria-hidden="true">
            “
          </span>
          <blockquote>{t.numbers.quote.text}</blockquote>
          <figcaption>
            <b>{t.numbers.quote.author}</b>
            <span>{t.numbers.quote.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
