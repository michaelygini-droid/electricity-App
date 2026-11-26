import { Card } from '../components/Card'
import { useI18n } from '../i18n'

export function CompareScreen() {
  const { t } = useI18n()
  return (
    <Card>
      <p>{t.compareIntro}</p>
      <p className="mt-2 text-sm text-muted">{t.comingSoon}</p>
    </Card>
  )
}
