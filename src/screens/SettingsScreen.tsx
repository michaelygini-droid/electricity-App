import { useState } from 'react'
import { Card } from '../components/Card'
import { TariffSettings } from '../components/TariffSettings'
import { APP_VERSION, checkForUpdates } from '../pwa'
import { useI18n, type Lang } from '../i18n'
import { useStore } from '../state/store'

const langs: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
]

export function SettingsScreen() {
  const { t, lang, setLang } = useI18n()
  const { dispatch } = useStore()
  const [checking, setChecking] = useState(false)

  return (
    <div className="space-y-4">
      <h2 className="px-1 pt-1 text-sm font-semibold tracking-wide text-muted uppercase">{t.tariff}</h2>
      <TariffSettings />

      <h2 className="px-1 pt-3 text-sm font-semibold tracking-wide text-muted uppercase">{t.language}</h2>
      <Card>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-lg py-3 text-sm font-medium transition-colors ${
                lang === l.code ? 'bg-accent text-bg' : 'text-muted'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </Card>

      <h2 className="px-1 pt-3 text-sm font-semibold tracking-wide text-muted uppercase">App</h2>
      <Card className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">{t.version}</p>
          <p className="truncate text-sm tabular-nums">{APP_VERSION}</p>
        </div>
        <button
          onClick={() => { setChecking(true); checkForUpdates() }}
          disabled={checking}
          className="shrink-0 rounded-xl bg-surface-2 px-4 py-3 text-sm font-medium text-accent active:opacity-70"
        >
          {checking ? t.checking : t.checkUpdates}
        </button>
      </Card>
      <button
        onClick={() => { if (confirm(t.resetConfirm)) dispatch({ type: 'reset' }) }}
        className="w-full rounded-2xl border border-line py-3 text-sm text-cost active:bg-surface"
      >
        {t.resetAll}
      </button>
      <p className="px-1 text-sm text-muted">{t.installHint}</p>
    </div>
  )
}
