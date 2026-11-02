export const SHOP_NAME = "Grocery Prototype"

/** Minimum goods value (EUR) for the first order. Pfand does not count toward it. */
export const MIN_ORDER = 20.0
/** Delivery fee (EUR) for the first delivery. */
export const FIRST_DELIVERY_FEE = 0.0
export type DeliveryFeeTier = {
  /** Lower bound of the goods value (EUR), inclusive. */
  from: number
  /** Upper bound of the goods value (EUR), exclusive. Omit for the open-ended top tier. */
  to?: number
  /** Delivery fee (EUR). 0 means free. */
  fee: number
}

/** Mock delivery fees by goods value for regular (non-first) orders. */
export const DELIVERY_FEE_TIERS: DeliveryFeeTier[] = [
  { from: 20, to: 49, fee: 3.9 },
  { from: 49, to: 79, fee: 1.9 },
  { from: 79, fee: 0 },
]

/** Welcome credit (EUR), applied at checkout once the minimum is reached. */
export const WELCOME_CREDIT = 10.0

export const DELIVERY_CITY = "München"
export const DELIVERABLE_POSTCODES = { from: 80331, to: 81929 } as const

/** Share of the weighed-item value additionally reserved on card payments. */
export const WEIGHED_RESERVE_RATE = 0.3

export const MAX_QTY_PER_ITEM = 20

export type DeliverySlot = {
  id: string
  day: "heute" | "morgen"
  time: string
}

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: "today-14", day: "heute", time: "14–15 Uhr" },
  { id: "today-16", day: "heute", time: "16–17 Uhr" },
  { id: "today-18", day: "heute", time: "18–19 Uhr" },
  { id: "today-20", day: "heute", time: "20–21 Uhr" },
  { id: "tomorrow-08", day: "morgen", time: "8–9 Uhr" },
  { id: "tomorrow-10", day: "morgen", time: "10–11 Uhr" },
  { id: "tomorrow-13", day: "morgen", time: "13–14 Uhr" },
  { id: "tomorrow-17", day: "morgen", time: "17–18 Uhr" },
]

export const NEXT_SLOT = DELIVERY_SLOTS[0]

export type PaymentMethodId = "card" | "applepay" | "googlepay" | "klarna" | "paypal" | "courier"

export type PaymentMethod = {
  id: PaymentMethodId
  label: string
  description?: string
  group: "Online" | "PayPal" | "Bei Lieferung"
  /** Card-based methods reserve extra funds for weighed items. */
  reservesWeighed: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "card", label: "Kredit- oder Debitkarte", group: "Online", reservesWeighed: true },
  { id: "applepay", label: "Apple Pay", group: "Online", reservesWeighed: true },
  { id: "googlepay", label: "Google Pay", group: "Online", reservesWeighed: true },
  { id: "klarna", label: "Klarna Rechnung", description: "Bezahle in 30 Tagen", group: "Online", reservesWeighed: false },
  { id: "paypal", label: "PayPal", group: "PayPal", reservesWeighed: false },
  {
    id: "courier",
    label: "Kontaktlos beim Kurier",
    description: "Mit Karte oder Smartphone an der Tür",
    group: "Bei Lieferung",
    reservesWeighed: false,
  },
]

/** Products the mock "Mit KI auffüllen" may add, in order of preference. */
export const AI_FILL_PRODUCT_IDS = ["gurke", "spaghetti", "milch", "orangensaft", "butter", "eier", "brot"]
