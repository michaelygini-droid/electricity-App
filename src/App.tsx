import { useState } from 'react'
import { TabBar, type Tab } from './components/TabBar'
import { AppliancesScreen } from './screens/AppliancesScreen'
import { CompareScreen } from './screens/CompareScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { useI18n } from './i18n'
import { load, save } from './state/storage'

export default function App() {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>(() => load<Tab>('tab', 'appliances'))
  const change = (next: Tab) => { setTab(next); save('tab', next) }

  const titles: Record<Tab, string> = {
    appliances: t.tabAppliances,
    compare: t.tabCompare,
    settings: t.tabSettings,
  }

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-28">
      <header className="mb-4 flex items-center gap-2">
        <span className="text-2xl text-accent">⚡</span>
        <h1 className="text-2xl font-bold">{titles[tab]}</h1>
      </header>
      <main className="flex-1">
        {tab === 'appliances' && <AppliancesScreen />}
        {tab === 'compare' && <CompareScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </main>
      <TabBar tab={tab} onChange={change} />
    </div>
  )
}
