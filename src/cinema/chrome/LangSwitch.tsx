import { LANGS, LANG_LABEL, LANG_NAME } from '../../i18n/copy'
import { useLang } from '../../i18n/lang'

export function LangSwitch() {
  const { lang, setLang, copy } = useLang()

  return (
    <div className="langs" role="group" aria-label={copy.langSwitch}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className="langs__btn"
          data-active={l === lang}
          aria-pressed={l === lang}
          title={LANG_NAME[l]}
          data-hover
          onClick={() => setLang(l)}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  )
}
