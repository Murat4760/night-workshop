// One-shot favicon.svg -> PNG rasterizer for apple-touch-icon + a raster fallback.
// Re-run with `npm run icons` whenever public/favicon.svg changes.
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
const pub = join(dir, '..', 'public')
const svg = readFileSync(join(pub, 'favicon.svg'), 'utf8')

for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-512.png', 512],
]) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  writeFileSync(join(pub, name), resvg.render().asPng())
  console.log('wrote public/' + name)
}
