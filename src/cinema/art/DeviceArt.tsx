/**
 * BEAT 3 — the featured build, shown on a laptop with a phone leaning in.
 * Same style sheet as SceneArt: 5-colour palette, 3px structural / 2px detail,
 * cool screen light. The screen content mirrors the restaurant site it credits.
 */
export function DeviceArt() {
  return (
    <svg viewBox="0 0 620 540" className="art art--device" aria-hidden="true">
      <defs>
        <linearGradient id="deviceScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="deviceHero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="lidEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mid-lift)" />
          <stop offset="100%" stopColor="var(--mid)" />
        </linearGradient>
      </defs>

      {/* ---------------- laptop ---------------- */}
      <rect x="34" y="34" width="512" height="330" rx="18" fill="var(--mid-deep)" stroke="url(#lidEdge)" strokeWidth="5" />
      <rect x="54" y="54" width="472" height="290" rx="10" fill="url(#deviceScreen)" />

      {/* browser chrome */}
      <rect x="54" y="54" width="472" height="32" rx="10" fill="var(--bg)" opacity="0.62" />
      <circle cx="76" cy="70" r="5" fill="var(--orange)" opacity="0.8" />
      <circle cx="94" cy="70" r="5" fill="var(--mid-lift)" />
      <circle cx="112" cy="70" r="5" fill="var(--mid-lift)" />
      <rect x="134" y="62" width="196" height="16" rx="8" fill="var(--mid)" />
      <rect x="146" y="68" width="8" height="4" rx="2" fill="var(--violet)" opacity="0.8" />
      <rect x="160" y="67" width="86" height="6" rx="3" fill="var(--text)" opacity="0.2" />

      {/* site nav */}
      <rect x="76" y="102" width="52" height="9" rx="4.5" fill="var(--text)" opacity="0.4" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={332 + i * 54} y="103" width={i === 2 ? 44 : 36} height="7" rx="3.5" fill="var(--text)" opacity="0.16" />
      ))}

      {/* hero block */}
      <rect x="76" y="128" width="428" height="118" rx="10" fill="url(#deviceHero)" />
      <rect x="96" y="158" width="150" height="14" rx="7" fill="var(--text)" opacity="0.62" />
      <rect x="96" y="180" width="104" height="9" rx="4.5" fill="var(--text)" opacity="0.34" />
      <rect x="96" y="202" width="82" height="22" rx="11" fill="var(--text)" opacity="0.82" />
      <rect x="112" y="210" width="50" height="6" rx="3" fill="var(--bg)" opacity="0.7" />
      {/* plate motif in the hero, right side */}
      <circle cx="418" cy="188" r="42" fill="var(--bg)" opacity="0.24" />
      <circle cx="418" cy="188" r="26" fill="var(--orange)" opacity="0.42" />

      {/* menu cards */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={76 + i * 146} y="260" width="136" height="66" rx="8" fill="var(--text)" opacity="0.07" />
          <rect x={88 + i * 146} y="272" width="42" height="30" rx="6" fill="var(--orange)" opacity={0.3 - i * 0.06} />
          <rect x={138 + i * 146} y="276" width="60" height="8" rx="4" fill="var(--text)" opacity="0.22" />
          <rect x={138 + i * 146} y="290" width="38" height="6" rx="3" fill="var(--text)" opacity="0.13" />
          <rect x={138 + i * 146} y="306" width="26" height="7" rx="3.5" fill="var(--violet)" opacity="0.6" />
        </g>
      ))}

      {/* lid base + hinge */}
      <path d="M6 364 h568 l-22 26 H28 Z" fill="var(--mid)" />
      <rect x="6" y="364" width="568" height="8" rx="4" fill="var(--mid-lift)" />
      <rect x="252" y="368" width="76" height="6" rx="3" fill="var(--bg)" opacity="0.55" />
      {/* desk reflection */}
      <ellipse cx="290" cy="400" rx="250" ry="14" fill="var(--violet)" opacity="0.08" />

      {/* ---------------- phone, leaning in front-right ---------------- */}
      <g transform="translate(438 214) rotate(4)">
        <rect x="0" y="0" width="156" height="304" rx="26" fill="var(--mid-deep)" stroke="url(#lidEdge)" strokeWidth="5" />
        <rect x="12" y="14" width="132" height="276" rx="18" fill="var(--bg)" opacity="0.6" />
        <rect x="58" y="24" width="40" height="7" rx="3.5" fill="var(--mid-lift)" />

        {/* phone hero */}
        <rect x="26" y="44" width="104" height="66" rx="10" fill="url(#deviceHero)" />
        <circle cx="104" cy="78" r="18" fill="var(--bg)" opacity="0.26" />
        <rect x="38" y="62" width="46" height="8" rx="4" fill="var(--text)" opacity="0.55" />
        <rect x="38" y="78" width="30" height="6" rx="3" fill="var(--text)" opacity="0.3" />

        {/* list rows */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="26" y={124 + i * 40} width="104" height="32" rx="8" fill="var(--text)" opacity="0.07" />
            <rect x="34" y={132 + i * 40} width="18" height="16" rx="4" fill="var(--orange)" opacity={0.34 - i * 0.07} />
            <rect x="60" y={134 + i * 40} width="52" height="6" rx="3" fill="var(--text)" opacity="0.2" />
            <rect x="60" y={144 + i * 40} width="30" height="5" rx="2.5" fill="var(--text)" opacity="0.12" />
          </g>
        ))}

        {/* sticky booking button */}
        <rect x="26" y="250" width="104" height="30" rx="15" fill="var(--violet)" opacity="0.68" />
        <rect x="52" y="261" width="52" height="8" rx="4" fill="var(--text)" opacity="0.85" />
      </g>
    </svg>
  )
}
