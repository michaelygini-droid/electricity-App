import type { TimeRange } from './types'

export const MINUTES_PER_DAY = 1440

/** "09:30" -> 570. Returns null for anything that isn't a valid HH:MM. "24:00" is allowed. */
export function parseHHMM(text: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(text.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (min > 59 || h > 24 || (h === 24 && min !== 0)) return null
  return h * 60 + min
}

/** 570 -> "09:30" */
export function formatHHMM(minutes: number): string {
  const m = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/** Length of one range in minutes. Crosses midnight when end < start. start === end means 0. */
export function rangeMinutes(r: TimeRange): number {
  const d = r.end - r.start
  return d >= 0 ? d : d + MINUTES_PER_DAY
}

/**
 * Total hours per day covered by several ranges. Overlapping parts are
 * counted once (you can't run the same AC twice at the same time), and
 * the result never exceeds 24.
 */
export function rangesToHours(ranges: TimeRange[]): number {
  // Split each range into same-day pieces on a 0–1440 line, then merge.
  const pieces: [number, number][] = []
  for (const r of ranges) {
    if (rangeMinutes(r) === 0) continue
    if (r.end > r.start) pieces.push([r.start, r.end])
    else {
      pieces.push([r.start, MINUTES_PER_DAY])
      pieces.push([0, r.end])
    }
  }
  pieces.sort((a, b) => a[0] - b[0])
  let total = 0
  let curStart = -1
  let curEnd = -1
  for (const [s, e] of pieces) {
    if (s > curEnd) {
      total += curEnd - curStart
      curStart = s
      curEnd = e
    } else if (e > curEnd) {
      curEnd = e
    }
  }
  total += curEnd - curStart
  return total / 60
}
