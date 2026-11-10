"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CATEGORIES } from "@/data/products"
import { useShop } from "@/lib/shop-store"
import { CartItemRow } from "@/components/cart/cart-item-row"
import { CartListActions } from "@/components/cart/cart-list-actions"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartCheckoutAction } from "@/components/cart/cart-checkout-action"
import { MobileSummaryBar } from "@/components/cart/mobile-summary-bar"
import { Switch } from "@/components/ui/switch"

export function CartPageContent() {
  const { totals } = useShop()
  const [grouped, setGrouped] = useState(true)
  const groups = CATEGORIES.map((category) => ({
    category,
    lines: totals.lines.filter((line) => line.product.category === category.id),
  })).filter((group) => group.lines.length > 0)
  const hasItems = groups.length > 0

  return (
    <div className="flex flex-col gap-6 pt-6 lg:pt-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Weiter einkaufen
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Warenkorb</h1>
          {hasItems && (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              Nach Kategorien
              <Switch checked={grouped} onCheckedChange={setGrouped} />
            </label>
          )}
        </div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        {hasItems ? (
          <div
            aria-label={grouped ? "Artikel nach Kategorie" : "Artikel"}
            role="region"
            className="flex min-w-0 flex-col gap-4"
          >
            {grouped ? (
              groups.map(({ category, lines }) => (
                <section
                  key={category.id}
                  aria-labelledby={`cart-cat-${category.id}`}
                  className="rounded-xl bg-card px-4 pt-4 ring-1 ring-border sm:px-6"
                >
                  <h2 id={`cart-cat-${category.id}`} className="text-sm font-bold">
                    {category.label}
                  </h2>
                  <ul className="divide-y">
                    {lines.map((line) => (
                      <CartItemRow key={line.product.id} line={line} />
                    ))}
                  </ul>
                </section>
              ))
            ) : (
              <div className="rounded-xl bg-card px-4 ring-1 ring-border sm:px-6">
                <ul className="divide-y">
                  {groups.flatMap(({ lines }) => lines).map((line) => (
                    <CartItemRow key={line.product.id} line={line} />
                  ))}
                </ul>
              </div>
            )}
            <CartListActions />
          </div>
        ) : (
          <section aria-label="Artikel" className="rounded-xl bg-card px-4 py-16 text-center ring-1 ring-border sm:px-6">
            <p className="font-semibold">Dein Warenkorb ist noch leer.</p>
            <Link href="/" className="mt-2 inline-block text-sm font-semibold text-secondary-foreground underline underline-offset-4">
              Zu den Produkten
            </Link>
          </section>
        )}
        <CartSummary totals={totals} className="hidden lg:sticky lg:top-48 lg:block">
          <CartCheckoutAction />
        </CartSummary>
      </div>
      {hasItems && <MobileSummaryBar totals={totals} action={<CartCheckoutAction compact />} />}
    </div>
  )
}
