import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { COPY, LANGS, type Copy, type Lang } from './copy'
import { ScrollTrigger } from '../cinema/motion'

const STORAGE_KEY = 'nw.lang'

const isLang = (v: string | null): v is Lang => !!v && (LANGS as readonly string[]).includes(v)

/** Stored choice wins, then the browser's preference, then English. */
function detect(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {
    /* private mode — fall through to the browser preference */
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLang(base)) return base
  }
  return 'en'
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; copy: Copy }

const LangCtx = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* nothing to persist to — the in-memory choice still applies */
    }

    // <title> and meta description track the visible language. Social-share
    // previews (og:*, twitter:*) stay on the static English defaults in
    // index.html — crawlers don't execute JS, so this is purely for users
    // browsing with the tab open / bookmarking mid-session.
    document.title = COPY[lang].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', COPY[lang].meta.description)

    // Copy length differs per language, so every trigger below the fold moves.
    // Wait a frame for React to paint the new text before re-measuring.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const value = useMemo(() => ({ lang, setLang, copy: COPY[lang] }), [lang, setLang])

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

export function useLang() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/** Shorthand for the common case of only needing the strings. */
export const useCopy = () => useLang().copy
