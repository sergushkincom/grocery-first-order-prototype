"use client"

import Link from "next/link"
import { ShoppingBasket, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useShop } from "@/lib/shop-store"
import { CartItemRow } from "@/components/cart/cart-item-row"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartCheckoutAction } from "@/components/cart/cart-checkout-action"

export function CartDrawer() {
  const { cartOpen, setCartOpen, totals, aiFillAdded } = useShop()

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
          {totals.lines.length > 0 ? (
            <ul className="divide-y">
              {totals.lines.map((line) => (
                <CartItemRow key={line.product.id} line={line} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <ShoppingBasket className="size-10" aria-hidden="true" />
              <p className="font-medium text-foreground">Dein Warenkorb ist noch leer.</p>
              <p className="text-sm">Leg los – die erste Lieferung ist gratis.</p>
            </div>
          )}
        </div>

        <div className="border-t bg-card p-4">
          <CartSummary totals={totals}>
            <CartCheckoutAction />
          </CartSummary>
          {totals.itemCount > 0 && (
            <Link
              href="/warenkorb"
              onClick={() => setCartOpen(false)}
              className="mt-3 block text-center text-sm font-semibold text-secondary-foreground underline underline-offset-4"
            >
              Warenkorb als Seite ansehen
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
