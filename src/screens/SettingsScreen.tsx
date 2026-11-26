import { useState } from 'react'
import { Card } from '../components/Card'
import { APP_VERSION, checkForUpdates } from '../pwa'
import { useI18n, type Lang } from '../i18n'

const langs: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
]

export function SettingsScreen() {
  const { t, lang, setLang } = useI18n()
  const [checking, setChecking] = useState(false)
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-muted">{t.language}</h2>
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
      <Card>
        <p>{t.settingsIntro}</p>
        <p className="mt-2 text-sm text-muted">{t.comingSoon}</p>
      </Card>
      <p className="px-1 text-sm text-muted">{t.installHint}</p>
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
    </div>
  )
}
