import { Card } from '../components/Card'
import { useI18n } from '../i18n'

export function AppliancesScreen() {
  const { t } = useI18n()
  return (
    <Card>
      <p>{t.appliancesIntro}</p>
      <p className="mt-2 text-sm text-muted">{t.comingSoon}</p>
    </Card>
  )
}
