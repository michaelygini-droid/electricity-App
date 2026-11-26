import type { Appliance, Tariff } from '../core/types'
import { summarize } from '../core/energy'
import { formatKwh, formatRupiah } from '../core/format'
import { useI18n } from '../i18n'

/** Small one-line total shown under the list. */
export function TotalsFooter({ items, tariff }: { items: Appliance[]; tariff: Tariff }) {
  const { t, lang } = useI18n()
  const s = summarize(items, tariff)
  return (
    <div className="mt-3 rounded-xl bg-surface px-3 py-2 text-xs tabular-nums">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-muted">{t.total} ({items.length})</span>
        <span>
          <b className="text-cost">{formatRupiah(s.costDay)}</b><span className="text-muted">{t.perDay}</span>
          <span className="mx-1.5 text-line">|</span>
          <b className="text-cost">{formatRupiah(s.costMonth)}</b><span className="text-muted">{t.monthShort}</span>
        </span>
      </div>
      <div className="flex justify-end gap-2 text-muted">
        <span><b className="text-text">{formatKwh(s.kwhDay, lang)}</b> kWh{t.perDay}</span>
        <span className="text-line">|</span>
        <span><b className="text-text">{formatKwh(s.kwhMonth, lang)}</b> kWh{t.monthShort}</span>
      </div>
    </div>
  )
}
