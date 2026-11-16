import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { DELIVERABLE_POSTCODES, DELIVERY_CITY } from "@/config"
import { validateAddress, type Address } from "@/lib/checkout"

const outsideMunich = `Wir liefern nur nach ${DELIVERY_CITY} (${DELIVERABLE_POSTCODES.from}–${DELIVERABLE_POSTCODES.to}).`

function address(postcode: string): Address {
  return { street: "Sendlinger Straße", number: "12", postcode, city: "München" }
}

describe("checkout postcode", () => {
  it("accepts an address on either edge of the delivery range", () => {
    assert.deepEqual(validateAddress(address("80331")), {})
    assert.deepEqual(validateAddress(address("81929")), {})
    assert.deepEqual(validateAddress(address(" 80331 ")), {})
    assert.deepEqual(validateAddress(address(" 81929 ")), {})
  })

  it("rejects the codes one step outside the range", () => {
    assert.deepEqual(validateAddress(address("80330")), { postcode: outsideMunich })
    assert.deepEqual(validateAddress(address("81930")), { postcode: outsideMunich })
    assert.deepEqual(validateAddress(address(" 80330 ")), { postcode: outsideMunich })
  })

  it("tells a short or empty code apart from a code outside Munich", () => {
    assert.deepEqual(validateAddress(address("")), { postcode: "Bitte gib deine PLZ an." })
    assert.deepEqual(validateAddress(address("   ")), { postcode: "Bitte gib deine PLZ an." })
    assert.deepEqual(validateAddress(address("8033")), { postcode: "Die PLZ hat 5 Ziffern." })
    assert.deepEqual(validateAddress(address("803311")), { postcode: "Die PLZ hat 5 Ziffern." })
  })
})
