import type { TimeRange } from '../core/types'
import { formatHHMM, parseHHMM, rangesToHours } from '../core/time'
import { useI18n } from '../i18n'

/** List of "From → To" clock ranges. A range can run past midnight. */
export function TimeRanges({ ranges, onChange }: { ranges: TimeRange[]; onChange: (r: TimeRange[]) => void }) {
  const { t, lang } = useI18n()
  const set = (i: number, patch: Partial<TimeRange>) =>
    onChange(ranges.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  // Shows the time as a big 24-hour "09:30". An invisible native time input sits
  // on top, so a tap opens the phone's own time picker.
  const timeInput = (value: number, label: string, apply: (m: number) => void) => (
    <label className="min-w-0 flex-1">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <span className="relative block rounded-xl bg-surface-2 py-2.5 text-center text-lg font-semibold tabular-nums focus-within:ring-2 focus-within:ring-accent">
        {formatHHMM(value)}
        <input
          type="time"
          aria-label={label}
          value={formatHHMM(value)}
          onChange={(e) => { const m = parseHHMM(e.target.value); if (m !== null) apply(m) }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </span>
    </label>
  )

  return (
    <div className="space-y-2">
      {ranges.map((r, i) => (
        <div key={i} className="flex items-end gap-2">
          {timeInput(r.start, t.from, (m) => set(i, { start: m }))}
          <span className="pb-3 text-muted">→</span>
          {timeInput(r.end, t.to, (m) => set(i, { end: m }))}
          <button
            onClick={() => onChange(ranges.filter((_, j) => j !== i))}
            aria-label={t.removeRange}
            className="mb-0.5 grid h-11 w-9 shrink-0 place-items-center rounded-xl text-muted active:bg-surface-2"
          >
            ✕
          </button>
        </div>
      ))}
      {ranges.some((r) => r.end < r.start) && (
        <p className="text-xs text-muted">↪ {t.to} = {t.nextDay}</p>
      )}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            // New range starts where the last one ends, 1 hour long, so it doesn't overlap.
            const last = ranges[ranges.length - 1]
            const start = last ? last.end : 8 * 60
            onChange([...ranges, { start, end: (start + 60) % 1440 }])
          }}
          className="rounded-xl px-3 py-2 text-sm font-medium text-accent active:bg-surface-2"
        >
          + {t.addRange}
        </button>
        <span className="text-sm text-muted">
          {t.total}: <b className="text-text tabular-nums">{fmtHours(rangesToHours(ranges), lang)}</b> {t.hoursShort}
        </span>
      </div>
    </div>
  )
}

export function fmtHours(h: number, lang: 'en' | 'id' = 'en'): string {
  const s = String(Number(h.toFixed(2)))
  return lang === 'id' ? s.replace('.', ',') : s
}
