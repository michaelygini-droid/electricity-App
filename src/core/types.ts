// Core data shapes. Plain data only, so it can be reused by a native app later.

/** A time-of-day range in minutes after midnight (0–1440). end < start means "into the next day". */
export interface TimeRange {
  start: number
  end: number
}

/**
 * How an appliance's daily hours are decided:
 * - 'hours':  a simple number of hours per day (slider)
 * - 'ranges': one or more clock ranges, e.g. 09:30 → 04:00
 */
export type UsageMode = 'hours' | 'ranges'

export interface Appliance {
  id: string
  name: string
  watts: number
  mode: UsageMode
  hoursPerDay: number
  ranges: TimeRange[]
  /** How many of this item (e.g. 4 lamps). */
  quantity: number
}

export interface Tariff {
  /** Rupiah per kWh before tax. */
  pricePerKwh: number
  /** PPJ (street lighting tax) percentage, e.g. 2.4. */
  ppjPercent: number
  /** Whether PPJ is added. Kept separate so the % is remembered when switched off. */
  ppjOn: boolean
  /** The chosen PLN plan. If the price differs from that plan's rate, it was edited by hand. */
  plan: string
}
