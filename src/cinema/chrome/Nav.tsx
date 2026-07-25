import { useRef } from 'react'
import { gsap, useGSAP } from '../motion'
import { scrollToId } from '../useSmoothScroll'
import { useCopy } from '../../i18n/lang'
import { LangSwitch } from './LangSwitch'

export function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const t = useCopy()

  const links = [
    { label: t.nav.work, id: '#work' },
    { label: t.nav.process, id: '#process' },
    { label: t.nav.contact, id: '#contact' },
  ]

  useGSAP(
    () => {
      gsap.set(root.current, { yPercent: -100 })
      if (!ready) return
      gsap.to(root.current, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 })
    },
    { scope: root, dependencies: [ready] },
  )

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <header className="nav" ref={root}>
      <div className="nav__inner">
        <div className="nav__left">
          <a className="nav__logo" href="#top" data-hover data-magnetic onClick={(e) => go(e, '#top')}>
            <span className="nav__mark" />
            <span>workshop</span>
          </a>
          <span className="nav__status">
            <i />
            {t.nav.available}
          </span>
        </div>
        <div className="nav__right">
          <nav className="nav__links">
            {links.map((link) => (
              <a key={link.id} href={link.id} data-hover onClick={(e) => go(e, link.id)}>
                {link.label}
              </a>
            ))}
          </nav>
          <LangSwitch />
        </div>
      </div>
    </header>
  )
}
