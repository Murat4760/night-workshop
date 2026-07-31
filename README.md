# The Night Workshop

Cinematic scroll portfolio — DOM + GSAP/ScrollTrigger + Lenis. No WebGL, no three.js.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
```

## Professional-grade extras

Added on top of the choreography — the parts a portfolio site needs to actually
perform its job (found, shared, accessible, monitored), not just look good.

**SEO & sharing**
- Full head: meta description, canonical, Open Graph + Twitter Card, `robots.txt`, `sitemap.xml`
- JSON-LD `Person` schema
- Real favicon set (`favicon.svg`, `apple-touch-icon.png`, `icon-512.png`) generated from one SVG source via `npm run icons`
- A branded 1200×630 `og.png` generated from `scripts/og-source.svg` via `npm run og` (uses `@resvg/resvg-js` — no external service, re-run whenever the source SVG or copy changes)
- `<title>` and meta description track the active language client-side; social-share previews stay on the static English defaults in `index.html` since crawlers don't execute JS

**Accessibility**
- Skip-to-content link, visible only on keyboard focus
- Deliberate `:focus-visible` ring (violet, not the browser default) — the custom cursor hides the pointer affordance, so focus has to carry more
- Language switch buttons and back-to-top both clear the WCAG 24px minimum tap target

**Monitoring**
- `@vercel/analytics` + `@vercel/speed-insights`, wired at the app root — picked up automatically once deployed on Vercel, no config

**Back to top**
- Appears once the hero scrolls past, uses the same magnetic + cursor-label system as the nav logo and CTA button rather than a one-off component

## Beat map

| # | Beat | Mode | Scroll travel | Key motion |
|---|------|------|---------------|------------|
| 1 | Hero | **pinned** | 150vh | 4 depth layers parallax + scale, masked-line name reveal, mouse tilt |
| 2 | Stack | flow | — | Row entrance (fade + slide, opposing directions) + horizontal drift on scrub |
| 3 | Featured build | **pinned** | 120vh | Device drifts across the whole beat; 4 bullets land one at a time (25/38/63/75%) |
| 4 | Selected work | flow | — | Editorial index; cursor-following thumbnail + per-row spotlight |
| 5 | Numbers & quote | flow | — | Counters count up on entry, single pull quote |
| 6 | Process | flow | — | 3 steps stagger in; connector SVG draws via `strokeDashoffset` on scrub |
| 7 | Contact | flow | — | Masked headline, magnetic button, drifting particles + breathing glows |
| 8 | Footer | flow | — | Static |

Total page ≈ 9.4 viewport heights on desktop.

## The cursor field

One signature, extended — not a pile of separate tricks. `Cursor.tsx` owns a
single `pointermove` listener driving the dot, the trailing ring, and magnetism;
section-local reactions live with their own beats.

| Hook | Where | Effect |
|------|-------|--------|
| `[data-hover]` | anywhere | dot scales up 3.4× |
| `[data-cursor-label="View"]` | work rows | ring expands into a labelled violet pill, dot hides |
| `[data-magnetic]` | logo, CTA button | element leans toward the cursor within 110px, at 34% strength |
| `.wk__row` | beat 4 | `--mx` spotlight tracks the cursor across the row; thumbnail trails it and tilts with horizontal speed |
| `.tag` | beat 2 | tags lift and scale by proximity within 130px |
| `.layer__inner` | hero | the original depth tilt |

**Magnets are measured live, not cached.** Pins, the loader and language switches
all move these after mount, and the element's own applied transform has to be
subtracted from its rect or it chases itself. Two rect reads per move is cheaper
than keeping a cache correct.

Every one of these is gated on `(hover: hover) and (pointer: fine)` plus
no-reduced-motion, so touch and reduced-motion users get none of it.

## Motion contexts

All beats branch through `gsap.matchMedia()` on three conditions in `src/cinema/motion.ts`:

- **`full`** — ≥768px, no motion preference. Pins, full-intensity parallax, mouse tilt, custom cursor.
- **`lite`** — <768px. Nothing pins (beats become normal flow), parallax runs at `INTENSITY.lite` (0.4 — a 60% reduction), entrance animations kept.
- **`reduced`** — `prefers-reduced-motion: reduce`. No Lenis (native scroll), no pins, no parallax, no idle loops, no custom cursor. Fades only.

## Illustration assets

Drawn as inline SVG, not raster — the palette is a locked 5-colour set, the
layers need real alpha, and vector stays crisp at any DPR for a few KB. The
style sheet every asset follows is documented at the top of `SceneArt.tsx`:
palette, 3px structural / 2px detail line weight, cool violet screen light from
below-centre plus warm orange lamp light from the upper left, and 6/10/16 radii.
**Break the light direction or line weight on one prop and the whole scene stops
reading as one illustration.**

| File | Layer |
|------|-------|
| `SceneArt.tsx` → `CityArt` | Hero depth 0.25 — 3-band skyline, lit windows, antennae, water tanks, moon, stars |
| `SceneArt.tsx` → `RoomArt` | Hero depth 0.5 — window + mullions, curtain, hanging lamp + cone, bookshelf, poster |
| `SceneArt.tsx` → `DeskArt` | Hero depth 0.95 — two monitors (editor + design preview), keyboard, mouse, mug, notebook, plant, desk lamp, headphones |
| `Hero.tsx` → `FRAGMENTS` | Hero depth 1.7 — code cards with fake syntax colouring + a deploy toast (DOM, so each keeps its own idle loop) |
| `DeviceArt.tsx` | Beat 3 — laptop + phone showing the restaurant build |
| `ProcessArt.tsx` | Beat 4 — clipboard / editor / rocket |
| `.tag__mark` in `beats.css` | Beat 2 tool logos — still placeholder squares, swap per tool |

Everything is driven by the `--violet` / `--orange` / `--mid*` CSS variables, so
retheming the site retints the illustration with it. To swap any layer for a
raster asset instead, replace the component's `<svg>` with an `<img>` — the
animation code never touches the contents.

## Languages

English, Turkish and Azerbaijani. All copy lives in one typed dictionary,
`src/i18n/copy.ts` — adding a language is one entry plus a `LANGS` element; the
`Copy` type makes a missing string a compile error.

`src/i18n/lang.tsx` holds the provider: stored choice wins, then the browser's
`navigator.languages`, then English. It writes `<html lang>`, persists to
`localStorage`, and calls `ScrollTrigger.refresh()` on the next frame after a
switch — copy length differs per language, so every trigger below the fold moves
and would otherwise fire at the wrong scroll position.

Under 640px the nav's anchor links are hidden and only the logo + language
switch remain: the Turkish and Azerbaijani labels are long enough that all three
plus the switcher overflow a 375px bar.

Depth is declared in markup via `data-depth` — the parallax and mouse-tilt maths
read it, so adding a layer is just another `.layer[data-depth]` block.

### Transform ownership (don't break this)

Three systems animate the hero layers at once and stay off each other's toes:

- entrance → `y` (px) on `.layer`
- scroll scrub → `yPercent` + `scale` on `.layer`
- mouse tilt → `x`/`y` on the child `.layer__inner`

Never set an initial percentage transform in CSS on a GSAP-animated element —
the computed matrix resolves it to px and the tween fights it (this bit the nav).

## Deployment

Source lives at **https://github.com/Murat4760/night-workshop** (`master` is
production). Live at **https://muradguluzade.vercel.app** (Vercel project
`murad`, team `murat4760s-projects`). `nightworkshop.vercel.app`,
`murad-workshop.vercel.app` and `murad-seven.vercel.app` are registered as
proper project **Domains** (not one-off `vercel alias set` pointers — those
don't follow new deploys) tracking Production, so all four move together on
every push. `murad.vercel.app` is held by another Vercel account and can't be
claimed.

The Vercel project is git-connected — **push to `master` and it deploys
itself**, PRs get their own preview URL. No manual `vercel deploy` needed for
normal changes; it's there only for a one-off deploy from an uncommitted state.

```bash
npx vercel deploy --prod   # manual/one-off only — pushing to master is the norm
```

Vercel Authentication is **off** on this project — it's on by default for new
projects and silently 302s every visitor to a Vercel login page. If the site
ever starts redirecting to `vercel.com/sso-api`, that setting got switched back
on (Project Settings → Deployment Protection).

## Dev-only pages

Both are extra Vite entries that the production build ignores (`dist/` only ever
contains `index.html`). Delete either whenever you like.

### `art-preview.html`

Asset contact sheet — every illustration layer isolated on a checkerboard (so
the alpha is visible), then composited in hero stacking order. Open
`http://localhost:5180/art-preview.html` when reviewing or replacing art.

### `qa-motion.html`

Temporary QA harness, excluded from the production build. The headless preview
pane reports `prefers-reduced-motion: reduce`, which masks the desktop and mobile
choreography; this entry point overrides the media query before mount so the real
code paths can be measured. Drive with `?motion=full | lite | reduce`. Delete it
whenever you like.


## Related files (vault graph links)
- Hub: [[3 - Resources/Client Repo READMEs|Client Repo READMEs]]
