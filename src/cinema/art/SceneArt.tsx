/**
 * THE NIGHT WORKSHOP — illustrated scene, three parallax depths.
 *
 * STYLE SHEET (keep every asset on this or the illusion breaks):
 *   palette      #0D0D14 bg · #1B1730 deep · #2A2440 mid · #3A3257 lift
 *                #7C5CFF violet (screen light) · #FF6B4A orange (lamp light)
 *   line weight  3 structural · 2 detail (in 1440-unit viewBox space)
 *   light        cool violet from the monitors (below centre, front-lit),
 *                warm orange from the desk lamp (upper left),
 *                city haze is pure backlight — never lights the room
 *   radii        6 small · 10 medium · 16 large
 *
 * Geometry contract with beats.css — do not change viewBox/preserveAspectRatio
 * without updating the .layer--* rules that position these.
 */

/** Deterministic noise so the skyline is identical on every render. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/* ------------------------------------------------------------------ *
 * DEPTH 0.25 — distant city glow
 * ------------------------------------------------------------------ */

type Tower = { x: number; w: number; h: number; band: number }

function skyline(count: number, band: number, seedBase: number, baseH: number, spread: number): Tower[] {
  return Array.from({ length: count }, (_, i) => {
    const s = seedBase + i
    return {
      x: i * spread - spread * 0.5 + rand(s) * 18,
      w: spread * 0.62 + rand(s + 100) * spread * 0.3,
      h: baseH + rand(s + 200) * baseH * 1.15,
      band,
    }
  })
}

function Windows({ t, seed }: { t: Tower; seed: number }) {
  const cols = Math.max(1, Math.floor(t.w / 26))
  const rows = Math.floor(t.h / 32)
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = rand(seed * 31 + r * 7.3 + c * 2.1)
      if (v > 0.58) continue
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={t.x + 10 + c * 24}
          y={620 - t.h + 16 + r * 30}
          width="9"
          height="12"
          rx="2"
          fill={v > 0.12 ? 'var(--violet)' : 'var(--orange)'}
          opacity={0.24 + v * 1.1}
        />,
      )
    }
  }
  return <>{cells}</>
}

export function CityArt() {
  const far = skyline(16, 0, 1, 70, 96)
  const mid = skyline(14, 1, 60, 120, 112)
  const near = skyline(10, 2, 130, 190, 160)

  return (
    <svg
      className="art art--city"
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cityHaze" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.4" />
          <stop offset="45%" stopColor="var(--violet)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="towerFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mid)" />
          <stop offset="100%" stopColor="var(--bg-lift)" />
        </linearGradient>
        <linearGradient id="towerNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mid-deep)" />
          <stop offset="100%" stopColor="var(--bg)" />
        </linearGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* stars — only in the upper band, above the haze */}
      {Array.from({ length: 34 }, (_, i) => (
        <circle
          key={i}
          cx={rand(i + 700) * 1440}
          cy={rand(i + 800) * 190}
          r={rand(i + 900) > 0.8 ? 1.8 : 1.1}
          fill="var(--text)"
          opacity={0.15 + rand(i + 950) * 0.4}
        />
      ))}

      {/* moon */}
      <circle cx="1146" cy="126" r="78" fill="url(#moonGlow)" />
      <circle cx="1146" cy="126" r="26" fill="var(--orange)" opacity="0.34" />
      <circle cx="1138" cy="120" r="26" fill="var(--bg)" opacity="0.55" />

      <rect x="0" y="150" width="1440" height="470" fill="url(#cityHaze)" />

      {/* --- far band --- */}
      <g opacity="0.45">
        {far.map((t, i) => (
          <rect key={i} x={t.x} y={620 - t.h} width={t.w} height={t.h} rx="4" fill="url(#towerFar)" />
        ))}
      </g>

      {/* --- mid band --- */}
      <g opacity="0.8">
        {mid.map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={620 - t.h} width={t.w} height={t.h} rx="6" fill="url(#towerFar)" />
            <Windows t={t} seed={i + 3} />
          </g>
        ))}
      </g>

      {/* --- near band, with rooftop clutter --- */}
      {near.map((t, i) => {
        const roof = 620 - t.h
        return (
          <g key={i}>
            <rect x={t.x} y={roof} width={t.w} height={t.h} rx="8" fill="url(#towerNear)" />
            <rect x={t.x} y={roof} width={t.w} height="4" fill="var(--mid-lift)" opacity="0.5" />
            <Windows t={t} seed={i + 40} />
            {/* antenna + aviation light */}
            {rand(i + 500) > 0.45 && (
              <>
                <line
                  x1={t.x + t.w * 0.5}
                  y1={roof}
                  x2={t.x + t.w * 0.5}
                  y2={roof - 46}
                  stroke="var(--mid-lift)"
                  strokeWidth="3"
                />
                <circle cx={t.x + t.w * 0.5} cy={roof - 50} r="4" fill="var(--orange)" opacity="0.85" />
              </>
            )}
            {/* water tank */}
            {rand(i + 600) > 0.6 && (
              <>
                <rect x={t.x + t.w - 46} y={roof - 26} width="30" height="26" rx="5" fill="var(--mid)" />
                <rect x={t.x + t.w - 44} y={roof - 34} width="26" height="8" rx="4" fill="var(--mid-lift)" />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * DEPTH 0.5 — the room the city is seen from
 * ------------------------------------------------------------------ */

export function RoomArt() {
  return (
    <svg className="art art--room" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="paneTint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ---- window ---- */}
      <g>
        <rect x="286" y="78" width="868" height="524" rx="16" fill="url(#paneTint)" />
        <rect
          x="286"
          y="78"
          width="868"
          height="524"
          rx="16"
          fill="none"
          stroke="var(--mid-lift)"
          strokeWidth="6"
        />
        {/* mullions */}
        <line x1="720" y1="78" x2="720" y2="602" stroke="var(--mid-lift)" strokeWidth="6" />
        <line x1="286" y1="340" x2="1154" y2="340" stroke="var(--mid-lift)" strokeWidth="6" />
        {/* pane highlight — light rakes in from the upper left */}
        <path d="M310 100 L470 100 L330 300 L310 300 Z" fill="var(--text)" opacity="0.03" />
        <path d="M746 358 L860 358 L760 500 L746 500 Z" fill="var(--text)" opacity="0.025" />
        {/* sill */}
        <rect x="262" y="598" width="916" height="18" rx="8" fill="var(--mid)" />
        <rect x="262" y="598" width="916" height="4" rx="2" fill="var(--mid-lift)" opacity="0.7" />
        {/* condensation dots, bottom corners */}
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={310 + i * 17} cy={584 - (i % 3) * 9} r={1.8} fill="var(--text)" opacity="0.12" />
        ))}
      </g>

      {/* ---- curtain, right ---- */}
      <g opacity="0.9">
        <path
          d="M1154 62 q26 200 8 300 q-16 100 6 262 h96 V62 Z"
          fill="var(--mid-deep)"
        />
        <path d="M1178 62 q18 220 2 560" stroke="var(--mid-lift)" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M1214 62 q14 220 4 560" stroke="var(--mid-lift)" strokeWidth="3" fill="none" opacity="0.4" />
        <rect x="1120" y="52" width="180" height="12" rx="6" fill="var(--mid)" />
      </g>

      {/* ---- hanging lamp, left ---- */}
      <g>
        <line x1="196" y1="0" x2="196" y2="146" stroke="var(--mid-lift)" strokeWidth="4" />
        <path d="M142 146 h108 l-26 58 h-56 z" fill="var(--mid)" />
        <path d="M142 146 h108 l-6 13 h-96 z" fill="var(--mid-lift)" />
        <ellipse cx="196" cy="206" rx="26" ry="7" fill="var(--orange)" opacity="0.5" />
        <path d="M170 206 L222 206 L300 620 L92 620 Z" fill="url(#lampCone)" />
      </g>

      {/* ---- shelf with books + plant, left wall ---- */}
      <g>
        <rect x="40" y="352" width="196" height="12" rx="6" fill="var(--mid)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={56 + i * 20}
            y={352 - (48 + (i % 3) * 12)}
            width="14"
            height={48 + (i % 3) * 12}
            rx="3"
            fill={i === 2 ? 'var(--mid-lift)' : 'var(--mid)'}
          />
        ))}
        {/* leaning book */}
        <rect x="162" y="308" width="12" height="44" rx="3" fill="var(--mid-lift)" transform="rotate(12 168 330)" />
        {/* trailing plant */}
        <rect x="196" y="318" width="30" height="34" rx="6" fill="var(--mid-lift)" />
        <path d="M204 318 q-16 40 -30 66" stroke="var(--violet)" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M214 318 q6 46 -6 78" stroke="var(--violet)" strokeWidth="3" fill="none" opacity="0.38" />
      </g>

      {/* ---- poster, right wall ---- */}
      <g opacity="0.75">
        <rect x="1280" y="250" width="120" height="160" rx="6" fill="var(--mid-deep)" stroke="var(--mid-lift)" strokeWidth="3" />
        <circle cx="1340" cy="308" r="28" fill="var(--orange)" opacity="0.4" />
        <rect x="1300" y="356" width="80" height="8" rx="4" fill="var(--text)" opacity="0.16" />
        <rect x="1300" y="374" width="52" height="8" rx="4" fill="var(--text)" opacity="0.1" />
      </g>

      {/* ---- floor line ---- */}
      <rect x="0" y="836" width="1440" height="3" fill="var(--mid-lift)" opacity="0.3" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * DEPTH 0.95 — the desk. Carries the signature mouse tilt.
 * ------------------------------------------------------------------ */

/** Syntax-coloured code lines for the main editor screen. */
const CODE_LINES: { w: number; c: string; o: number; indent: number }[] = [
  { w: 168, c: 'var(--violet)', o: 0.75, indent: 0 },
  { w: 232, c: 'var(--text)', o: 0.22, indent: 0 },
  { w: 118, c: 'var(--orange)', o: 0.6, indent: 18 },
  { w: 260, c: 'var(--text)', o: 0.18, indent: 18 },
  { w: 196, c: 'var(--text)', o: 0.18, indent: 36 },
  { w: 142, c: 'var(--violet)', o: 0.55, indent: 36 },
  { w: 210, c: 'var(--text)', o: 0.16, indent: 18 },
  { w: 96, c: 'var(--orange)', o: 0.45, indent: 0 },
]

export function DeskArt() {
  return (
    <svg className="art art--desk" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="screenMain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="screenSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mid)" />
          <stop offset="100%" stopColor="var(--mid-deep)" />
        </linearGradient>
        <radialGradient id="screenBloom">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lampBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* light pooling off the screens */}
      <ellipse cx="650" cy="500" rx="520" ry="300" fill="url(#screenBloom)" />

      {/* ---------- main monitor ---------- */}
      <g>
        {/* cable behind */}
        <path d="M668 660 q40 90 -10 150" stroke="var(--mid-deep)" strokeWidth="7" fill="none" />
        <rect x="396" y="246" width="512" height="332" rx="16" fill="var(--mid-deep)" stroke="var(--mid-lift)" strokeWidth="5" />
        <rect x="414" y="264" width="476" height="296" rx="8" fill="url(#screenMain)" />

        {/* editor chrome: tab bar */}
        <rect x="414" y="264" width="476" height="26" rx="8" fill="var(--bg)" opacity="0.5" />
        <rect x="426" y="272" width="70" height="10" rx="5" fill="var(--violet)" opacity="0.7" />
        <rect x="506" y="272" width="54" height="10" rx="5" fill="var(--text)" opacity="0.14" />
        <rect x="570" y="272" width="46" height="10" rx="5" fill="var(--text)" opacity="0.1" />

        {/* sidebar */}
        <rect x="414" y="290" width="58" height="270" fill="var(--bg)" opacity="0.35" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="426" y={306 + i * 22} width={i % 2 ? 22 : 32} height="7" rx="3.5" fill="var(--text)" opacity="0.14" />
        ))}

        {/* code body + gutter */}
        {CODE_LINES.map((l, i) => (
          <g key={i}>
            <rect x="486" y={310 + i * 27} width="8" height="7" rx="3" fill="var(--text)" opacity="0.1" />
            <rect x={508 + l.indent} y={308 + i * 27} width={l.w} height="11" rx="5" fill={l.c} opacity={l.o} />
          </g>
        ))}
        {/* cursor */}
        <rect x="508" y={308 + 8 * 27} width="3" height="13" fill="var(--orange)" opacity="0.9" />

        {/* status bar */}
        <rect x="414" y="540" width="476" height="20" fill="var(--bg)" opacity="0.45" />
        <rect x="428" y="546" width="64" height="8" rx="4" fill="var(--violet)" opacity="0.55" />
        <rect x="504" y="546" width="40" height="8" rx="4" fill="var(--text)" opacity="0.12" />

        {/* stand */}
        <path d="M614 578 h84 l14 78 h-112 z" fill="var(--mid)" />
        <rect x="556" y="652" width="200" height="14" rx="7" fill="var(--mid-lift)" />
      </g>

      {/* ---------- side monitor, angled ---------- */}
      <g transform="rotate(-10 1046 440)">
        <rect x="932" y="304" width="252" height="268" rx="14" fill="var(--mid-deep)" stroke="var(--mid-lift)" strokeWidth="5" />
        <rect x="948" y="320" width="220" height="236" rx="8" fill="url(#screenSide)" />
        {/* a design preview: hero block + cards */}
        <rect x="962" y="334" width="192" height="66" rx="6" fill="var(--orange)" opacity="0.3" />
        <rect x="974" y="356" width="72" height="9" rx="4.5" fill="var(--text)" opacity="0.4" />
        <rect x="974" y="372" width="44" height="7" rx="3.5" fill="var(--text)" opacity="0.22" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={962 + i * 66} y="412" width="56" height="52" rx="6" fill="var(--text)" opacity="0.09" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="962" y={478 + i * 18} width={i % 2 ? 118 : 176} height="8" rx="4" fill="var(--text)" opacity="0.12" />
        ))}
        <rect x="1052" y="304" width="18" height="268" fill="var(--text)" opacity="0.02" />
        {/* stand */}
        <rect x="1030" y="572" width="56" height="34" fill="var(--mid)" />
        <rect x="988" y="602" width="140" height="12" rx="6" fill="var(--mid-lift)" />
      </g>

      {/* ---------- desk lamp, left ---------- */}
      <g>
        <ellipse cx="228" cy="784" rx="52" ry="12" fill="var(--mid-lift)" />
        <line x1="228" y1="778" x2="228" y2="560" stroke="var(--mid)" strokeWidth="10" strokeLinecap="round" />
        <line x1="228" y1="562" x2="326" y2="474" stroke="var(--mid)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="228" cy="562" r="9" fill="var(--mid-lift)" />
        <path d="M300 448 l62 34 l-40 54 l-52 -40 z" fill="var(--mid)" />
        <ellipse cx="330" cy="510" rx="24" ry="12" fill="var(--orange)" opacity="0.55" transform="rotate(38 330 510)" />
        <path d="M306 512 L358 528 L470 800 L250 800 Z" fill="url(#lampBeam)" />
      </g>

      {/* ---------- desk surface ---------- */}
      <rect x="-60" y="782" width="1560" height="190" rx="20" fill="url(#deskTop)" />
      <rect x="-60" y="782" width="1560" height="6" fill="var(--violet)" opacity="0.2" />
      {/* wood grain */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={-60 + i * 420} y={812 + i * 22} width={520} height="2" rx="1" fill="var(--mid-lift)" opacity="0.18" />
      ))}

      {/* ---------- keyboard ---------- */}
      <g>
        <rect x="516" y="700" width="348" height="72" rx="12" fill="var(--mid)" />
        <rect x="516" y="700" width="348" height="6" rx="3" fill="var(--mid-lift)" opacity="0.7" />
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 13 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={528 + c * 25}
              y={712 + r * 14}
              width="19"
              height="10"
              rx="2.5"
              fill="var(--mid-lift)"
              opacity={r === 3 && c > 2 && c < 9 ? 0.95 : 0.7}
            />
          )),
        )}
        {/* keycap backlight spill */}
        <rect x="522" y="706" width="336" height="62" rx="10" fill="var(--violet)" opacity="0.07" />
      </g>

      {/* ---------- mouse ---------- */}
      <g>
        <path d="M898 712 q30 0 30 24 v18 q0 20 -30 20 q-30 0 -30 -20 v-18 q0 -24 30 -24 z" fill="var(--mid)" />
        <line x1="898" y1="716" x2="898" y2="734" stroke="var(--mid-lift)" strokeWidth="3" />
      </g>

      {/* ---------- mug with steam ---------- */}
      <g>
        <path d="M416 696 h74 v56 a14 14 0 0 1 -14 14 h-46 a14 14 0 0 1 -14 -14 z" fill="var(--mid)" />
        <path d="M490 710 h20 a20 20 0 0 1 0 40 h-20" fill="none" stroke="var(--mid)" strokeWidth="10" />
        <ellipse cx="453" cy="696" rx="37" ry="9" fill="var(--orange)" opacity="0.35" />
        <path d="M440 676 q10 -16 0 -30" stroke="var(--text)" strokeWidth="3" fill="none" opacity="0.16" strokeLinecap="round" />
        <path d="M458 672 q12 -20 0 -38" stroke="var(--text)" strokeWidth="3" fill="none" opacity="0.12" strokeLinecap="round" />
      </g>

      {/* ---------- notebook + pen ---------- */}
      <g transform="rotate(-6 320 740)">
        <rect x="252" y="706" width="136" height="94" rx="8" fill="var(--mid-deep)" stroke="var(--mid-lift)" strokeWidth="3" />
        <line x1="286" y1="706" x2="286" y2="800" stroke="var(--mid-lift)" strokeWidth="2" opacity="0.6" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="300" y={724 + i * 18} width={i % 2 ? 44 : 68} height="6" rx="3" fill="var(--text)" opacity="0.14" />
        ))}
      </g>
      <rect x="336" y="796" width="94" height="8" rx="4" fill="var(--orange)" opacity="0.6" transform="rotate(-10 336 796)" />

      {/* ---------- plant, right ---------- */}
      <g>
        <path d="M1244 782 h96 l-12 -74 h-72 z" fill="var(--mid)" />
        <rect x="1238" y="694" width="108" height="18" rx="6" fill="var(--mid-lift)" />
        <path d="M1292 694 q-6 -70 -46 -104" stroke="var(--violet)" strokeWidth="5" fill="none" opacity="0.45" strokeLinecap="round" />
        <path d="M1292 694 q4 -80 44 -110" stroke="var(--violet)" strokeWidth="5" fill="none" opacity="0.35" strokeLinecap="round" />
        <path d="M1292 694 q-2 -50 6 -92" stroke="var(--violet)" strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round" />
        <ellipse cx="1244" cy="586" rx="22" ry="12" fill="var(--violet)" opacity="0.35" transform="rotate(-32 1244 586)" />
        <ellipse cx="1338" cy="580" rx="22" ry="12" fill="var(--violet)" opacity="0.3" transform="rotate(28 1338 580)" />
        <ellipse cx="1300" cy="596" rx="18" ry="10" fill="var(--violet)" opacity="0.4" />
      </g>

      {/* ---------- headphones hooked under the desk edge ---------- */}
      <g transform="translate(1040 692)">
        <path d="M0 44 a44 44 0 0 1 88 0" fill="none" stroke="var(--mid-lift)" strokeWidth="8" strokeLinecap="round" />
        <rect x="-10" y="40" width="22" height="34" rx="9" fill="var(--mid)" />
        <rect x="76" y="40" width="22" height="34" rx="9" fill="var(--mid)" />
      </g>
    </svg>
  )
}
