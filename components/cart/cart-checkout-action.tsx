"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { MIN_ORDER_CENTS } from "@/lib/pricing"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"

export function CartCheckoutAction({ compact = false }: { compact?: boolean }) {
  const { totals, setCartOpen, suggestAiFill } = useShop()
  const empty = totals.itemCount === 0
  const blocked = empty || !totals.minReached

  if (compact) {
    return blocked ? (
      <button
        type="button"
        disabled
        aria-label={`Zur Kasse – noch ${formatEUR(totals.remainingCents)} bis zum Mindestbestellwert`}
        className="h-12 w-full cursor-not-allowed rounded-lg bg-white/15 px-4 font-bold text-white/50"
      >
        Zur Kasse
      </button>
    ) : (
      <Link
        href="/kasse"
        className="grid h-12 w-full place-items-center rounded-lg bg-primary px-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Zur Kasse
      </Link>
    )
  }

  return (
    <div className="mt-5 flex items-center gap-3">
      {blocked ? (
        <button
          type="button"
          disabled
          aria-describedby="checkout-blocked-reason"
          className="h-12 shrink-0 cursor-not-allowed rounded-lg bg-white/15 px-5 font-bold text-white/50"
        >
          Zur Kasse
        </button>
      ) : (
        <Link
          href="/kasse"
          onClick={() => setCartOpen(false)}
          className="grid h-12 flex-1 place-items-center rounded-lg bg-primary px-5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Zur Kasse
        </Link>
      )}
      {blocked && (
        <div id="checkout-blocked-reason" className="text-xs leading-snug text-white/80">
          {empty ? (
            "Dein Warenkorb ist leer."
          ) : (
            <>
              <p>
                Noch <strong className="text-white">{formatEUR(totals.remainingCents)}</strong> bis zum Mindestbestellwert
                von {formatEUR(MIN_ORDER_CENTS)}.
              </p>
              <button
                type="button"
                onClick={suggestAiFill}
                className="mt-1 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4"
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Mit KI auffüllen
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
