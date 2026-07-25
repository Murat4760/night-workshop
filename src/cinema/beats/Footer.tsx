import { useCopy } from '../../i18n/lang'

export function Footer() {
  const t = useCopy()

  const socials = [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'X', href: '#' },
    { label: t.foot.email, href: 'mailto:hello@example.com' },
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
            <a key={s.label} href={s.href} data-hover>
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
