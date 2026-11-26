import { PLN_PLANS, TARIFF_PERIOD, JAKARTA_PPJ, planByKey } from '../core/tariff'
import { effectivePrice } from '../core/energy'
import { useStore } from '../state/store'
import { useI18n } from '../i18n'
import { Card } from './Card'
import { NumberField } from './NumberField'
import { Toggle } from './Toggle'

const rp2 = (v: number) => `Rp ${v.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function TariffSettings() {
  const { data, dispatch } = useStore()
  const { t, lang } = useI18n()
  const tariff = data.tariff
  const plan = planByKey(tariff.plan)
  const set = (patch: Partial<typeof tariff>) => dispatch({ type: 'setTariff', patch })
  const differsFromPlan = !plan || Math.abs(plan.rate - tariff.pricePerKwh) > 0.001

  return (
    <>
      {/* Price */}
      <Card>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-semibold">{t.pricePerKwh}</h2>
          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">✎ {t.editable}</span>
        </div>
        <p className="mb-3 text-sm text-muted">{t.priceHint}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg text-muted">Rp</span>
          <NumberField
            value={tariff.pricePerKwh}
            onChange={(v) => set({ pricePerKwh: v })}
            max={100000}
            suffix="/kWh"
            label={t.pricePerKwh}
            money
            className="flex-1 ring-1 ring-accent/40"
          />
        </div>
                {differsFromPlan && plan && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-accent">✎ {t.customPrice}</span>
            <button onClick={() => set({ pricePerKwh: plan.rate })} className="rounded-lg px-2 py-1 font-medium text-accent active:bg-surface-2">
              ↺ {t.resetToPln} ({rp2(plan.rate)})
            </button>
          </div>
        )}
      </Card>

      {/* Plan quick picks */}
      <Card>
        <h2 className="font-semibold">{t.yourPlan}</h2>
        <p className="mb-3 text-sm text-muted">{t.ratesFrom} {TARIFF_PERIOD[lang]}. {t.ratesNote}</p>
        <div className="grid grid-cols-2 gap-2">
          {PLN_PLANS.map((p) => {
            const active = tariff.plan === p.key
            return (
              <button
                key={p.key}
                onClick={() => set({ plan: p.key, pricePerKwh: p.rate })}
                aria-pressed={active}
                className={`rounded-xl px-3 py-2.5 text-left transition-colors ${active ? 'bg-accent text-bg' : 'bg-surface-2'}`}
              >
                <span className="block font-semibold">{p.va}</span>
                <span className={`block text-xs tabular-nums ${active ? 'text-bg/80' : 'text-muted'}`}>
                  {rp2(p.rate)}{p.subsidised && ` · ${t.subsidised}`}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* PPJ */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{t.ppjTitle}</h2>
          <Toggle on={tariff.ppjOn} onChange={(v) => set({ ppjOn: v })} label={t.ppjTitle} />
        </div>
        <p className="mt-1 text-sm text-muted">{t.ppjHint}</p>
        {tariff.ppjOn && (
          <div className="mt-3 flex items-center gap-2">
            <NumberField value={tariff.ppjPercent} onChange={(v) => set({ ppjPercent: v })} max={100} suffix="%" label={t.ppjTitle} className="w-32" />
            <button
              onClick={() => set({ ppjPercent: JAKARTA_PPJ })}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium ${tariff.ppjPercent === JAKARTA_PPJ ? 'bg-accent text-bg' : 'bg-surface-2 text-accent'}`}
            >
              {t.ppjJakarta}
            </button>
          </div>
        )}
      </Card>

      {/* Result */}
      <div className="rounded-2xl border border-line px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted">{t.youPay}</span>
          <span className="text-xl font-bold whitespace-nowrap tabular-nums">
            {rp2(effectivePrice(tariff))}<span className="text-sm font-normal text-muted">/kWh</span>
          </span>
        </div>
        {tariff.ppjOn && <p className="text-right text-xs text-muted">{t.inclPpj} {String(tariff.ppjPercent).replace('.', lang === 'id' ? ',' : '.')}%</p>}
      </div>
    </>
  )
}
