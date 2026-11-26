import type { Appliance, Tariff } from './types'
import { summarize } from './energy'

export interface CumulativePoint {
  month: number
  current: number
  whatIf: number
  /** Running total of money saved (negative = the what-if costs more). */
  saved: number
}

/** Cumulative electricity cost month by month, for 0..months. Starts at month 0 = Rp 0. */
export function cumulativeCost(
  current: Appliance[],
  whatIf: Appliance[],
  t: Tariff,
  months: number,
): CumulativePoint[] {
  const a = summarize(current, t).costMonth
  const b = summarize(whatIf, t).costMonth
  const out: CumulativePoint[] = []
  for (let m = 0; m <= months; m++) {
    out.push({ month: m, current: a * m, whatIf: b * m, saved: (a - b) * m })
  }
  return out
}

export interface Payback {
  /** Upgrade price minus what you get for selling the old part. */
  netCost: number
  monthlySavings: number
  /** Months to break even; null when it never pays back (no savings). 0 when nothing to pay back. */
  months: number | null
}

export function payback(upgradePrice: number, resaleValue: number, monthlySavings: number): Payback {
  const netCost = upgradePrice - resaleValue
  if (netCost <= 0) return { netCost, monthlySavings, months: 0 }
  if (monthlySavings <= 0) return { netCost, monthlySavings, months: null }
  return { netCost, monthlySavings, months: netCost / monthlySavings }
}
