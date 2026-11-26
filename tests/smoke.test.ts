import { describe, it, expect } from 'vitest'
import { en } from '../src/i18n/en'
import { id } from '../src/i18n/id'

describe('translations', () => {
  it('Indonesian has every English key, none empty', () => {
    for (const k of Object.keys(en) as (keyof typeof en)[]) {
      expect(id[k], k).toBeTruthy()
    }
  })
})
