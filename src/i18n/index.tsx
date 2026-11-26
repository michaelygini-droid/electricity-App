import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, type Dict } from './en'
import { id } from './id'
import { load, save } from '../state/storage'

export type Lang = 'en' | 'id'
const dicts: Record<Lang, Dict> = { en, id }

function defaultLang(): Lang {
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en'
}

interface I18n { lang: Lang; setLang: (l: Lang) => void; t: Dict }
const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => load<Lang>('lang', defaultLang()))
  useEffect(() => {
    save('lang', lang)
    document.documentElement.lang = lang
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</Ctx.Provider>
}

export function useI18n(): I18n {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n must be used inside I18nProvider')
  return v
}
