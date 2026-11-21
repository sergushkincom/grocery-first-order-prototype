export type Point = { x: number; y: number }

const MIN_BOW_PX = 18
const MAX_BOW_PX = 64
/** The full-size tile is 72px. Keep its crest below the viewport edge. */
const CREST_FLOOR_PX = 44
/** Pull the bend toward the cart so the arc does not sweep back along the deal bar. */
const CART_BIAS = 0.58

/** Reduced motion skips the flight and the counter bump. The count still updates. */
export function shouldPlayCartFlight(prefersReducedMotion: boolean) {
  return !prefersReducedMotion
}

export function centerOf(rect: { left: number; top: number; width: number; height: number }): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

/**
 * Control point for a short upward arc from a thumbnail to the cart icon.
 * The bow is measured off the straight line, and it is shortened when the
 * cart already sits near the top, so the tile never climbs off the screen.
 * The curve still ends on the cart.
 */
export function flightControl(from: Point, to: Point): Point {
  const rise = Math.abs(to.y - from.y)
  const distance = Math.hypot(to.x - from.x, to.y - from.y)
  let bow = Math.min(MAX_BOW_PX, Math.max(MIN_BOW_PX, Math.min(rise * 0.2, distance * 0.1)))
  const straightMid = (from.y + to.y) / 2
  if (straightMid - bow < CREST_FLOOR_PX) bow = Math.max(0, straightMid - CREST_FLOOR_PX)
  return {
    x: from.x + (to.x - from.x) * CART_BIAS,
    y: straightMid - bow * 2,
  }
}

export function pointOnCurve(from: Point, control: Point, to: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
    y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
  }
}
