import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { formatEUR } from "@/lib/format"
import {
  CHECK_DELAY_MS,
  CHECK_DRAW_MS,
  CIRCLE_DRAW_MS,
  COUNT_MS,
  ROW_FADE_MS,
  ROW_STAGGER_MS,
  checkPathAt,
  circleOffsetAt,
  confirmationMotionEndMs,
  countDelayMs,
  countUpCents,
  fullCheckPath,
  penOffset,
  rowDelayMs,
} from "@/lib/confirm-motion"

describe("confirmation check", () => {
  it("draws a pen line and finishes on the same tick as the circle-check icon", () => {
    assert.equal(fullCheckPath(), "M9.00 12.00L11.00 14.00L15.00 10.00")
    assert.equal(penOffset(0), 1)
    assert.equal(penOffset(1), 0)
    assert.equal(penOffset(0.4, true), 0)

    assert.equal(circleOffsetAt(0), 1)
    assert.ok(circleOffsetAt(CIRCLE_DRAW_MS / 2) < 1)
    assert.equal(circleOffsetAt(CIRCLE_DRAW_MS), 0)
    assert.equal(circleOffsetAt(0, true), 0)

    assert.equal(checkPathAt(0), "")
    assert.equal(checkPathAt(CHECK_DELAY_MS), "")
    const mid = checkPathAt(CHECK_DELAY_MS + CHECK_DRAW_MS / 2)
    assert.ok(mid.startsWith("M9.00 12.00"))
    assert.ok(mid.includes("L11.00 14.00"))
    assert.notEqual(mid, fullCheckPath())
    assert.equal(checkPathAt(CHECK_DELAY_MS + CHECK_DRAW_MS), fullCheckPath())
    assert.equal(checkPathAt(0, true), fullCheckPath())
  })

  it("keeps the circle moving forward, then the tick", () => {
    let prev = circleOffsetAt(0)
    for (let ms = 0; ms <= CIRCLE_DRAW_MS; ms += 20) {
      const next = circleOffsetAt(ms)
      assert.ok(next <= prev + 1e-9)
      prev = next
    }
    assert.ok(CHECK_DELAY_MS < CIRCLE_DRAW_MS)
    assert.ok(CHECK_DELAY_MS + CHECK_DRAW_MS > CIRCLE_DRAW_MS)
  })
})

describe("confirmation rows and total", () => {
  it("reveals Lieferung, Adresse, Zahlung and Gesamt one after another", () => {
    const delays = [0, 1, 2, 3].map(rowDelayMs)
    assert.deepEqual(
      delays,
      delays.map((_, index) => delays[0] + index * ROW_STAGGER_MS),
    )
    for (let i = 1; i < delays.length; i++) assert.ok(delays[i] > delays[i - 1])
    assert.ok(countDelayMs() >= delays[3])
    assert.ok(countDelayMs() < delays[3] + ROW_FADE_MS)
    assert.ok(confirmationMotionEndMs() >= countDelayMs() + COUNT_MS)
  })

  it("counts up to the exact total", () => {
    for (const target of [0, 1, 99, 1598, 100000]) {
      assert.equal(countUpCents(target, -20, COUNT_MS), 0)
      assert.equal(countUpCents(target, 0, COUNT_MS), 0)
      assert.equal(countUpCents(target, COUNT_MS, COUNT_MS), target)
      assert.equal(countUpCents(target, COUNT_MS + 80, COUNT_MS), target)
      assert.equal(formatEUR(countUpCents(target, COUNT_MS, COUNT_MS)), formatEUR(target))
    }

    const mid = countUpCents(1598, COUNT_MS / 2, COUNT_MS)
    assert.ok(mid > 0 && mid < 1598)

    let prev = 0
    for (let ms = 0; ms <= COUNT_MS; ms += 20) {
      const next = countUpCents(1598, ms, COUNT_MS)
      assert.ok(next >= prev && next <= 1598)
      prev = next
    }
  })
})
