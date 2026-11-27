// The confirmation check is drawn as a pen stroke.
// Adapted from line-art-animation (MIT) by JDhruv14:
// https://github.com/JDhruv14/line-art-animation
// Copyright (c) 2026 JDhruv14
// `ease` is the smoothstep from lib/motion.ts. Point formatting follows `f` / `pt` in lib/ink.ts.
// Reduced motion keeps the finished stroke, the same way their `run()` draws one still frame.

type Pt = readonly [number, number]

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x))

const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Smoothstep, adapted from line-art-animation's `ease`. */
export const ease = (t: number) => smooth(0, 1, t)

const f = (n: number) => n.toFixed(2)
const pt = (p: Pt) => `${f(p[0])} ${f(p[1])}`

/** Lucide circle-check tick: M 9,12 → 11,14 → 15,10. */
const CHECK_POINTS: readonly Pt[] = [
  [9, 12],
  [11, 14],
  [15, 10],
]

export const CIRCLE_DRAW_MS = 640
export const CHECK_DELAY_MS = 460
export const CHECK_DRAW_MS = 520

export const ROW_FADE_MS = 420
export const ROW_STAGGER_MS = 150
export const ROW_START_MS = 520

export const COUNT_MS = 1100

export function rowDelayMs(index: number) {
  return ROW_START_MS + index * ROW_STAGGER_MS
}

/** The total starts counting once the Gesamt row is on its way in. */
export function countDelayMs() {
  return rowDelayMs(3) + 180
}

export function confirmationMotionEndMs() {
  return Math.max(CIRCLE_DRAW_MS, CHECK_DELAY_MS + CHECK_DRAW_MS, countDelayMs() + COUNT_MS)
}

function segmentProgress(elapsedMs: number, delayMs: number, durationMs: number) {
  if (durationMs <= 0) return elapsedMs >= delayMs ? 1 : 0
  return clamp((elapsedMs - delayMs) / durationMs, 0, 1)
}

/** 1 hides the stroke, 0 is the finished pen line. */
export function penOffset(progress: number, reducedMotion = false) {
  if (reducedMotion) return 0
  return 1 - ease(progress)
}

export function circleOffsetAt(elapsedMs: number, reducedMotion = false) {
  return penOffset(segmentProgress(elapsedMs, 0, CIRCLE_DRAW_MS), reducedMotion)
}

/** Portion of a polyline from the start. t = 0 is empty, t = 1 is the whole stroke. */
export function partialPolyline(points: readonly Pt[], t: number) {
  if (points.length === 0) return ""
  const clamped = clamp(t, 0, 1)
  if (clamped <= 0) return ""
  if (clamped >= 1) return `M${pt(points[0])}${points.slice(1).map((p) => `L${pt(p)}`).join("")}`

  const lengths: number[] = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const len = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    lengths.push(len)
    total += len
  }

  let remain = total * clamped
  let d = `M${pt(points[0])}`
  for (let i = 1; i < points.length; i++) {
    const seg = lengths[i - 1]
    const a = points[i - 1]
    const b = points[i]
    if (remain >= seg - 1e-4) {
      d += `L${pt(b)}`
      remain -= seg
      continue
    }
    const u = seg === 0 ? 1 : remain / seg
    d += `L${pt([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u])}`
    break
  }
  return d
}

export function fullCheckPath() {
  return partialPolyline(CHECK_POINTS, 1)
}

export function checkPathAt(elapsedMs: number, reducedMotion = false) {
  if (reducedMotion) return fullCheckPath()
  return partialPolyline(CHECK_POINTS, ease(segmentProgress(elapsedMs, CHECK_DELAY_MS, CHECK_DRAW_MS)))
}

function easeOut(t: number) {
  const x = clamp(t, 0, 1)
  return 1 - (1 - x) ** 3
}

/** Counts in whole cents and lands on the exact total. */
export function countUpCents(targetCents: number, elapsedMs: number, durationMs: number) {
  const target = Math.max(0, Math.round(targetCents))
  if (elapsedMs <= 0) return 0
  if (durationMs <= 0 || elapsedMs >= durationMs) return target
  return Math.min(target, Math.round(target * easeOut(elapsedMs / durationMs)))
}
