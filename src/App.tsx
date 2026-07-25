import { useState } from 'react'
import { useSmoothScroll } from './cinema/useSmoothScroll'
import { Loader } from './cinema/chrome/Loader'
import { Nav } from './cinema/chrome/Nav'
import { Cursor } from './cinema/chrome/Cursor'
import { Hero } from './cinema/beats/Hero'
import { Stack } from './cinema/beats/Stack'
import { Featured } from './cinema/beats/Featured'
import { WorkIndex } from './cinema/beats/WorkIndex'
import { Numbers } from './cinema/beats/Numbers'
import { Process } from './cinema/beats/Process'
import { Contact } from './cinema/beats/Contact'
import { Footer } from './cinema/beats/Footer'
import { LangProvider } from './i18n/lang'

function Site() {
  const [ready, setReady] = useState(false)
  useSmoothScroll()

  return (
    <>
      <Cursor />
      {!ready && <Loader onDone={() => setReady(true)} />}
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Stack />
        <Featured />
        <WorkIndex />
        <Numbers />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  )
}
