import { describe, it, expect } from 'vitest'
import { parseHHMM, formatHHMM, rangeMinutes, rangesToHours } from '../src/core/time'
import { applianceKwhPerDay, summarize, effectivePrice, DAYS_PER_MONTH, dailyHours } from '../src/core/energy'
import { cumulativeCost, payback } from '../src/core/compare'
import { DEFAULT_TARIFF } from '../src/core/tariff'
import { formatRupiah } from '../src/core/format'
import { EXAMPLE_CURRENT, EXAMPLE_WHAT_IF, EXAMPLE_UPGRADE } from '../src/core/example'
import type { Appliance } from '../src/core/types'

const t = (h: string) => parseHHMM(h)!

describe('time ranges', () => {
  it('parses and formats HH:MM', () => {
    expect(parseHHMM('09:30')).toBe(570)
    expect(parseHHMM('24:00')).toBe(1440)
    expect(parseHHMM('25:00')).toBeNull()
    expect(parseHHMM('9:61')).toBeNull()
    expect(parseHHMM('abc')).toBeNull()
    expect(formatHHMM(570)).toBe('09:30')
    expect(formatHHMM(1440)).toBe('00:00')
  })
  it('handles ranges that cross midnight', () => {
    expect(rangeMinutes({ start: t('09:30'), end: t('04:00') })).toBe(18.5 * 60)
    expect(rangeMinutes({ start: t('22:00'), end: t('06:00') })).toBe(8 * 60)
    expect(rangeMinutes({ start: t('08:00'), end: t('08:00') })).toBe(0)
  })
  it('adds several ranges', () => {
    expect(rangesToHours([
      { start: t('06:00'), end: t('08:00') },
      { start: t('18:00'), end: t('22:00') },
    ])).toBe(6)
  })
  it('counts overlapping ranges once and never above 24h', () => {
    expect(rangesToHours([
      { start: t('20:00'), end: t('02:00') },
      { start: t('23:00'), end: t('04:00') },
    ])).toBe(8)
    expect(rangesToHours([
      { start: t('00:00'), end: t('24:00') },
      { start: t('10:00'), end: t('12:00') },
    ])).toBe(24)
  })
})

describe('energy and cost', () => {
  const base: Appliance = { id: 'x', name: 'x', watts: 400, mode: 'hours', hoursPerDay: 3, ranges: [], quantity: 1 }

  it('rice cooker 400 W × 3 h = 1.2 kWh/day', () => {
    expect(applianceKwhPerDay(base)).toBeCloseTo(1.2)
  })
  it('respects quantity', () => {
    expect(applianceKwhPerDay({ ...base, watts: 10, hoursPerDay: 5, quantity: 4 })).toBeCloseTo(0.2)
  })
  it('clamps hours to 0–24', () => {
    expect(dailyHours({ ...base, hoursPerDay: 30 })).toBe(24)
    expect(dailyHours({ ...base, hoursPerDay: -2 })).toBe(0)
  })
  it('adds PPJ on top of the price', () => {
    const tar = { pricePerKwh: 1000, ppjPercent: 2.4, ppjOn: true, plan: 'custom' }
    expect(effectivePrice(tar)).toBeCloseTo(1024)
    expect(effectivePrice({ ...tar, ppjOn: false })).toBeCloseTo(1000)
  })
  it('summarizes a list', () => {
    const s = summarize([base], { pricePerKwh: 1000, ppjPercent: 2.4, ppjOn: false, plan: 'custom' })
    expect(s.kwhDay).toBeCloseTo(1.2)
    expect(s.costDay).toBeCloseTo(1200)
    expect(s.kwhMonth).toBeCloseTo(1.2 * DAYS_PER_MONTH)
  })
  it('formats Rupiah the Indonesian way', () => {
    expect(formatRupiah(1234567.4)).toBe('Rp 1.234.567')
    expect(formatRupiah(-500)).toBe('−Rp 500')
  })
})

describe('compare and payback', () => {
  it('payback = (price − resale) / monthly savings', () => {
    expect(payback(3_000_000, 1_400_000, 40_000).months).toBeCloseTo(40)
  })
  it('never pays back with zero savings, instantly with zero net cost', () => {
    expect(payback(3_000_000, 1_400_000, 0).months).toBeNull()
    expect(payback(1_000_000, 1_200_000, 10_000).months).toBe(0)
  })
  it('cumulative chart starts at 0 and grows linearly', () => {
    const pts = cumulativeCost(EXAMPLE_CURRENT, EXAMPLE_WHAT_IF, DEFAULT_TARIFF, 12)
    expect(pts).toHaveLength(13)
    expect(pts[0].current).toBe(0)
    expect(pts[12].saved).toBeCloseTo(pts[1].saved * 12)
  })
})

describe("the user's example", () => {
  const cur = summarize(EXAMPLE_CURRENT, DEFAULT_TARIFF)
  const wi = summarize(EXAMPLE_WHAT_IF, DEFAULT_TARIFF)
  const saved = cur.costMonth - wi.costMonth
  const pb = payback(EXAMPLE_UPGRADE.upgradePrice, EXAMPLE_UPGRADE.resaleValue, saved)

  it('AC runs 18.5 h/day, PC 2 kWh/day', () => {
    expect(dailyHours(EXAMPLE_CURRENT[1])).toBe(18.5)
    expect(applianceKwhPerDay(EXAMPLE_CURRENT[0])).toBeCloseTo(2)
    expect(applianceKwhPerDay(EXAMPLE_CURRENT[1])).toBeCloseTo(4.625)
  })
  it('new GPU saves 0.65 kWh/day', () => {
    expect(cur.kwhDay - wi.kwhDay).toBeCloseTo(0.65)
  })
  it('prints the numbers for a human check', () => {
    console.log({
      currentKwhDay: cur.kwhDay, currentRpMonth: Math.round(cur.costMonth),
      whatIfRpMonth: Math.round(wi.costMonth), savedRpMonth: Math.round(saved),
      netUpgrade: pb.netCost, paybackMonths: pb.months?.toFixed(1),
    })
    expect(pb.months).toBeGreaterThan(50)
  })
})
