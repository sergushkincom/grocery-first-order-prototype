"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { MAX_QTY_PER_ITEM } from "@/config"
import { getProduct } from "@/data/products"
import { computeTotals, isDeliverablePostcode, pickAiFill, type Cart, type CartTotals } from "@/lib/pricing"

export type DeliveryStatus = "unknown" | "deliverable" | "not-deliverable"

export type PlacedOrder = {
  number: string
  firstName: string
  email: string
  slotLabel: string
  addressLines: [string, string]
  paymentLabel: string
  totalCents: number
  creditCents: number
  approx: boolean
  reserveCents: number
  itemCount: number
}

type ShopContextValue = {
  cart: Cart
  totals: CartTotals
  setQuantity: (id: string, qty: number) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  postcode: string | null
  deliveryStatus: DeliveryStatus
  checkPostcode: (postcode: string) => DeliveryStatus
  welcomeOpen: boolean
  setWelcomeOpen: (open: boolean) => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  search: string
  setSearch: (value: string) => void
  aiFillAdded: string[] | null
  fillWithAi: () => void
  lastOrder: PlacedOrder | null
  placeOrder: (order: PlacedOrder) => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({})
  const [postcode, setPostcode] = useState<string | null>(null)
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [cartOpen, setCartOpenState] = useState(false)
  const [search, setSearch] = useState("")
  const [aiFillAdded, setAiFillAdded] = useState<string[] | null>(null)
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)

  const totals = useMemo(() => computeTotals(cart), [cart])
  const deliveryStatus: DeliveryStatus =
    postcode === null ? "unknown" : isDeliverablePostcode(postcode) ? "deliverable" : "not-deliverable"

  const setQuantity = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(Math.floor(qty), MAX_QTY_PER_ITEM)
      return next
    })
  }, [])

  const increment = useCallback(
    (id: string) => setCart((prev) => ({ ...prev, [id]: Math.min((prev[id] ?? 0) + 1, MAX_QTY_PER_ITEM) })),
    [],
  )

  const decrement = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev }
      const qty = (next[id] ?? 0) - 1
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }, [])

  const checkPostcode = useCallback((value: string) => {
    setPostcode(value)
    return isDeliverablePostcode(value) ? "deliverable" : "not-deliverable"
  }, [])

  const setCartOpen = useCallback((open: boolean) => {
    setCartOpenState(open)
    if (!open) setAiFillAdded(null)
  }, [])

  const fillWithAi = useCallback(() => {
    const picks = pickAiFill(cart)
    if (picks.length === 0) return
    setCart((prev) => {
      const next = { ...prev }
      for (const id of picks) next[id] = Math.min((next[id] ?? 0) + 1, MAX_QTY_PER_ITEM)
      return next
    })
    const names = [...new Set(picks)].map((id) => getProduct(id)?.name ?? id)
    setAiFillAdded(names)
    setCartOpenState(true)
  }, [cart])

  const placeOrder = useCallback((order: PlacedOrder) => {
    setLastOrder(order)
    setCart({})
  }, [])

  const value: ShopContextValue = {
    cart,
    totals,
    setQuantity,
    increment,
    decrement,
    postcode,
    deliveryStatus,
    checkPostcode,
    welcomeOpen,
    setWelcomeOpen,
    cartOpen,
    setCartOpen,
    search,
    setSearch,
    aiFillAdded,
    fillWithAi,
    lastOrder,
    placeOrder,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error("useShop must be used inside ShopProvider")
  return context
}
