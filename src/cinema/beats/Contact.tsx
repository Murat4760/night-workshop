import { useRef } from 'react'
import { gsap, useGSAP, MQ, type MotionConditions } from '../motion'
import { useCopy } from '../../i18n/lang'

const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const s = Math.sin(i * 37.3) * 10000
  const r = s - Math.floor(s)
  const r2 = Math.abs(Math.cos(i * 12.7))
  return { left: `${(r * 96 + 2).toFixed(2)}%`, top: `${(r2 * 88 + 6).toFixed(2)}%`, size: 2 + (i % 3) * 2, warm: i % 5 === 0 }
})

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
        const { reduced } = ctx.conditions as MotionConditions

        gsap.from('.cta__head .line > span', {
          yPercent: 115,
          duration: reduced ? 0.4 : 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
        })

        gsap.from(['.cta__sub', '.cta__btn'], {
          autoAlpha: 0,
          y: reduced ? 0 : 24,
          duration: reduced ? 0.4 : 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 62%', once: true },
        })

        if (reduced) return

        gsap.utils.toArray<HTMLElement>('.cta__p', root.current).forEach((el, i) => {
          gsap.to(el, {
            y: `random(-40, 40)`,
            x: `random(-24, 24)`,
            opacity: `random(0.15, 0.7)`,
            duration: 5 + (i % 5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.12,
          })
        })

        gsap.to('.cta__glow--a', { scale: 1.15, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.cta__glow--b', { scale: 1.2, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 })
      })
    },
    { scope: root },
  )

  return (
    <section className="beat cta" id="contact" ref={root}>
      <div className="cta__bg" aria-hidden="true">
        <span className="cta__glow cta__glow--a" />
        <span className="cta__glow cta__glow--b" />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="cta__p"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.warm ? 'var(--orange)' : 'var(--violet)',
            }}
          />
        ))}
      </div>

      <div className="shell cta__inner">
        <div className="cta__head">
          <p className="eyebrow line">
            <span>{t.cta.index}</span>
          </p>
          <h2 className="display cta__title">
            {t.cta.title.map((part) => (
              <span className="line" key={part}>
                <span>{part}</span>
              </span>
            ))}
          </h2>
        </div>
        <p className="cta__sub">{t.cta.sub}</p>
        <a className="cta__btn" href="mailto:mguluzade11@gmail.com" data-hover data-magnetic>
          <span>{t.cta.button}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}
