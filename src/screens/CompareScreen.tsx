import { useEffect, useRef, useState } from 'react'
import { cumulativeCost } from '../core/compare'
import { summarize } from '../core/energy'
import { formatRupiah } from '../core/format'
import { CostChart, SERIES } from '../components/CostChart'
import { ApplianceList } from '../components/ApplianceList'
import { useStore } from '../state/store'
import type { ListKey } from '../state/model'
import { useI18n } from '../i18n'
import { load, save } from '../state/storage'
import { newId } from '../core/presets'

export function CompareScreen() {
  const { data, dispatch } = useStore()
  const { t } = useI18n()
  const [months, setMonths] = useState(() => load<number>('horizon', 12))
  const [list, setList] = useState<ListKey>('whatIf')

  const setHorizon = (m: number) => { setMonths(m); save('horizon', m) }

  // On shorter screens the chart panel scrolls away; then a slim bar stays pinned.
  const panel = useRef<HTMLElement>(null)
  const [panelHidden, setPanelHidden] = useState(false)
  useEffect(() => {
    const el = panel.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setPanelHidden(e.intersectionRatio < 0.35), { threshold: [0, 0.35, 1] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const cur = summarize(data.current, data.tariff)
  const wi = summarize(data.whatIf, data.tariff)
  const perMonth = cur.costMonth - wi.costMonth
  const total = perMonth * months
  const saving = perMonth >= 0
  const same = Math.abs(perMonth) < 0.5
  const points = cumulativeCost(data.current, data.whatIf, data.tariff, months)

  const copyCurrent = () => {
    if (!confirm(t.copyConfirm)) return
    dispatch({ type: 'replaceList', list: 'whatIf', items: data.current.map((a) => ({ ...a, id: newId(), ranges: a.ranges.map((r) => ({ ...r })) })) })
  }

  return (
    <div>
      {/* Always-on chart panel. Pinned to the top on screens tall enough for it. */}
      <section ref={panel} className="-mx-4 mb-3 bg-bg px-4 pb-2 [@media(min-height:900px)]:sticky [@media(min-height:900px)]:top-0 [@media(min-height:900px)]:z-10 [@media(min-height:900px)]:pt-[env(safe-area-inset-top)]">
        <div className="rounded-3xl bg-surface p-4">
          {/* Headline */}
          {same ? (
            <p className="py-2 text-lg font-semibold text-muted">{t.sameCost}</p>
          ) : (
            <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <p className="text-xs text-muted">{saving ? t.totalSavedOver : t.totalExtraOver} {months} {t.months}</p>
                <p className={`text-[clamp(1.75rem,9vw,2.5rem)] leading-tight font-extrabold tracking-tight whitespace-nowrap tabular-nums ${saving ? 'text-save' : 'text-cost'}`}>
                  {formatRupiah(Math.abs(total))}
                </p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="text-xs text-muted">{saving ? t.savedPerMonth : t.costsMorePerMonth}</p>
                <p className={`text-lg font-bold tabular-nums ${saving ? 'text-save' : 'text-cost'}`}>{formatRupiah(Math.abs(perMonth))}</p>
              </div>
            </div>
          )}

          <div className="mt-3">
            <CostChart points={points} />
          </div>

          {/* Horizon slider */}
          <div className="mt-1 flex items-center gap-3">
            <span className="shrink-0 text-xs text-muted">{t.horizon}</span>
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={months}
              onChange={(e) => setHorizon(Number(e.target.value))}
              aria-label={`${t.horizon} (${t.months})`}
              className="slider slider-sm flex-1"
              style={{ ['--fill' as string]: `${((months - 1) / 23) * 100}%` }}
            />
            <span className="shrink-0 text-right text-sm font-semibold whitespace-nowrap tabular-nums">{months} {t.months}</span>
          </div>
        </div>
      </section>

      {/* Slim pinned bar while the chart is scrolled away (phones) */}
      <div
        className={`fixed inset-x-0 top-0 z-10 border-b border-line bg-surface/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-transform duration-200 [@media(min-height:900px)]:hidden ${panelHidden ? 'translate-y-0' : '-translate-y-full'}`}
        aria-hidden={!panelHidden}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-2 tabular-nums">
          <span className="min-w-0 text-xs leading-tight text-muted">
            {same ? t.sameCost : <>{saving ? t.saved : t.extraCost}<br />{months} {t.months}</>}
          </span>
          {!same && (
            <span className="shrink-0 text-right leading-tight">
              <span className={`block text-lg font-bold whitespace-nowrap ${saving ? 'text-save' : 'text-cost'}`}>{formatRupiah(Math.abs(total))}</span>
              <span className="block text-xs whitespace-nowrap text-muted">{formatRupiah(Math.abs(perMonth))}{t.monthShort}</span>
            </span>
          )}
        </div>
      </div>

      {/* Monthly cost of each setup + list switcher */}
      <div className="mb-3 grid grid-cols-2 gap-2" role="tablist">
        {(['current', 'whatIf'] as const).map((k) => {
          const s = k === 'current' ? cur : wi
          const active = list === k
          return (
            <button
              key={k}
              role="tab"
              aria-selected={active}
              onClick={() => setList(k)}
              className={`rounded-2xl p-3 text-left transition-colors ${active ? 'bg-surface ring-2' : 'bg-surface/50'}`}
              style={active ? { ['--tw-ring-color' as string]: SERIES[k] } : undefined}
            >
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <i className="inline-block h-2 w-2 rounded-full" style={{ background: SERIES[k] }} />
                {k === 'current' ? t.currentSetup : t.whatIfSetup} ({data[k].length})
              </span>
              <span className="block text-[clamp(0.95rem,4.6vw,1.125rem)] font-bold whitespace-nowrap tabular-nums">{formatRupiah(s.costMonth)}<span className="text-xs font-normal text-muted">{t.monthShort}</span></span>
            </button>
          )
        })}
      </div>

      <p className="mb-2 px-1 text-xs text-muted">{list === 'current' ? t.currentNote : t.whatIfNote}</p>
      <ApplianceList key={list} list={list} compact />

      {list === 'whatIf' && (
        <button onClick={copyCurrent} className="mt-3 w-full rounded-xl py-3 text-sm text-muted active:bg-surface">
          ⧉ {t.copyFromCurrent}
        </button>
      )}
    </div>
  )
}
