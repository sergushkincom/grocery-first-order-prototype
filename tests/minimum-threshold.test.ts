import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { WELCOME_CREDIT } from "@/config"
import { formatEUR } from "@/lib/format"
import {
  minimumLiveAnnouncement,
  playsReachedGlow,
  thresholdCrossing,
  type ThresholdCrossing,
} from "@/lib/minimum-threshold"
import { MIN_ORDER_CENTS, computeTotals, type Cart } from "@/lib/pricing"

// Coffee alone is under €20. A second bag crosses it. One bag again falls short.
const ONE_COFFEE: Cart = { kaffee: 1 }
const TWO_COFFEES: Cart = { kaffee: 2 }

const creditLabel = `${WELCOME_CREDIT.toLocaleString("de-DE")} €`

function step(wasReached: boolean, cart: Cart, reducedMotion = false) {
  const totals = computeTotals(cart)
  const crossing = thresholdCrossing(wasReached, totals.minReached)
  return { totals, crossing, glow: playsReachedGlow(crossing, reducedMotion) }
}

describe("threshold crossing", () => {
  it("plays once when the goods value reaches the minimum, and not again while it stays there", () => {
    const under = computeTotals(ONE_COFFEE)
    const over = computeTotals(TWO_COFFEES)
    const stillOver = computeTotals({ kaffee: 2, milch: 1 })

    assert.ok(under.subtotalCents < MIN_ORDER_CENTS)
    assert.ok(over.subtotalCents >= MIN_ORDER_CENTS)
    assert.ok(stillOver.subtotalCents > over.subtotalCents)

    assert.equal(thresholdCrossing(under.minReached, over.minReached), "reached")
    assert.equal(thresholdCrossing(over.minReached, stillOver.minReached), "none")
    assert.equal(playsReachedGlow("reached", false), true)
    assert.equal(playsReachedGlow("none", false), false)
  })

  it("reverses when the cart drops back below the minimum, without glowing", () => {
    const over = computeTotals(TWO_COFFEES)
    const under = computeTotals(ONE_COFFEE)

    assert.equal(thresholdCrossing(over.minReached, under.minReached), "dropped")
    assert.equal(playsReachedGlow("dropped", false), false)
  })

  it("stays quiet while the cart is still short, including the empty cart", () => {
    const empty = computeTotals({})
    const under = computeTotals(ONE_COFFEE)

    assert.equal(empty.minReached, false)
    assert.equal(thresholdCrossing(false, empty.minReached), "none")
    assert.equal(thresholdCrossing(empty.minReached, under.minReached), "none")
    assert.equal(playsReachedGlow("none", false), false)
  })

  it("does not glow when the crossing happens with reduced motion", () => {
    assert.equal(playsReachedGlow("reached", true), false)
    assert.equal(playsReachedGlow("dropped", true), false)
  })

  it("follows a cart from empty, across the minimum, further up, and back down", () => {
    const carts: Cart[] = [{}, ONE_COFFEE, TWO_COFFEES, { kaffee: 2, milch: 1 }, ONE_COFFEE]
    const crossings: ThresholdCrossing[] = []
    const glows: boolean[] = []
    let wasReached = false

    for (const cart of carts) {
      const next = step(wasReached, cart)
      crossings.push(next.crossing)
      glows.push(next.glow)
      wasReached = next.totals.minReached
    }

    assert.deepEqual(crossings, ["none", "none", "reached", "none", "dropped"])
    assert.deepEqual(glows, [false, false, true, false, false])
  })

  it("announces the arrival once and the gap again on the way down", () => {
    const under = computeTotals(ONE_COFFEE)
    const over = computeTotals(TWO_COFFEES)
    const stillOver = computeTotals({ kaffee: 2, milch: 1 })
    const remaining = formatEUR(under.remainingCents)

    const below = minimumLiveAnnouncement(false, remaining, creditLabel)
    const reached = minimumLiveAnnouncement(true, formatEUR(over.remainingCents), creditLabel)
    const still = minimumLiveAnnouncement(true, formatEUR(stillOver.remainingCents), creditLabel)
    const dropped = minimumLiveAnnouncement(false, remaining, creditLabel)

    assert.equal(below, `Noch ${remaining} bis zum Mindestbestellwert.`)
    assert.equal(reached, `Mindestbestellwert erreicht. Die erste Lieferung ist gratis. Plus ${creditLabel} Guthaben.`)
    assert.equal(still, reached)
    assert.equal(dropped, below)
    assert.notEqual(reached, below)
  })
})
