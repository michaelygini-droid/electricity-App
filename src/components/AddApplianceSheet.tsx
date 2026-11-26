import { useMemo, useState } from 'react'
import { PRESETS, applianceFromPreset, newId } from '../core/presets'
import type { Appliance } from '../core/types'
import { useI18n } from '../i18n'
import { NumberField } from './NumberField'
import { HoursSlider } from './HoursSlider'

/** Bottom panel: custom entry first (the default), then the preset list. */
export function AddApplianceSheet({ onAdd, onClose }: { onAdd: (a: Appliance, openEditor: boolean) => void; onClose: () => void }) {
  const { t, lang } = useI18n()
  const [name, setName] = useState('')
  const [watts, setWatts] = useState(100)
  const [hours, setHours] = useState(1)
  const [query, setQuery] = useState('')

  const presets = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRESETS.filter((p) => !q || p.name.en.toLowerCase().includes(q) || p.name.id.toLowerCase().includes(q))
  }, [query])

  const addCustom = () => {
    onAdd({ id: newId(), name: name.trim() || t.custom, watts, mode: 'hours', hoursPerDay: hours, ranges: [], quantity: 1 }, false)
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-end" role="dialog" aria-modal="true">
      <button aria-label={t.cancel} onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-3xl bg-bg pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold">{t.addAppliance}</h2>
          <button onClick={onClose} className="rounded-xl px-3 py-2 text-muted active:bg-surface">{t.cancel}</button>
        </div>

        <div className="overflow-y-auto px-4 pb-6">
          {/* Custom (default) */}
          <section className="rounded-2xl bg-surface p-4">
            <h3 className="font-semibold">{t.custom}</h3>
            <p className="mb-3 text-sm text-muted">{t.customHint}</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              aria-label={t.name}
              className="mb-3 w-full rounded-xl bg-surface-2 px-3 py-2.5 text-lg outline-none focus:ring-2 focus:ring-accent"
            />
            <span className="mb-1 block text-xs text-muted">{t.watts}</span>
            <NumberField value={watts} onChange={setWatts} max={100000} suffix="W" label={t.watts} decimals={1} className="mb-3" />
            <span className="block text-xs text-muted">{t.hoursPerDay}</span>
            <HoursSlider value={hours} onChange={setHours} />
            <button onClick={addCustom} className="mt-3 w-full rounded-xl bg-accent py-3 font-semibold text-bg active:opacity-80">
              {t.add}
            </button>
          </section>

          {/* Presets */}
          <section className="mt-5">
            <h3 className="font-semibold">{t.presets}</h3>
            <p className="mb-3 text-sm text-muted">{t.presetsHint}</p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              aria-label={t.search}
              className="mb-2 w-full rounded-xl bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
            />
            <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
              {presets.map((p) => (
                <li key={p.key}>
                  <button
                    onClick={() => onAdd(applianceFromPreset(p, lang), true)}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-surface-2"
                  >
                    <span>{p.name[lang]}</span>
                    <span className="text-sm text-muted tabular-nums">{p.watts} W · {p.hoursPerDay} h</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
