/**
 * BEAT 4 — three process icons, drawn as small workshop objects rather than
 * generic glyphs. Same style sheet: 3px structural / 2px detail, warm light
 * from the upper left, violet accents for anything "live".
 */

const box = { viewBox: '0 0 120 120', className: 'art art--icon', 'aria-hidden': true } as const

/** 01 — Brief: a filled-in page on a clipboard. */
export function BriefIcon() {
  return (
    <svg {...box}>
      <rect x="20" y="16" width="70" height="92" rx="10" fill="var(--mid)" stroke="var(--mid-lift)" strokeWidth="3" />
      <rect x="26" y="22" width="58" height="80" rx="6" fill="var(--mid-deep)" />
      {/* clip */}
      <rect x="42" y="8" width="26" height="16" rx="5" fill="var(--mid-lift)" />
      <rect x="47" y="4" width="16" height="10" rx="4" fill="var(--mid)" stroke="var(--mid-lift)" strokeWidth="2" />
      {/* written lines, the top one is the headline */}
      <rect x="34" y="36" width="34" height="8" rx="4" fill="var(--violet)" opacity="0.75" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="34" y={54 + i * 13} width={i % 2 ? 30 : 42} height="6" rx="3" fill="var(--text)" opacity="0.22" />
      ))}
      {/* checked off */}
      <circle cx="88" cy="90" r="20" fill="var(--violet)" opacity="0.85" />
      <path d="M80 90 l6 7 l12 -15" stroke="var(--bg)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 02 — Build: an editor window mid-keystroke. */
export function BuildIcon() {
  return (
    <svg {...box}>
      <rect x="8" y="22" width="104" height="76" rx="12" fill="var(--mid)" stroke="var(--mid-lift)" strokeWidth="3" />
      <path d="M8 34 a12 12 0 0 1 12 -12 h80 a12 12 0 0 1 12 12 v6 H8 z" fill="var(--mid-deep)" />
      <circle cx="22" cy="31" r="3.5" fill="var(--orange)" opacity="0.85" />
      <circle cx="34" cy="31" r="3.5" fill="var(--mid-lift)" />
      {/* code brackets */}
      <path d="M42 56 l-12 12 l12 12" stroke="var(--violet)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 56 l12 12 l-12 12" stroke="var(--violet)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="68" y1="52" x2="54" y2="84" stroke="var(--orange)" strokeWidth="4" opacity="0.7" strokeLinecap="round" />
      {/* caret */}
      <rect x="96" y="60" width="3" height="14" rx="1.5" fill="var(--text)" opacity="0.5" />
    </svg>
  )
}

/** 03 — Ship: a launched rocket leaving a violet trail. */
export function ShipIcon() {
  return (
    <svg {...box}>
      <path
        d="M60 8 c 19 15, 27 38, 23 60 l-4 18 h-38 l-4 -18 c -4 -22, 4 -45, 23 -60 z"
        fill="var(--mid)"
        stroke="var(--mid-lift)"
        strokeWidth="3"
      />
      {/* porthole */}
      <circle cx="60" cy="46" r="12" fill="var(--mid-deep)" />
      <circle cx="60" cy="46" r="8" fill="var(--violet)" opacity="0.85" />
      <path d="M54 42 a8 8 0 0 1 6 -4" stroke="var(--text)" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
      {/* fins */}
      <path d="M37 68 l-15 22 l15 -4 z" fill="var(--mid-lift)" />
      <path d="M83 68 l15 22 l-15 -4 z" fill="var(--mid-lift)" />
      {/* exhaust */}
      <path d="M50 86 h20 l-4 10 h-12 z" fill="var(--mid-deep)" />
      <path d="M54 96 q6 20, 6 20 q0 0, 6 -20 z" fill="var(--orange)" opacity="0.85" />
      <path d="M58 98 q2 12, 2 12 q0 0, 2 -12 z" fill="var(--text)" opacity="0.4" />
      {/* speed marks */}
      <line x1="26" y1="102" x2="34" y2="94" stroke="var(--violet)" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
      <line x1="86" y1="94" x2="94" y2="102" stroke="var(--violet)" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
    </svg>
  )
}
