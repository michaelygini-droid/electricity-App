import { ApplianceList } from '../components/ApplianceList'
import { TotalsCard } from '../components/TotalsCard'
import { TotalsFooter } from '../components/TotalsFooter'
import { useStore } from '../state/store'

export function AppliancesScreen({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { data } = useStore()
  return (
    <>
      <TotalsCard items={data.current} tariff={data.tariff} onEditRate={onOpenSettings} />
      <ApplianceList list="current" />
      <TotalsFooter items={data.current} tariff={data.tariff} />
    </>
  )
}
