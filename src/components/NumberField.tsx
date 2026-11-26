import { useEffect, useState } from 'react'
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
}

/**
 * A number box that is friendly on phones: opens the number keyboard,
 * accepts both "2.5" and "2,5", and only applies valid numbers.
 */
export function NumberField({ value, onChange, min = 0, max = Infinity, suffix, label, className = '', decimals = 2 }: Props) {
  const { lang } = useI18n()
  // Indonesian uses a decimal comma: 2,5
  const show = (v: number) => { const s = String(Number(v.toFixed(decimals))); return lang === 'id' ? s.replace('.', ',') : s }
  const [text, setText] = useState(show(value))
  const [focused, setFocused] = useState(false)

  // Follow outside changes (e.g. the slider) while not typing.
  useEffect(() => { if (!focused) setText(show(value)) }, [value, focused, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const commit = (raw: string) => {
    const n = Number(raw.replace(',', '.'))
    if (raw.trim() !== '' && Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)))
  }

  return (
    <label className={`flex items-center rounded-xl bg-surface-2 px-3 focus-within:ring-2 focus-within:ring-accent ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        inputMode="decimal"
        value={text}
        onFocus={(e) => { setFocused(true); e.target.select() }}
        onBlur={() => { setFocused(false); setText(show(value)) }}
        onChange={(e) => { setText(e.target.value); commit(e.target.value) }}
        className="w-full min-w-0 bg-transparent py-2.5 text-right text-lg font-semibold tabular-nums outline-none"
      />
      {suffix && <span className="ml-1 shrink-0 text-sm text-muted">{suffix}</span>}
    </label>
  )
}
