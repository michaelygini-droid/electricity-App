import { NumberField } from './NumberField'
import { useI18n } from '../i18n'

/** Drag slider (0–24 h, 15-minute steps) with a number box beside it. */
export function HoursSlider({ value, onChange, compact = false }: { value: number; onChange: (v: number) => void; compact?: boolean }) {
  const { t } = useI18n()
  const fill = `${(value / 24) * 100}%`
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <input
        type="range"
        min={0}
        max={24}
        step={0.25}
        value={value}
        aria-label={t.hoursPerDay}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`slider flex-1 ${compact ? 'slider-sm' : ''}`}
        style={{ ['--fill' as string]: fill }}
      />
      <NumberField value={value} onChange={onChange} min={0} max={24} suffix="h" label={t.hoursPerDay} className={compact ? 'w-16' : 'w-24'} compact={compact} />
    </div>
  )
}
