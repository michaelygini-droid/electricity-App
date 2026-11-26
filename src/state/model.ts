// All app data and the ways it can change. Pure functions (no React),
// so the same logic can be reused in a native app later.
import type { Appliance, Tariff } from '../core/types'
import { DEFAULT_TARIFF } from '../core/tariff'
import { EXAMPLE_CURRENT, EXAMPLE_WHAT_IF, EXAMPLE_UPGRADE } from '../core/example'

export type ListKey = 'current' | 'whatIf'

export interface AppData {
  version: 1
  current: Appliance[]
  whatIf: Appliance[]
  tariff: Tariff
  upgrade: { upgradePrice: number; resaleValue: number }
}

export const INITIAL_DATA: AppData = {
  version: 1,
  current: EXAMPLE_CURRENT,
  whatIf: EXAMPLE_WHAT_IF,
  tariff: DEFAULT_TARIFF,
  upgrade: EXAMPLE_UPGRADE,
}

export type Action =
  | { type: 'add'; list: ListKey; item: Appliance; index?: number }
  | { type: 'update'; list: ListKey; id: string; patch: Partial<Appliance> }
  | { type: 'remove'; list: ListKey; id: string }
  | { type: 'setTariff'; patch: Partial<Tariff> }
  | { type: 'setUpgrade'; patch: Partial<AppData['upgrade']> }
  | { type: 'replaceList'; list: ListKey; items: Appliance[] }
  | { type: 'reset' }

export function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'add': {
      const list = [...state[action.list]]
      list.splice(action.index ?? list.length, 0, action.item)
      return { ...state, [action.list]: list }
    }
    case 'update':
      return {
        ...state,
        [action.list]: state[action.list].map((a) => (a.id === action.id ? { ...a, ...action.patch } : a)),
      }
    case 'remove':
      return { ...state, [action.list]: state[action.list].filter((a) => a.id !== action.id) }
    case 'setTariff':
      return { ...state, tariff: { ...state.tariff, ...action.patch } }
    case 'setUpgrade':
      return { ...state, upgrade: { ...state.upgrade, ...action.patch } }
    case 'replaceList':
      return { ...state, [action.list]: action.items }
    case 'reset':
      return INITIAL_DATA
  }
}

/** Accept saved data only if it looks right; otherwise start fresh. */
export function migrate(raw: unknown): AppData {
  const d = raw as Partial<AppData> | null
  if (!d || d.version !== 1 || !Array.isArray(d.current) || !Array.isArray(d.whatIf)) return INITIAL_DATA
  const savedTariff: Partial<AppData['tariff']> = { ...d.tariff }
  // Data saved before the PPJ on/off switch existed stored "off" as 0%.
  if (savedTariff.ppjOn === undefined) {
    savedTariff.ppjOn = (savedTariff.ppjPercent ?? 0) > 0
    if (!savedTariff.ppjOn) delete savedTariff.ppjPercent
  }
  return {
    ...INITIAL_DATA,
    ...d,
    tariff: { ...INITIAL_DATA.tariff, ...savedTariff },
    upgrade: { ...INITIAL_DATA.upgrade, ...d.upgrade },
  } as AppData
}
