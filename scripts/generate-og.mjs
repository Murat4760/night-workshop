// One-shot SVG -> PNG rasterizer for the social share image.
// Re-run with `npm run og` whenever scripts/og-source.svg changes.
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(join(dir, 'og-source.svg'), 'utf8')

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
})

const png = resvg.render().asPng()
writeFileSync(join(dir, '..', 'public', 'og.png'), png)
console.log('wrote public/og.png —', png.byteLength, 'bytes')
