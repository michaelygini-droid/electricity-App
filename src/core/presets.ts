import type { Appliance } from './types'

/** Appliance categories — later used for icons and card themes (Phase 3). */
export type Category =
  | 'cooling' | 'kitchen' | 'computer' | 'entertainment'
  | 'lighting' | 'laundry' | 'water' | 'other'

export interface Preset {
  key: string
  /** English and Indonesian names. */
  name: { en: string; id: string }
  /** Typical running wattage. Always editable — real devices vary a lot. */
  watts: number
  hoursPerDay: number
  category: Category
}

// Typical values for Indonesian homes. Deliberately round numbers:
// they are starting points, not measurements.
export const PRESETS: Preset[] = [
  { key: 'ac-05pk', name: { en: 'AC ½ PK', id: 'AC ½ PK' }, watts: 400, hoursPerDay: 8, category: 'cooling' },
  { key: 'ac-1pk', name: { en: 'AC 1 PK', id: 'AC 1 PK' }, watts: 800, hoursPerDay: 8, category: 'cooling' },
  { key: 'ac-inverter', name: { en: 'AC inverter (average)', id: 'AC inverter (rata-rata)' }, watts: 300, hoursPerDay: 8, category: 'cooling' },
  { key: 'fan', name: { en: 'Standing fan', id: 'Kipas angin' }, watts: 45, hoursPerDay: 8, category: 'cooling' },
  { key: 'fridge', name: { en: 'Fridge (average)', id: 'Kulkas (rata-rata)' }, watts: 100, hoursPerDay: 24, category: 'kitchen' },
  { key: 'rice-cooker-cook', name: { en: 'Rice cooker (cooking)', id: 'Rice cooker (memasak)' }, watts: 400, hoursPerDay: 1, category: 'kitchen' },
  { key: 'rice-cooker-warm', name: { en: 'Rice cooker (keep warm)', id: 'Rice cooker (menghangatkan)' }, watts: 50, hoursPerDay: 10, category: 'kitchen' },
  { key: 'dispenser', name: { en: 'Water dispenser (hot/cold)', id: 'Dispenser air (panas/dingin)' }, watts: 350, hoursPerDay: 4, category: 'kitchen' },
  { key: 'microwave', name: { en: 'Microwave', id: 'Microwave' }, watts: 800, hoursPerDay: 0.25, category: 'kitchen' },
  { key: 'kettle', name: { en: 'Electric kettle', id: 'Teko listrik' }, watts: 1500, hoursPerDay: 0.2, category: 'kitchen' },
  { key: 'pc-gaming', name: { en: 'Desktop PC', id: 'PC desktop' }, watts: 200, hoursPerDay: 6, category: 'computer' },
  { key: 'laptop', name: { en: 'Laptop', id: 'Laptop' }, watts: 60, hoursPerDay: 6, category: 'computer' },
  { key: 'monitor', name: { en: 'Monitor', id: 'Monitor' }, watts: 30, hoursPerDay: 6, category: 'computer' },
  { key: 'router', name: { en: 'Wi-Fi router', id: 'Router Wi-Fi' }, watts: 10, hoursPerDay: 24, category: 'computer' },
  { key: 'tv', name: { en: 'LED TV 43"', id: 'TV LED 43"' }, watts: 80, hoursPerDay: 5, category: 'entertainment' },
  { key: 'led-bulb', name: { en: 'LED bulb', id: 'Lampu LED' }, watts: 10, hoursPerDay: 6, category: 'lighting' },
  { key: 'washer', name: { en: 'Washing machine', id: 'Mesin cuci' }, watts: 350, hoursPerDay: 1, category: 'laundry' },
  { key: 'iron', name: { en: 'Clothes iron', id: 'Setrika' }, watts: 350, hoursPerDay: 0.5, category: 'laundry' },
  { key: 'water-pump', name: { en: 'Water pump', id: 'Pompa air' }, watts: 250, hoursPerDay: 1, category: 'water' },
  { key: 'water-heater', name: { en: 'Electric water heater', id: 'Pemanas air listrik' }, watts: 350, hoursPerDay: 1, category: 'water' },
  { key: 'phone-charger', name: { en: 'Phone charger', id: 'Pengisi daya HP' }, watts: 15, hoursPerDay: 3, category: 'other' },
]

let counter = 0
export function newId(): string {
  counter += 1
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function applianceFromPreset(p: Preset, lang: 'en' | 'id'): Appliance {
  return {
    id: newId(),
    name: p.name[lang],
    watts: p.watts,
    mode: 'hours',
    hoursPerDay: p.hoursPerDay,
    ranges: [],
    quantity: 1,
  }
}
