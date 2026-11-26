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

/** Short Rupiah for chart axes: "Rp 1,2 jt" / "Rp 500 rb" (id) or "Rp 1.2M" / "Rp 500K" (en). */
export function formatRupiahShort(value: number, lang: 'en' | 'id' = 'en'): string {
  const v = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  const num = (n: number) => {
    const s = String(Number(n.toFixed(n < 10 ? 1 : 0)))
    return lang === 'id' ? s.replace('.', ',') : s
  }
  if (v >= 1e9) return `${sign}Rp ${num(v / 1e9)}${lang === 'id' ? ' M' : 'B'}`
  if (v >= 1e6) return `${sign}Rp ${num(v / 1e6)}${lang === 'id' ? ' jt' : 'M'}`
  if (v >= 1e3) return `${sign}Rp ${num(v / 1e3)}${lang === 'id' ? ' rb' : 'K'}`
  return `${sign}Rp ${Math.round(v)}`
}

/** A "nice" axis step (1, 2, 2.5, 5 × 10ⁿ) so ticks are round numbers. */
export function niceStep(max: number, targetTicks = 4): number {
  if (max <= 0) return 1
  const raw = max / targetTicks
  const pow = 10 ** Math.floor(Math.log10(raw))
  const n = raw / pow
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return m * pow
}
