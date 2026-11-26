import { NumberField } from './NumberField'
import { useI18n } from '../i18n'

/** Drag slider (0–24 h, 15-minute steps) with a number box beside it. */
export function HoursSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useI18n()
  const fill = `${(value / 24) * 100}%`
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={24}
        step={0.25}
        value={value}
        aria-label={t.hoursPerDay}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider flex-1"
        style={{ ['--fill' as string]: fill }}
      />
      <NumberField value={value} onChange={onChange} min={0} max={24} suffix="h" label={t.hoursPerDay} className="w-24" />
    </div>
  )
}
