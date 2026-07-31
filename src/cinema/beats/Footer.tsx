import { useCopy } from '../../i18n/lang'

export function Footer() {
  const t = useCopy()

  // LinkedIn/X aren't linked yet — a dead "#" next to a real GitHub link would
  // read as broken rather than pending, so they're left out until they exist.
  const socials = [
    { label: 'GitHub', href: 'https://github.com/Murat4760', external: true },
    { label: t.foot.email, href: 'mailto:mguluzade11@gmail.com', external: false },
  ]

  return (
    <footer className="beat foot">
      <div className="shell foot__inner">
        <a className="foot__logo" href="#top" data-hover>
          <span className="nav__mark" />
          <span>workshop</span>
        </a>
        <nav className="foot__socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-hover
              {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <p className="foot__copy">
          © {new Date().getFullYear()} {t.foot.copyright}
        </p>
      </div>
    </footer>
  )
}
