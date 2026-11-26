import { useI18n } from '../i18n'

export type Tab = 'appliances' | 'compare' | 'settings'

const icons: Record<Tab, string> = {
  appliances: 'M13 2 3 14h7l-1 8 10-12h-7l1-8z',
  compare: 'M4 19V9m6 10V5m6 14v-7m4 7H2',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 2h-4l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
}

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const { t } = useI18n()
  const labels: Record<Tab, string> = {
    appliances: t.tabAppliances,
    compare: t.tabCompare,
    settings: t.tabSettings,
  }
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-lg">
        {(Object.keys(labels) as Tab[]).map((key) => {
          const active = key === tab
          return (
            <li key={key} className="flex-1">
              <button
                onClick={() => onChange(key)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  active ? 'text-accent' : 'text-muted'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={icons[key]} />
                </svg>
                {labels[key]}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
