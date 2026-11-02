"use client"

import { useId, useState } from "react"
import { ChevronUp } from "lucide-react"
import type { CartTotals } from "@/lib/pricing"
import { cn } from "@/lib/utils"
import { Price } from "@/components/price"
import { CartSummary } from "@/components/cart/cart-summary"

type MobileSummaryBarProps = {
  totals: CartTotals
  showReserveNote?: boolean
  action: React.ReactNode
}

export function MobileSummaryBar({ totals, showReserveNote, action }: MobileSummaryBarProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-summary text-summary-foreground shadow-[0_-6px_20px_rgba(0,0,0,0.18)] lg:hidden">
      <div id={panelId} hidden={!open} className="max-h-[60vh] overflow-y-auto border-b border-white/15 px-4 pb-4 pt-3">
        <CartSummary
          totals={totals}
          showReserveNote={showReserveNote}
          headingId={`${panelId}-title`}
          className="rounded-none bg-transparent p-0"
        />
      </div>
      <div className="flex items-center gap-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex shrink-0 flex-col items-start rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="flex items-center gap-1 text-xs text-white/70">
            Gesamt
            <ChevronUp className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
          </span>
          <Price cents={totals.totalCents} approx={totals.hasWeighed} />
          <span className="sr-only">{open ? "Zusammenfassung ausblenden" : "Zusammenfassung anzeigen"}</span>
        </button>
        <div className="min-w-0 flex-1">{action}</div>
      </div>
    </div>
  )
}
