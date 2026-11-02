"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useShop } from "@/lib/shop-store"
import { CartItemRow } from "@/components/cart/cart-item-row"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartCheckoutAction } from "@/components/cart/cart-checkout-action"

export function CartPageContent() {
  const { totals } = useShop()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Weiter einkaufen
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Warenkorb</h1>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <section aria-label="Artikel" className="rounded-xl bg-card px-4 ring-1 ring-border sm:px-6">
          {totals.lines.length > 0 ? (
            <ul className="divide-y">
              {totals.lines.map((line) => (
                <CartItemRow key={line.product.id} line={line} />
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <p className="font-semibold">Dein Warenkorb ist noch leer.</p>
              <Link href="/" className="mt-2 inline-block text-sm font-semibold text-secondary-foreground underline underline-offset-4">
                Zu den Produkten
              </Link>
            </div>
          )}
        </section>
        <CartSummary totals={totals} className="lg:sticky lg:top-44">
          <CartCheckoutAction />
        </CartSummary>
      </div>
    </div>
  )
}
