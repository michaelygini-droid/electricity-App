import type { Appliance } from './types'

/** The user's own example, pre-loaded on first launch. */
export const EXAMPLE_CURRENT: Appliance[] = [
  {
    id: 'ex-pc',
    name: 'PC (65W CPU + 135W GPU)',
    watts: 200,
    mode: 'hours',
    hoursPerDay: 10,
    ranges: [],
    quantity: 1,
  },
  {
    id: 'ex-ac',
    name: 'AC',
    watts: 250,
    mode: 'ranges',
    hoursPerDay: 0,
    ranges: [{ start: 9 * 60 + 30, end: 4 * 60 }], // 09:30 → 04:00 next day
    quantity: 1,
  },
]

/** What-if: same, but the PC has the new 70 W GPU. */
export const EXAMPLE_WHAT_IF: Appliance[] = [
  { ...EXAMPLE_CURRENT[0], id: 'ex-pc-new', name: 'PC (65W CPU + 70W new GPU)', watts: 135 },
  { ...EXAMPLE_CURRENT[1], id: 'ex-ac-w', ranges: [...EXAMPLE_CURRENT[1].ranges] },
]

export const EXAMPLE_UPGRADE = {
  upgradePrice: 3_000_000,
  resaleValue: 1_400_000,
}
