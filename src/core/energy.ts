import type { Appliance, Tariff } from './types'
import { rangesToHours } from './time'

/** Average days per month (365.25 / 12), so monthly numbers are fair across the year. */
export const DAYS_PER_MONTH = 30.4375

export function dailyHours(a: Appliance): number {
  const h = a.mode === 'ranges' ? rangesToHours(a.ranges) : a.hoursPerDay
  return Math.min(24, Math.max(0, h))
}

/** kWh used per day by one appliance line (all units of it). */
export function applianceKwhPerDay(a: Appliance): number {
  return (Math.max(0, a.watts) * Math.max(0, a.quantity) * dailyHours(a)) / 1000
}

export function totalKwhPerDay(list: Appliance[]): number {
  return list.reduce((sum, a) => sum + applianceKwhPerDay(a), 0)
}

/** Price per kWh including PPJ tax. */
export function effectivePrice(t: Tariff): number {
  return t.pricePerKwh * (1 + Math.max(0, t.ppjPercent) / 100)
}

export function costForKwh(kwh: number, t: Tariff): number {
  return kwh * effectivePrice(t)
}

export interface Summary {
  kwhDay: number
  kwhMonth: number
  costDay: number
  costMonth: number
}

export function summarize(list: Appliance[], t: Tariff): Summary {
  const kwhDay = totalKwhPerDay(list)
  const kwhMonth = kwhDay * DAYS_PER_MONTH
  return {
    kwhDay,
    kwhMonth,
    costDay: costForKwh(kwhDay, t),
    costMonth: costForKwh(kwhMonth, t),
  }
}
