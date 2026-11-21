import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { flightControl, pointOnCurve, shouldPlayCartFlight, type Point } from "@/lib/fly-to-cart"

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

describe("fly to cart", () => {
  // Catalog card below the fold, cart icon in the header's top-right. The deal bar sits between them.
  const thumbnail: Point = { x: 220, y: 720 }
  const cartIcon: Point = { x: 1310, y: 36 }

  it("arcs above the straight line, bends toward the cart, and lands on the icon", () => {
    const control = flightControl(thumbnail, cartIcon)
    const mid = pointOnCurve(thumbnail, control, cartIcon, 0.5)
    const straightMidY = (thumbnail.y + cartIcon.y) / 2
    const late = pointOnCurve(thumbnail, control, cartIcon, 0.75)

    assert.ok(mid.y < straightMidY - 12)
    assert.ok(mid.y > 40)
    assert.ok(mid.x > (thumbnail.x + cartIcon.x) / 2)
    for (const step of [0.25, 0.5, 0.75]) {
      const point = pointOnCurve(thumbnail, control, cartIcon, step)
      assert.ok(point.y >= Math.min(thumbnail.y, cartIcon.y))
    }
    assert.deepEqual(pointOnCurve(thumbnail, control, cartIcon, 1), cartIcon)
    assert.ok(distance(late, cartIcon) < distance(late, thumbnail))
  })

  it("keeps a short bow when the thumbnail is already near the cart", () => {
    const from = { x: 1180, y: 180 }
    const control = flightControl(from, cartIcon)
    const mid = pointOnCurve(from, control, cartIcon, 0.5)

    assert.ok(mid.y < (from.y + cartIcon.y) / 2)
    assert.ok(mid.y > 40)
    assert.deepEqual(pointOnCurve(from, control, cartIcon, 1), cartIcon)
  })

  it("shortens the bow instead of leaving the screen when the cart is near the top", () => {
    const from = { x: 400, y: 90 }
    const to = { x: 900, y: 8 }
    const control = flightControl(from, to)
    const mid = pointOnCurve(from, control, to, 0.5)

    assert.ok(mid.y >= 40)
    assert.ok(mid.y <= (from.y + to.y) / 2)
    for (const step of [0.25, 0.5, 0.75]) {
      const point = pointOnCurve(from, control, to, step)
      assert.ok(point.y >= Math.min(from.y, to.y))
    }
    assert.deepEqual(pointOnCurve(from, control, to, 1), to)
  })

  it("stays off when the reader asks for less motion", () => {
    assert.equal(shouldPlayCartFlight(true), false)
    assert.equal(shouldPlayCartFlight(false), true)
  })
})
