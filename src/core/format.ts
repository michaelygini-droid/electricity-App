/** Rp 1.234.567 (Indonesian style, no decimals). */
export function formatRupiah(value: number): string {
  const sign = value < 0 ? '−' : ''
  return `${sign}Rp ${Math.round(Math.abs(value)).toLocaleString('id-ID')}`
}

/** kWh with sensible decimals: 0.65 / 19.8 / 1,234 */
export function formatKwh(value: number, lang: 'en' | 'id' = 'en'): string {
  const locale = lang === 'id' ? 'id-ID' : 'en-US'
  const digits = value < 10 ? 2 : value < 100 ? 1 : 0
  return value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}
