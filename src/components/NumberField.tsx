import { useState } from 'react'
import { useI18n } from '../i18n'

interface Props {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  /** Text shown after the number, e.g. "W". */
  suffix?: string
  label: string
  className?: string
  decimals?: number
  /** Always show all decimals and thousands dots, e.g. 1.444,70 (for prices). */
  money?: boolean
}

/**
 * A number box that is friendly on phones: opens the number keyboard,
 * accepts both "2.5" and "2,5", and only applies valid numbers.
 */
export function NumberField({ value, onChange, min = 0, max = Infinity, suffix, label, className = '', decimals = 2, money = false }: Props) {
  const { lang } = useI18n()
  // Indonesian uses a decimal comma: 2,5
  const show = (v: number) => {
    if (money) return v.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    const s = String(Number(v.toFixed(decimals)))
    return lang === 'id' ? s.replace('.', ',') : s
  }
  // Plain text for editing (no thousands separators).
  const edit = (v: number) => { const s = String(Number(v.toFixed(decimals))); return lang === 'id' ? s.replace('.', ',') : s }
  // While typing we show exactly what was typed; otherwise always the saved value
  // (so outside changes, like the slider or a plan button, show up immediately).
  const [draft, setDraft] = useState<string | null>(null)

  const commit = (raw: string) => {
    const n = Number(raw.replace(',', '.'))
    if (raw.trim() !== '' && Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)))
  }

  return (
    <label className={`flex items-center rounded-xl bg-surface-2 px-3 focus-within:ring-2 focus-within:ring-accent ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        inputMode="decimal"
        value={draft ?? show(value)}
        onFocus={(e) => { setDraft(edit(value)); e.target.select() }}
        onBlur={() => setDraft(null)}
        onChange={(e) => { setDraft(e.target.value); commit(e.target.value) }}
        className="w-full min-w-0 bg-transparent py-2.5 text-right text-lg font-semibold tabular-nums outline-none"
      />
      {suffix && <span className="ml-1 shrink-0 text-sm text-muted">{suffix}</span>}
    </label>
  )
}
