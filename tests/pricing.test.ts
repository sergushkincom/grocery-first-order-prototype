import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { DELIVERY_FEE_TIERS, FIRST_DELIVERY_FEE, MIN_ORDER, WEIGHED_RESERVE_RATE } from "@/config"
import { getProduct } from "@/data/products"
import { toCents } from "@/lib/format"
import {
  MIN_ORDER_CENTS,
  WELCOME_CREDIT_CENTS,
  computeTotals,
  isDeliverablePostcode,
  isValidPostcodeFormat,
  pickAiFill,
  type Cart,
} from "@/lib/pricing"

// Catalog sums, in cents. Each fixture asserts its own total, so a price edit fails here
// instead of quietly moving a threshold case off the boundary it is meant to hold.
const ONE_CENT_UNDER: Cart = { brot: 1, orangensaft: 3, spaghetti: 7 }
const EXACT_MINIMUM: Cart = { haehnchen: 1, orangensaft: 2, spaghetti: 7 }
const ONE_CENT_OVER: Cart = { orangensaft: 7, spaghetti: 2 }

function tiersCovering(goodsCents: number) {
  return DELIVERY_FEE_TIERS.filter((tier) => {
    const belowUpper = tier.to === undefined || goodsCents < toCents(tier.to)
    return goodsCents >= toCents(tier.from) && belowUpper
  })
}

function expectRegularFee(goodsCents: number, feeEuros: number | null) {
  const matches = tiersCovering(goodsCents)
  if (feeEuros === null) {
    assert.deepEqual(matches, [], `€${(goodsCents / 100).toFixed(2)} should match no tier`)
    return
  }
  assert.equal(matches.length, 1, `€${(goodsCents / 100).toFixed(2)} should match one tier`)
  assert.equal(matches[0].fee, feeEuros)
  assert.equal(toCents(matches[0].fee), toCents(feeEuros))
}

describe("minimum order", () => {
  it("withholds the credit one cent under €20", () => {
    const totals = computeTotals(ONE_CENT_UNDER)

    assert.equal(totals.subtotalCents, MIN_ORDER_CENTS - 1)
    assert.equal(totals.minReached, false)
    assert.equal(totals.remainingCents, 1)
    assert.equal(totals.creditCents, 0)
    assert.equal(totals.deliveryCents, toCents(FIRST_DELIVERY_FEE))
    assert.equal(totals.totalCents, totals.subtotalCents)
    assert.equal(totals.progress, (MIN_ORDER_CENTS - 1) / MIN_ORDER_CENTS)
  })

  it("applies the credit at exactly €20", () => {
    const totals = computeTotals(EXACT_MINIMUM)

    assert.equal(totals.subtotalCents, MIN_ORDER_CENTS)
    assert.equal(MIN_ORDER_CENTS, toCents(MIN_ORDER))
    assert.equal(totals.minReached, true)
    assert.equal(totals.remainingCents, 0)
    assert.equal(totals.creditCents, WELCOME_CREDIT_CENTS)
    assert.equal(totals.deliveryCents, 0)
    assert.equal(totals.totalCents, MIN_ORDER_CENTS - WELCOME_CREDIT_CENTS)
    assert.equal(totals.progress, 1)
    const chicken = getProduct("haehnchen")
    assert.ok(chicken)
    assert.equal(totals.hasWeighed, true)
    assert.equal(totals.weighedReserveCents, Math.round(toCents(chicken.price) * WEIGHED_RESERVE_RATE))
  })

  it("keeps the credit one cent over €20 and caps progress at 1", () => {
    const totals = computeTotals(ONE_CENT_OVER)

    assert.equal(totals.subtotalCents, MIN_ORDER_CENTS + 1)
    assert.equal(totals.minReached, true)
    assert.equal(totals.remainingCents, 0)
    assert.equal(totals.creditCents, WELCOME_CREDIT_CENTS)
    assert.equal(totals.totalCents, totals.subtotalCents - WELCOME_CREDIT_CENTS)
    assert.equal(totals.progress, 1)
  })

  it("does not let the bottle deposit close the minimum", () => {
    // 5 × Mineralwasser: €17.70 of goods + €7.50 deposit. Goods stay under €20;
    // goods and deposit together would pass it.
    const totals = computeTotals({ wasser: 5 })

    assert.equal(totals.subtotalCents, toCents(3.54) * 5)
    assert.equal(totals.pfandCents, toCents(1.5) * 5)
    assert.ok(totals.subtotalCents < MIN_ORDER_CENTS)
    assert.ok(totals.subtotalCents + totals.pfandCents >= MIN_ORDER_CENTS)
    assert.equal(totals.minReached, false)
    assert.equal(totals.creditCents, 0)
    assert.equal(totals.remainingCents, MIN_ORDER_CENTS - totals.subtotalCents)
    assert.equal(totals.goodsWithPfandCents, totals.subtotalCents + totals.pfandCents)
    assert.equal(totals.totalCents, totals.subtotalCents + totals.pfandCents)
  })

  it("adds the deposit on top once the goods themselves reach €20", () => {
    const totals = computeTotals({ ...EXACT_MINIMUM, wasser: 1 })

    assert.equal(totals.subtotalCents, MIN_ORDER_CENTS + toCents(3.54))
    assert.equal(totals.pfandCents, toCents(1.5))
    assert.equal(totals.minReached, true)
    assert.equal(totals.creditCents, WELCOME_CREDIT_CENTS)
    assert.equal(
      totals.totalCents,
      totals.subtotalCents + totals.pfandCents + totals.deliveryCents - totals.creditCents,
    )
  })

  it("ignores an empty cart, unknown ids, and non-positive quantities", () => {
    const empty = computeTotals({})
    assert.equal(empty.subtotalCents, 0)
    assert.equal(empty.itemCount, 0)
    assert.equal(empty.minReached, false)
    assert.equal(empty.remainingCents, MIN_ORDER_CENTS)
    assert.equal(empty.creditCents, 0)
    assert.equal(empty.deliveryCents, 0)
    assert.equal(empty.progress, 0)

    const exact = computeTotals({ ...EXACT_MINIMUM, missing: 4, brot: 0, milch: -1 })
    assert.equal(exact.subtotalCents, MIN_ORDER_CENTS)
    assert.equal(exact.lines.every((line) => line.qty > 0), true)
  })
})

describe("delivery fee tiers", () => {
  it("publishes the regular-order table: €3.90, then €1.90, then free", () => {
    assert.deepEqual(
      DELIVERY_FEE_TIERS.map((tier) => ({ from: tier.from, to: tier.to ?? null, fee: tier.fee })),
      [
        { from: 20, to: 49, fee: 3.9 },
        { from: 49, to: 79, fee: 1.9 },
        { from: 79, to: null, fee: 0 },
      ],
    )
  })

  it("meets edge to edge, lower bound inclusive and upper bound exclusive", () => {
    assert.equal(toCents(DELIVERY_FEE_TIERS[0].from), MIN_ORDER_CENTS)
    for (let index = 0; index < DELIVERY_FEE_TIERS.length - 1; index++) {
      const upper = DELIVERY_FEE_TIERS[index].to
      if (upper === undefined) assert.fail(`tier starting at ${DELIVERY_FEE_TIERS[index].from} needs an upper bound`)
      assert.equal(toCents(upper), toCents(DELIVERY_FEE_TIERS[index + 1].from))
    }
    assert.equal(DELIVERY_FEE_TIERS[DELIVERY_FEE_TIERS.length - 1].to, undefined)
  })

  it("assigns the exact cent on each threshold to the cheaper tier", () => {
    expectRegularFee(1999, null)
    expectRegularFee(2000, 3.9)
    expectRegularFee(3000, 3.9)
    expectRegularFee(4899, 3.9)
    expectRegularFee(4900, 1.9)
    expectRegularFee(6000, 1.9)
    expectRegularFee(7899, 1.9)
    expectRegularFee(7900, 0)
    expectRegularFee(10_000, 0)
  })

  it("keeps the first order free on every tier boundary", () => {
    const carts: Cart[] = [
      ONE_CENT_UNDER,
      EXACT_MINIMUM,
      ONE_CENT_OVER,
      { wasser: 4, orangensaft: 2, spaghetti: 3, kaffee: 2 },
      { croissants: 1, haehnchen: 2, wasser: 1, orangensaft: 4, spaghetti: 6, kaffee: 1 },
      { wasser: 3, orangensaft: 4, spaghetti: 5, kaffee: 4 },
      { haehnchen: 2, wasser: 1, orangensaft: 1, spaghetti: 7, kaffee: 4 },
    ]
    const goodsCents = carts.map((cart) => computeTotals(cart).subtotalCents)
    assert.deepEqual(goodsCents, [1999, 2000, 2001, 4899, 4900, 7899, 7900])

    for (const cart of carts) {
      const totals = computeTotals(cart)
      assert.equal(totals.deliveryCents, toCents(FIRST_DELIVERY_FEE))
      assert.equal(totals.deliveryCents, 0)
    }
  })
})

describe("minimum fill", () => {
  it("adds nothing once the goods value is already exactly €20", () => {
    const cart = { ...EXACT_MINIMUM }
    assert.deepEqual(pickAiFill(cart), [])
    assert.deepEqual(cart, EXACT_MINIMUM)
  })

  it("fills one cent under €20 up to the minimum without changing the cart it was given", () => {
    const cart = { ...ONE_CENT_UNDER }
    const picks = pickAiFill(cart)

    assert.ok(picks.length > 0)
    assert.deepEqual(cart, ONE_CENT_UNDER)

    const filled: Cart = { ...cart }
    for (const id of picks) filled[id] = (filled[id] ?? 0) + 1
    const totals = computeTotals(filled)
    assert.equal(totals.minReached, true)
    assert.equal(totals.remainingCents, 0)
  })
})

describe("deliverable postcodes", () => {
  it("includes the published bounds and rejects the codes just outside them", () => {
    assert.equal(isValidPostcodeFormat("80331"), true)
    assert.equal(isValidPostcodeFormat("81929"), true)
    assert.equal(isDeliverablePostcode("80331"), true)
    assert.equal(isDeliverablePostcode("81929"), true)

    assert.equal(isValidPostcodeFormat("80330"), true)
    assert.equal(isValidPostcodeFormat("81930"), true)
    assert.equal(isDeliverablePostcode("80330"), false)
    assert.equal(isDeliverablePostcode("81930"), false)

    for (const postcode of ["8033", "8192", "803311", "8033a", " 80331", ""]) {
      assert.equal(isValidPostcodeFormat(postcode), false, postcode)
      assert.equal(isDeliverablePostcode(postcode), false, postcode)
    }
  })
})
