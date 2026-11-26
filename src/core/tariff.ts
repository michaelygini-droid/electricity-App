import type { Tariff } from './types'

/**
 * PLN household tariffs (Rp/kWh, before tax), Oct–Dec 2026.
 * Source: news reports of PLN/ESDM's Q4 2026 decision (unchanged from Q3).
 * These are only defaults — the user can always edit the price.
 */
export const PLN_RATES = {
  'R1-900-RTM': 1352.0,
  'R1-1300': 1444.7,
  'R1-2200': 1444.7,
  'R2-3500-5500': 1699.53,
  'R3-6600+': 1699.53,
} as const

export type PlnPlan = keyof typeof PLN_RATES

export const DEFAULT_TARIFF: Tariff = {
  pricePerKwh: PLN_RATES['R1-1300'],
  ppjPercent: 0,
}

/** Typical PPJ for Jakarta, offered as a quick-fill. */
export const JAKARTA_PPJ = 2.4
