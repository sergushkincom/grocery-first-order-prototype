import { toast } from "sonner"
import { CircleCheck, Truck } from "lucide-react"
import { MIN_ORDER } from "@/config"
import { formatEUR } from "@/lib/format"
import type { CartTotals } from "@/lib/pricing"

/** The Toaster lives outside ShopProvider, so the toast gets a snapshot of the totals at add time. */
export function showProgressToast(productName: string, totals: CartTotals) {
  toast.custom(
    () => (
      <div className="flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 rounded-xl bg-summary px-4 py-3 text-sm text-summary-foreground shadow-lg">
        <p className="font-semibold">{productName} hinzugefügt</p>
        <p className="flex items-center gap-1.5 text-xs">
          {totals.minReached ? (
            <>
              <CircleCheck className="size-4 shrink-0 text-[#8fd19e]" aria-hidden="true" />
              <span className="text-[#8fd19e]">Mindestbestellwert erreicht</span>
            </>
          ) : (
            <>
              <Truck className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Noch <strong className="tabular-nums">{formatEUR(totals.remainingCents)}</strong> bis{" "}
                {`${MIN_ORDER.toLocaleString("de-DE")} €`} Mindestbestellwert
              </span>
            </>
          )}
        </p>
        <div className="h-[6px] overflow-hidden rounded-full bg-white/25" aria-hidden="true">
          <div className="h-full rounded-full bg-primary" style={{ width: `${totals.progress * 100}%` }} />
        </div>
      </div>
    ),
    { id: "cart-progress", duration: 3000 },
  )
}
