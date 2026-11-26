import { useEffect, useRef, useState } from 'react'
import type { Appliance, Tariff } from '../core/types'
import { applianceKwhPerDay, effectivePrice, summarize } from '../core/energy'
import { formatKwh, formatRupiah } from '../core/format'
import { useI18n } from '../i18n'

interface Props {
  items: Appliance[]
  tariff: Tariff
  onEditRate: () => void
}

/** Big live totals, plus a slim bar that stays pinned at the top while scrolling. */
export function TotalsCard({ items, tariff, onEditRate }: Props) {
  const { t, lang } = useI18n()
  const s = summarize(items, tariff)
  const ref = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)

  // Show the slim bar once the big card has scrolled out of view.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setPinned(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const biggest = items
    .map((a) => ({ a, kwh: applianceKwhPerDay(a) }))
    .sort((x, y) => y.kwh - x.kwh)[0]
  const share = biggest && s.kwhDay > 0 ? Math.round((biggest.kwh / s.kwhDay) * 100) : 0
  const price = effectivePrice(tariff)

  return (
    <>
      <section ref={ref} className="mb-4 rounded-3xl bg-surface p-5" aria-live="polite">
        <p className="text-sm text-muted">{t.perMonth}</p>
        <p className="text-[clamp(2rem,11vw,3rem)] leading-tight font-extrabold tracking-tight text-cost tabular-nums">{formatRupiah(s.costMonth)}</p>
        <p className="mt-1 text-lg text-muted tabular-nums">
          <span className="font-semibold text-text">{formatRupiah(s.costDay)}</span> {t.perDayLong}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-2 p-3">
            <p className="text-xs text-muted">{t.energy} {t.perDayLong}</p>
            <p className="text-2xl font-bold tabular-nums">{formatKwh(s.kwhDay, lang)} <span className="text-sm font-normal text-muted">kWh</span></p>
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <p className="text-xs text-muted">{t.energy} {t.perMonth}</p>
            <p className="text-2xl font-bold tabular-nums">{formatKwh(s.kwhMonth, lang)} <span className="text-sm font-normal text-muted">kWh</span></p>
          </div>
        </div>

        {biggest && biggest.kwh > 0 && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm">
              <span className="truncate text-muted">{t.biggestUser}: <span className="text-text">{biggest.a.name}</span></span>
              <span className="shrink-0 tabular-nums">{share}% {t.ofTotal}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-cost transition-[width] duration-200" style={{ width: `${share}%` }} />
            </div>
          </div>
        )}

        <button onClick={onEditRate} className="mt-4 flex w-full items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm active:bg-surface-2">
          <span className="text-muted">
            {t.rateNote}: <span className="text-text tabular-nums">{formatRupiahPrice(price)}/kWh</span>
            {tariff.ppjOn && tariff.ppjPercent > 0 && <span> ({t.inclPpj} {String(tariff.ppjPercent).replace('.', lang === 'id' ? ',' : '.')}%)</span>}
          </span>
          <span className="font-medium text-accent">{t.editRate} ›</span>
        </button>
      </section>

      {/* Slim pinned bar */}
      <div
        className={`fixed inset-x-0 top-0 z-10 border-b border-line bg-surface/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-transform duration-200 ${pinned ? 'translate-y-0' : '-translate-y-full'}`}
        aria-hidden={!pinned}
      >
        <div className="mx-auto flex max-w-lg items-baseline justify-between px-4 py-2.5">
          <span className="text-xl font-bold text-cost tabular-nums">{formatRupiah(s.costMonth)}<span className="text-sm font-normal text-muted">{t.monthShort}</span></span>
          <span className="text-sm text-muted tabular-nums">{formatKwh(s.kwhDay, lang)} kWh{t.perDay}</span>
        </div>
      </div>
    </>
  )
}

/** Rupiah with 2 decimals, for the per-kWh price (Rp 1.444,70). */
function formatRupiahPrice(v: number): string {
  return `Rp ${v.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
