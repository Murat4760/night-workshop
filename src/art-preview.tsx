import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CityArt, RoomArt, DeskArt } from './cinema/art/SceneArt'
import { DeviceArt } from './cinema/art/DeviceArt'
import { BriefIcon, BuildIcon, ShipIcon } from './cinema/art/ProcessArt'
import './styles/tokens.css'
import './styles/base.css'
import './styles/beats.css'
import './styles/preview.css'

/**
 * ASSET CONTACT SHEET — every illustration layer, isolated and composited.
 * Dev-only review page; not part of the production build. Open /art-preview.html
 */
function Preview() {
  return (
    <main className="pv">
      <header className="pv__head">
        <h1 className="display">Night workshop — asset sheet</h1>
        <p>
          Inline SVG, tinted entirely by the CSS variables. Each layer is isolated below, then
          composited at the bottom in the same stacking order the hero uses.
        </p>
      </header>

      <section className="pv__grid">
        <figure className="pv__cell">
          <div className="pv__stage pv__stage--wide">
            <CityArt />
          </div>
          <figcaption>
            <b>CityArt</b> — hero depth 0.25
          </figcaption>
        </figure>

        <figure className="pv__cell">
          <div className="pv__stage pv__stage--wide">
            <RoomArt />
          </div>
          <figcaption>
            <b>RoomArt</b> — hero depth 0.5
          </figcaption>
        </figure>

        <figure className="pv__cell">
          <div className="pv__stage pv__stage--wide">
            <DeskArt />
          </div>
          <figcaption>
            <b>DeskArt</b> — hero depth 0.95 · carries the mouse tilt
          </figcaption>
        </figure>

        <figure className="pv__cell">
          <div className="pv__stage">
            <DeviceArt />
          </div>
          <figcaption>
            <b>DeviceArt</b> — beat 3
          </figcaption>
        </figure>

        <figure className="pv__cell">
          <div className="pv__stage pv__stage--icons">
            <BriefIcon />
            <BuildIcon />
            <ShipIcon />
          </div>
          <figcaption>
            <b>ProcessArt</b> — beat 4 · brief / build / ship
          </figcaption>
        </figure>
      </section>

      <section className="pv__composite">
        <h2 className="display">Composited — the hero as it stacks</h2>
        <div className="pv__scene">
          <div className="layer layer--city">
            <div className="layer__inner">
              <CityArt />
            </div>
          </div>
          <div className="layer layer--room">
            <div className="layer__inner">
              <RoomArt />
            </div>
          </div>
          <div className="layer layer--desk">
            <div className="layer__inner">
              <DeskArt />
            </div>
          </div>
          <div className="hero__vignette" style={{ opacity: 0.55 }} />
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
