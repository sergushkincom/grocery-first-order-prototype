import {
  AI_FILL_PRODUCT_IDS,
  DELIVERABLE_POSTCODES,
  FIRST_DELIVERY_FEE,
  MAX_QTY_PER_ITEM,
  MIN_ORDER,
  WEIGHED_RESERVE_RATE,
  WELCOME_CREDIT,
} from "@/config"
import { getProduct, type Product } from "@/data/products"
import { toCents } from "@/lib/format"

export type Cart = Record<string, number>

export type CartLine = {
  product: Product
  qty: number
  lineCents: number
  pfandCents: number
}

export type CartTotals = ReturnType<typeof computeTotals>

export const MIN_ORDER_CENTS = toCents(MIN_ORDER)
export const WELCOME_CREDIT_CENTS = toCents(WELCOME_CREDIT)

export function computeTotals(cart: Cart) {
  const lines: CartLine[] = []
  for (const [id, qty] of Object.entries(cart)) {
    const product = getProduct(id)
    if (!product || qty <= 0) continue
    lines.push({
      product,
      qty,
      lineCents: toCents(product.price) * qty,
      pfandCents: toCents(product.pfand ?? 0) * qty,
    })
  }

  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0)
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineCents, 0)
  const pfandCents = lines.reduce((sum, line) => sum + line.pfandCents, 0)
  const weighedCents = lines.filter((l) => l.product.weighed).reduce((sum, l) => sum + l.lineCents, 0)

  const minReached = subtotalCents >= MIN_ORDER_CENTS
  const remainingCents = Math.max(0, MIN_ORDER_CENTS - subtotalCents)
  const deliveryCents = toCents(FIRST_DELIVERY_FEE)
  const creditCents = minReached ? Math.min(WELCOME_CREDIT_CENTS, subtotalCents + pfandCents + deliveryCents) : 0

  return {
    lines,
    itemCount,
    subtotalCents,
    pfandCents,
    deliveryCents,
    creditCents,
    totalCents: subtotalCents + pfandCents + deliveryCents - creditCents,
    goodsWithPfandCents: subtotalCents + pfandCents,
    hasWeighed: weighedCents > 0,
    weighedReserveCents: Math.round(weighedCents * WEIGHED_RESERVE_RATE),
    minReached,
    remainingCents,
    progress: Math.min(1, subtotalCents / MIN_ORDER_CENTS),
  }
}

export function isValidPostcodeFormat(postcode: string) {
  return /^\d{5}$/.test(postcode)
}

export function isDeliverablePostcode(postcode: string) {
  if (!isValidPostcodeFormat(postcode)) return false
  const value = Number(postcode)
  return value >= DELIVERABLE_POSTCODES.from && value <= DELIVERABLE_POSTCODES.to
}

/** Mock "AI": greedily picks suggested items until the minimum order value is reached. */
export function pickAiFill(cart: Cart): string[] {
  const pool = AI_FILL_PRODUCT_IDS.map(getProduct)
    .filter((p): p is Product => Boolean(p))
    .sort((a, b) => a.price - b.price)
  const picks: string[] = []
  let remaining = computeTotals(cart).remainingCents
  const draft: Cart = { ...cart }

  while (remaining > 0 && picks.length < 10) {
    const available = pool.filter((p) => (draft[p.id] ?? 0) < MAX_QTY_PER_ITEM)
    if (available.length === 0) break
    const fresh = available.filter((p) => !draft[p.id])
    const candidates = fresh.length > 0 ? fresh : available
    const pick = candidates.find((p) => toCents(p.price) >= remaining) ?? candidates[candidates.length - 1]
    draft[pick.id] = (draft[pick.id] ?? 0) + 1
    picks.push(pick.id)
    remaining -= toCents(pick.price)
  }
  return picks
}
