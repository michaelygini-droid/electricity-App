import type { Tariff } from './types'

export interface PlnPlan {
  key: string
  /** Short label, e.g. "1.300 VA". */
  va: string
  subsidised?: boolean
  /** Rp per kWh before tax. */
  rate: number
}

/**
 * PLN household tariffs (Rp/kWh, before tax) for Oct–Dec 2026, unchanged
 * from Q3 2026 per PLN/ESDM. These are only defaults — the price is always editable.
 */
export const PLN_PLANS: PlnPlan[] = [
  { key: 'R1-450-S', va: '450 VA', subsidised: true, rate: 415 },
  { key: 'R1-900-S', va: '900 VA', subsidised: true, rate: 605 },
  { key: 'R1-900', va: '900 VA', rate: 1352 },
  { key: 'R1-1300', va: '1.300 VA', rate: 1444.7 },
  { key: 'R1-2200', va: '2.200 VA', rate: 1444.7 },
  { key: 'R2-3500', va: '3.500–5.500 VA', rate: 1699.53 },
  { key: 'R3-6600', va: '≥ 6.600 VA', rate: 1699.53 },
]

export const TARIFF_PERIOD = { en: 'Oct–Dec 2026', id: 'Okt–Des 2026' }

export const DEFAULT_PLAN = 'R1-1300'

export function planByKey(key: string): PlnPlan | undefined {
  return PLN_PLANS.find((p) => p.key === key)
}

export const DEFAULT_TARIFF: Tariff = {
  pricePerKwh: planByKey(DEFAULT_PLAN)!.rate,
  ppjPercent: 2.4,
  ppjOn: false,
  plan: DEFAULT_PLAN,
}

/** Typical PPJ for Jakarta, offered as a quick-fill. */
export const JAKARTA_PPJ = 2.4
