import { useRef } from 'react'
import { gsap, useGSAP, INTENSITY, MQ, type MotionConditions } from '../motion'
import { DeviceArt } from '../art/DeviceArt'
import { useCopy } from '../../i18n/lang'

export function Featured() {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>('.feat__stage')!
      const mm = gsap.matchMedia()

      mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
        const { full, reduced } = ctx.conditions as MotionConditions
        const k = full ? INTENSITY.full : INTENSITY.lite

        /**
         * Un-pinned path — mobile and reduced-motion both get the beat as a
         * normal flow section with entrance animations instead of a scrub.
         */
        if (!full) {
          gsap.from('.feat__head .line > span', {
            yPercent: 115,
            duration: reduced ? 0.4 : 0.9,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          })
          gsap.from('.feat__deviceWrap', {
            autoAlpha: 0,
            y: reduced ? 0 : 40 * k,
            duration: reduced ? 0.4 : 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: stage, start: 'top 72%', once: true },
          })
          // Bullets still arrive one at a time, just on a stagger rather than scroll position.
          gsap.from('.feat__bullet', {
            autoAlpha: 0,
            y: reduced ? 0 : 26,
            duration: reduced ? 0.4 : 0.7,
            ease: 'power3.out',
            stagger: reduced ? 0.06 : 0.16,
            scrollTrigger: { trigger: '.feat__list', start: 'top 82%', once: true },
          })

          if (!reduced) {
            gsap.to('.feat__device', {
              y: -12,
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            })
          }
          return
        }

        // Device floats on its own clock; scroll drives the outer wrapper only.
        gsap.to('.feat__device', {
          y: -18,
          rotate: 0.8,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            // BEAT 3 — pinned for 120vh of scroll travel; the four bullets are
            // spaced across it, so each gets ~25vh of scroll to itself.
            end: '+=120%',
            scrub: 1,
            pin: stage,
          },
        })

        // Total beat length in timeline units — the device drifts across all of
        // it so the frame never goes static while the bullets are landing.
        const BEAT = 3.15

        tl.fromTo(
          '.feat__head .line > span',
          { yPercent: 115 },
          { yPercent: 0, ease: 'none', stagger: 0.08, duration: 0.6 },
          0,
        )
          .fromTo(
            '.feat__deviceWrap',
            { yPercent: 14 * k, scale: 0.94 },
            { yPercent: -10 * k, scale: 1, ease: 'none', duration: BEAT },
            0,
          )
          .fromTo('.feat__glow', { autoAlpha: 0.25 }, { autoAlpha: 0.7, ease: 'none', duration: BEAT }, 0)

        // Bullets stack in one at a time: each starts 0.55 after the previous,
        // so the last one lands with ~0.4 of the beat left to read it.
        gsap.utils.toArray<HTMLElement>('.feat__bullet', root.current).forEach((el, i) => {
          tl.fromTo(
            el,
            { autoAlpha: 0, y: 34 * k },
            { autoAlpha: 1, y: 0, ease: 'none', duration: 0.5 },
            0.6 + i * 0.55,
          )
        })

        // Hold on the final state so the last bullet is readable before unpinning.
        tl.to({}, { duration: 0.4 }, BEAT - 0.4)
      })
    },
    { scope: root },
  )

  return (
    <section className="beat feat" id="work" ref={root}>
      <div className="feat__stage">
        <div className="shell feat__grid">
          <div className="feat__copy">
            <div className="feat__head">
              <p className="eyebrow eyebrow--accent line">
                <span>{t.feat.index}</span>
              </p>
              <h2 className="display feat__title">
                {t.feat.title.map((part) => (
                  <span className="line" key={part}>
                    <span>{part}</span>
                  </span>
                ))}
              </h2>
            </div>
            <ul className="feat__list">
              {t.feat.bullets.map((b) => (
                <li className="feat__bullet" key={b.k}>
                  <span className="feat__k">{b.k}</span>
                  <span>
                    <strong>{b.t}</strong>
                    <em>{b.d}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="feat__deviceWrap">
            <div className="feat__glow" />
            <div className="feat__device">
              <DeviceArt />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
