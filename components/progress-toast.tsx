import { toast } from "sonner"
import { Check, Truck } from "lucide-react"
import { MIN_ORDER } from "@/config"
import { formatEUR } from "@/lib/format"
import type { ThresholdCrossing } from "@/lib/minimum-threshold"
import type { CartTotals } from "@/lib/pricing"
import { MinimumMeter } from "@/components/minimum-meter"

/** The Toaster lives outside ShopProvider, so the toast gets a snapshot of the totals at add time. */
export function showProgressToast(productName: string, totals: CartTotals, crossing: ThresholdCrossing = "none") {
  const celebrate = crossing === "reached"
  toast.custom(
    () => (
      <div className="flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 rounded-xl bg-summary px-4 py-3 text-sm text-summary-foreground shadow-lg">
        <p className="font-semibold">{productName} hinzugefügt</p>
        <p className="flex items-center gap-1.5 text-xs">
          {totals.minReached ? (
            <>
              <Check className="size-4 shrink-0 text-[#8fd19e]" aria-hidden="true" />
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
        <MinimumMeter progress={totals.progress} reached={totals.minReached} glowing={celebrate} tone="dark" decorative />
      </div>
    ),
    { id: "cart-progress", duration: 3000 },
  )
}
