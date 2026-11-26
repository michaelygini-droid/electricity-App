import type { Appliance } from '../core/types'
import { applianceKwhPerDay, costForKwh, dailyHours } from '../core/energy'
import { formatKwh, formatRupiah } from '../core/format'
import { formatHHMM } from '../core/time'
import { useI18n } from '../i18n'
import { HoursSlider } from './HoursSlider'
import { NumberField } from './NumberField'
import { TimeRanges, fmtHours } from './TimeRanges'
import type { Tariff } from '../core/types'

interface Props {
  item: Appliance
  tariff: Tariff
  editing: boolean
  onToggleEdit: () => void
  onChange: (patch: Partial<Appliance>) => void
  onDelete: () => void
  compact?: boolean
}

export function ApplianceCard({ item, tariff, editing, onToggleEdit, onChange, onDelete, compact = false }: Props) {
  const { t, lang } = useI18n()
  const kwh = applianceKwhPerDay(item)
  const cost = costForKwh(kwh, tariff)
  const hours = dailyHours(item)

  return (
    <article className={`bg-surface ${compact ? 'rounded-xl px-3 py-2' : 'rounded-2xl p-4'}`}>
      {/* Summary row */}
      <div className="flex items-start gap-3">
        <button onClick={onToggleEdit} className="min-w-0 flex-1 text-left">
          <h3 className={`truncate font-semibold ${compact ? 'text-sm' : 'text-lg'}`}>{item.name || '—'}</h3>
          <p className={`text-muted tabular-nums ${compact ? 'text-xs' : 'text-sm'}`}>
            {item.quantity > 1 && `${item.quantity} × `}{item.watts} W · {fmtHours(hours, lang)} {t.hoursShort}
          </p>
        </button>
        <div className="text-right">
          <p className={`font-bold text-cost tabular-nums ${compact ? 'text-sm' : 'text-lg'}`}>{formatRupiah(cost)}<span className="text-xs font-normal text-muted">{t.perDay}</span></p>
          <p className={`text-muted tabular-nums ${compact ? 'text-xs' : 'text-sm'}`}>{formatKwh(kwh, lang)} kWh</p>
        </div>
      </div>

      {/* Always-visible quick control */}
      {item.mode === 'hours' ? (
        <div className={compact ? '-my-1' : 'mt-2'}><HoursSlider value={item.hoursPerDay} onChange={(v) => onChange({ hoursPerDay: v })} compact={compact} /></div>
      ) : !editing && (
        <button onClick={onToggleEdit} className={`flex flex-wrap gap-2 ${compact ? 'mt-2' : 'mt-3'}`}>
          {item.ranges.map((r, i) => (
            <span key={i} className={`rounded-lg bg-surface-2 px-2.5 py-1 tabular-nums ${compact ? 'text-xs' : 'text-sm'}`}>
              {formatHHMM(r.start)} → {formatHHMM(r.end)}{r.end < r.start && <sup className="ml-0.5 text-muted">+1</sup>}
            </span>
          ))}
        </button>
      )}

      {/* Details editor */}
      {editing && (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <label className="block">
            <span className="mb-1 block text-xs text-muted">{t.name}</span>
            <input
              value={item.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder={t.namePlaceholder}
              className="w-full rounded-xl bg-surface-2 px-3 py-2.5 text-lg outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="mb-1 block text-xs text-muted">{t.watts}</span>
              <NumberField value={item.watts} onChange={(v) => onChange({ watts: v })} max={100000} suffix="W" label={t.watts} decimals={1} />
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted">{t.quantity}</span>
              <NumberField value={item.quantity} onChange={(v) => onChange({ quantity: Math.round(v) })} min={1} max={999} label={t.quantity} decimals={0} />
            </div>
          </div>

          <div>
            <span className="mb-1 block text-xs text-muted">{t.usage}</span>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
              {(['hours', 'ranges'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onChange(
                    m === 'ranges' && item.ranges.length === 0
                      ? { mode: m, ranges: [{ start: 8 * 60, end: 8 * 60 + Math.round(item.hoursPerDay * 60) }] }
                      : m === 'hours' ? { mode: m, hoursPerDay: Math.round(hours * 4) / 4 } : { mode: m },
                  )}
                  className={`rounded-lg py-2.5 text-sm font-medium ${item.mode === m ? 'bg-accent text-bg' : 'text-muted'}`}
                >
                  {m === 'hours' ? t.modeHours : t.modeRanges}
                </button>
              ))}
            </div>
          </div>

          {item.mode === 'ranges' && <TimeRanges ranges={item.ranges} onChange={(r) => onChange({ ranges: r })} />}

          <div className="flex gap-2 pt-1">
            <button onClick={onDelete} className="flex-1 rounded-xl border border-line py-3 font-medium text-cost active:bg-surface-2">
              {t.delete}
            </button>
            <button onClick={onToggleEdit} className="flex-1 rounded-xl bg-accent py-3 font-semibold text-bg active:opacity-80">
              {t.done}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
