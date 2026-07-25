import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, INTENSITY, MQ, type MotionConditions } from '../motion'
import { CityArt, RoomArt, DeskArt } from '../art/SceneArt'
import { useCopy } from '../../i18n/lang'

/**
 * Depth 1.7 — foreground code fragments and UI snippets. DOM rather than SVG so
 * each card keeps its own idle loop. Token widths/kinds fake syntax colouring;
 * `kind: 'status'` renders a deploy toast instead of code.
 */
type Token = { w: number; k?: 'kw' | 'fn' | 'str' | 'dim' }

const FRAGMENTS: {
  cls: string
  label: string
  kind?: 'status'
  status?: string
  lines?: Token[][]
}[] = [
  {
    cls: 'frag--a',
    label: 'hero.tsx',
    lines: [
      [{ w: 26, k: 'kw' }, { w: 44, k: 'fn' }, { w: 16, k: 'dim' }],
      [{ w: 18, k: 'dim' }, { w: 34, k: 'str' }, { w: 28 }],
      [{ w: 30, k: 'kw' }, { w: 22 }],
    ],
  },
  {
    cls: 'frag--b',
    label: 'scroll.ts',
    lines: [
      [{ w: 22, k: 'kw' }, { w: 38 }],
      [{ w: 16, k: 'dim' }, { w: 30, k: 'fn' }, { w: 20, k: 'str' }],
      [{ w: 42 }, { w: 18, k: 'dim' }],
    ],
  },
  {
    cls: 'frag--c',
    label: 'lenis.raf()',
    lines: [
      [{ w: 34, k: 'fn' }, { w: 26, k: 'dim' }],
      [{ w: 20, k: 'str' }, { w: 40 }],
    ],
  },
  { cls: 'frag--d', label: 'vercel', kind: 'status', status: 'Deployed' },
]

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>('.hero__stage')!
      const layers = gsap.utils.toArray<HTMLElement>('.layer', root.current)
      const depth = (el: HTMLElement) => Number(el.dataset.depth ?? 1)

      // Hidden until the loader hands over.
      gsap.set('.hero__copy .line > span', { yPercent: 115 })
      gsap.set(['.hero__sub', '.hero__cue'], { autoAlpha: 0, y: 18 })
      gsap.set(layers, { autoAlpha: 0, y: (_i: number, el: HTMLElement) => 40 * depth(el) })

      if (!ready) return

      const mm = gsap.matchMedia()

      mm.add(
        { full: MQ.full, lite: MQ.lite, reduced: MQ.reduced },
        (ctx) => {
          const { full, lite, reduced } = ctx.conditions as MotionConditions
          const k = full ? INTENSITY.full : INTENSITY.lite

          /* ---------- entrance (time-based, plays once after the loader) ---------- */
          const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

          if (reduced) {
            intro
              .to(layers, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 })
              .to('.hero__copy .line > span', { yPercent: 0, duration: 0.5, stagger: 0.05 }, 0.1)
              .to(['.hero__sub', '.hero__cue'], { autoAlpha: 1, y: 0, duration: 0.5 }, 0.3)
            return
          }

          intro
            .to(layers, {
              autoAlpha: 1,
              y: 0,
              duration: 1.6,
              stagger: 0.12,
              ease: 'expo.out',
            })
            .to(
              '.hero__copy .line > span',
              { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09 },
              0.35,
            )
            .to(['.hero__sub', '.hero__cue'], { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.95)

          /* ---------- idle life: fragments drift, cue bobs ---------- */
          gsap.utils.toArray<HTMLElement>('.frag', root.current).forEach((el, i) => {
            gsap.to(el, {
              y: `+=${10 + i * 3}`,
              rotate: i % 2 ? 1.4 : -1.4,
              duration: 3.2 + i * 0.45,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: i * 0.25,
            })
          })
          gsap.to('.hero__cue i', { y: 8, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' })

          /* ---------- scrubbed scroll timeline ---------- */
          // Scroll uses yPercent/scale so it never collides with the entrance (y)
          // or the mouse tilt (which lives on .layer__inner).
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              // BEAT 1 — pinned for 150vh of scroll travel.
              // Un-pinned (mobile): the section's own scroll-out is the range.
              end: full ? '+=150%' : 'bottom top',
              scrub: 1,
              pin: full ? stage : false,
              anticipatePin: full ? 1 : 0,
              // This trigger is created last (it waits for the loader) but sits
              // first on the page. Without priority, every beat below it gets
              // measured before the hero's pin spacing exists and fires ~1
              // viewport early.
              refreshPriority: 1,
            },
          })

          layers.forEach((el) => {
            const d = depth(el)
            tl.to(el, { yPercent: -9 * d * k, scale: 1 + 0.05 * d * k, ease: 'none' }, 0)
          })

          tl.to('.hero__copy', { yPercent: -18 * k, autoAlpha: lite ? 1 : 0.15, ease: 'none' }, 0)
            .to('.hero__cue', { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0)
            .to('.hero__vignette', { autoAlpha: 1, ease: 'none' }, 0)

          /* ---------- signature: mouse tilt (desktop pointers only) ---------- */
          if (!full || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

          const inners = gsap.utils.toArray<HTMLElement>('.layer__inner', root.current)
          const setters = inners.map((inner) => ({
            d: depth(inner.parentElement as HTMLElement),
            x: gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'power3' }),
            y: gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'power3' }),
          }))

          const onMove = (e: PointerEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2
            const ny = (e.clientY / window.innerHeight - 0.5) * 2
            setters.forEach((s) => {
              s.x(nx * 30 * s.d)
              s.y(ny * 20 * s.d)
            })
          }

          window.addEventListener('pointermove', onMove, { passive: true })
          return () => window.removeEventListener('pointermove', onMove)
        },
      )

      // The hero's pin adds 150vh to the page, which moves every beat below it.
      ScrollTrigger.refresh()
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  )

  return (
    <section className="beat hero" id="top" ref={root}>
      <div className="hero__stage">
        <div className="hero__scene">
          <div className="layer layer--city" data-depth="0.25">
            <div className="layer__inner">
              <CityArt />
            </div>
          </div>
          <div className="layer layer--room" data-depth="0.5">
            <div className="layer__inner">
              <RoomArt />
            </div>
          </div>
          <div className="layer layer--desk" data-depth="0.95">
            <div className="layer__inner">
              <DeskArt />
            </div>
          </div>
          <div className="layer layer--frag" data-depth="1.7">
            <div className="layer__inner">
              {FRAGMENTS.map((f) => (
                <div className={`frag ${f.cls}`} key={f.cls}>
                  <span className="frag__dot" />
                  <span className="frag__label">{f.label}</span>
                  {f.kind === 'status' ? (
                    <span className="frag__status">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f.status}
                    </span>
                  ) : (
                    <span className="frag__lines">
                      {f.lines?.map((line, i) => (
                        <span className="frag__line" key={i}>
                          {line.map((tk, j) => (
                            <i key={j} data-tk={tk.k ?? 'plain'} style={{ width: `${tk.w}%` }} />
                          ))}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="hero__vignette" />
        </div>

        <div className="hero__copy shell">
          <p className="eyebrow eyebrow--accent line">
            <span>{t.hero.eyebrow}</span>
          </p>
          <h1 className="display hero__name">
            {t.hero.name.map((part) => (
              <span className="line" key={part}>
                <span>{part}</span>
              </span>
            ))}
          </h1>
          <p className="hero__sub">{t.hero.sub}</p>
          <div className="hero__cue">
            <i />
            <span className="eyebrow">{t.hero.cue}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
