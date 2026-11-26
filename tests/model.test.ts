import { describe, it, expect } from 'vitest'
import { reducer, migrate, INITIAL_DATA } from '../src/state/model'

describe('app data', () => {
  it('starts with the example pre-loaded', () => {
    expect(INITIAL_DATA.current.map((a) => a.name)[1]).toBe('AC')
    expect(INITIAL_DATA.tariff.pricePerKwh).toBe(1444.7)
  })
  it('adds, updates and removes items', () => {
    const item = { ...INITIAL_DATA.current[0], id: 'n1', name: 'Fan' }
    let s = reducer(INITIAL_DATA, { type: 'add', list: 'current', item })
    expect(s.current).toHaveLength(3)
    s = reducer(s, { type: 'update', list: 'current', id: 'n1', patch: { watts: 45 } })
    expect(s.current[2].watts).toBe(45)
    s = reducer(s, { type: 'remove', list: 'current', id: 'n1' })
    expect(s.current).toHaveLength(2)
    expect(s.whatIf).toBe(INITIAL_DATA.whatIf) // other list untouched
  })
  it('can re-insert at a position (undo delete)', () => {
    const removed = INITIAL_DATA.current[0]
    let s = reducer(INITIAL_DATA, { type: 'remove', list: 'current', id: removed.id })
    s = reducer(s, { type: 'add', list: 'current', item: removed, index: 0 })
    expect(s.current[0].id).toBe(removed.id)
  })
  it('upgrades data saved by older versions', () => {
    const old = { ...INITIAL_DATA, tariff: { pricePerKwh: 1500, ppjPercent: 0 } }
    const d = migrate(old)
    expect(d.tariff).toEqual({ pricePerKwh: 1500, ppjPercent: 2.4, ppjOn: false, plan: 'R1-1300' })
  })
  it('ignores broken saved data', () => {
    expect(migrate(null)).toBe(INITIAL_DATA)
    expect(migrate({ version: 99 })).toBe(INITIAL_DATA)
    expect(migrate('garbage')).toBe(INITIAL_DATA)
  })
})
