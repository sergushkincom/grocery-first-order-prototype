"use client"

import Link from "next/link"
import { ShoppingBasket, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"
import { CartItemRow } from "@/components/cart/cart-item-row"
import { CartListActions } from "@/components/cart/cart-list-actions"
import { MinimumProgress } from "@/components/deal-bar"

export function CartDrawer() {
  const { cartOpen, setCartOpen, totals, aiFillAdded } = useShop()
  const hasItems = totals.lines.length > 0

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b bg-card pr-12">
          <SheetTitle className="text-lg font-bold">Warenkorb</SheetTitle>
          <SheetDescription>
            {totals.itemCount === 1 ? "1 Artikel" : `${totals.itemCount} Artikel`}
          </SheetDescription>
        </SheetHeader>

        {aiFillAdded && (
          <p className="mx-4 mt-4 flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground" role="status">
            <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Mit KI ergänzt:</strong> {aiFillAdded.join(", ")}. Passt etwas nicht? Einfach entfernen.
            </span>
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {hasItems ? (
            <>
              <ul className="divide-y">
                {totals.lines.map((line) => (
                  <CartItemRow key={line.product.id} line={line} />
                ))}
              </ul>
              <CartListActions className="border-t py-4" />
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <ShoppingBasket className="size-10" aria-hidden="true" />
              <p className="font-medium text-foreground">Dein Warenkorb ist noch leer.</p>
              <p className="text-sm">Leg los – die erste Lieferung ist gratis.</p>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="border-t bg-card p-4">
            <div className="flex flex-col gap-3 rounded-xl bg-summary p-4 text-sm text-summary-foreground">
              <MinimumProgress tone="dark" live={false} />
              <div className="flex items-center justify-between">
                <span className="text-white/80">Warenwert</span>
                <span className="font-semibold tabular-nums">
                  {totals.hasWeighed ? "ca. " : ""}
                  {formatEUR(totals.subtotalCents)}
                </span>
              </div>
              <Link
                href="/warenkorb"
                onClick={() => setCartOpen(false)}
                className="grid h-12 place-items-center rounded-lg bg-primary px-5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {"Weiter zum Warenkorb ›"}
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
