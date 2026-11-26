import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { CumulativePoint } from '../core/compare'
import { formatRupiah, formatRupiahShort, niceStep } from '../core/format'
import { useI18n } from '../i18n'

// Series colours (validated for colour-blind separation on the dark surface).
export const SERIES = { current: '#ef4444', whatIf: '#0ea5e9' }
const SAVE = '#22c55e'
const COST = '#f87171'

const H = 170
const PAD = { top: 12, right: 12, bottom: 22, left: 58 }

/** Cumulative cost of both setups, month by month. Touch/hover shows exact values. */
export function CostChart({ points }: { points: CumulativePoint[] }) {
  const { t, lang } = useI18n()
  const wrap = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(320)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(200, e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const months = points.length - 1
  const maxVal = Math.max(1, ...points.map((p) => Math.max(p.current, p.whatIf)))
  const step = niceStep(maxVal, 4)
  const yMax = Math.ceil(maxVal / step) * step
  const ticks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step)

  const plotW = width - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (m: number) => PAD.left + (months === 0 ? 0 : (m / months) * plotW)
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH

  const line = (key: 'current' | 'whatIf') =>
    points.map((p, i) => `${i ? 'L' : 'M'}${x(p.month).toFixed(1)},${y(p[key]).toFixed(1)}`).join('')
  // Area between the two lines = money saved (green) or extra cost (red).
  const band =
    points.map((p, i) => `${i ? 'L' : 'M'}${x(p.month)},${y(p.current)}`).join('') +
    [...points].reverse().map((p) => `L${x(p.month)},${y(p.whatIf)}`).join('') + 'Z'
  const last = points[points.length - 1]
  const saving = last.saved >= 0

  // X ticks: about 6 labels max.
  const xEvery = Math.max(1, Math.ceil(months / 6))
  const xTicks = points.filter((p) => p.month % xEvery === 0 || p.month === months)

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const m = Math.round(((e.clientX - r.left - PAD.left) / plotW) * months)
    setHover(Math.min(months, Math.max(0, m)))
  }
  const hp = hover !== null ? points[hover] : null

  return (
    <div>
      {/* Legend */}
      <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><i className="inline-block h-0.5 w-4 rounded" style={{ background: SERIES.current }} />{t.currentSetup}</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-0.5 w-4 rounded" style={{ background: SERIES.whatIf }} />{t.whatIfSetup}</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-3 rounded-sm" style={{ background: saving ? SAVE : COST, opacity: 0.35 }} />{saving ? t.saved : t.extraCost}</span>
      </div>

      <div ref={wrap} className="relative">
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={t.cumulativeCost}
          className="block select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {/* grid + y labels */}
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="var(--color-muted)">{formatRupiahShort(v, lang)}</text>
            </g>
          ))}
          {/* x labels */}
          {xTicks.map((p) => (
            <text key={p.month} x={x(p.month)} y={H - 6} textAnchor="middle" fontSize={10} fill="var(--color-muted)">{p.month}</text>
          ))}

          <path d={band} fill={saving ? SAVE : COST} opacity={0.18} />
          <path d={line('current')} fill="none" stroke={SERIES.current} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={line('whatIf')} fill="none" stroke={SERIES.whatIf} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* end dots */}
          {(['current', 'whatIf'] as const).map((k) => (
            <circle key={k} cx={x(last.month)} cy={y(last[k])} r={4} fill={SERIES[k]} stroke="var(--color-surface)" strokeWidth={2} />
          ))}

          {/* hover crosshair */}
          {hp && (
            <g>
              <line x1={x(hp.month)} x2={x(hp.month)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--color-muted)" strokeWidth={1} />
              {(['current', 'whatIf'] as const).map((k) => (
                <circle key={k} cx={x(hp.month)} cy={y(hp[k])} r={5} fill={SERIES[k]} stroke="var(--color-surface)" strokeWidth={2} />
              ))}
            </g>
          )}
        </svg>

        {hp && (
          <div
            className="pointer-events-none absolute top-1 z-10 w-44 rounded-xl border border-line bg-bg/95 p-2.5 text-xs shadow-lg"
            style={x(hp.month) > width / 2 ? { left: Math.max(0, x(hp.month) - 188) } : { left: Math.min(width - 176, x(hp.month) + 12) }}
          >
            <p className="mb-1 font-semibold">{t.month} {hp.month}</p>
            <Row color={SERIES.current} label={t.current} value={formatRupiah(hp.current)} />
            <Row color={SERIES.whatIf} label={t.whatIf} value={formatRupiah(hp.whatIf)} />
            <div className="mt-1 flex justify-between border-t border-line pt-1">
              <span className="text-muted">{hp.saved >= 0 ? t.saved : t.extraCost}</span>
              <b className={hp.saved >= 0 ? 'text-save' : 'text-cost'}>{formatRupiah(Math.abs(hp.saved))}</b>
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-[10px] text-muted">{t.month}</p>
    </div>
  )
}

function Row({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted"><i className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
