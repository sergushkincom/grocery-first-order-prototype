"use client"

import { CircleCheck, Clock, MapPin, Sparkles, Truck } from "lucide-react"
import { DELIVERY_CITY, NEXT_SLOT, WELCOME_CREDIT } from "@/config"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"

export function DealBar() {
  return (
    <div className="border-t bg-secondary/60">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-2 text-sm md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8">
        <DeliveryInfo />
        <MinimumProgress />
      </div>
    </div>
  )
}

function DeliveryInfo() {
  const { postcode, deliveryStatus, setWelcomeOpen } = useShop()

  if (deliveryStatus === "unknown") {
    return (
      <button
        type="button"
        onClick={() => setWelcomeOpen(true)}
        className="flex items-center gap-1.5 self-start font-semibold text-secondary-foreground underline-offset-4 hover:underline"
      >
        <MapPin className="size-4" aria-hidden="true" />
        Lieferadresse prüfen
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <button
        type="button"
        onClick={() => setWelcomeOpen(true)}
        className="flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
        aria-label={`Postleitzahl ${postcode} ändern`}
      >
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        {postcode} {deliveryStatus === "deliverable" ? DELIVERY_CITY : ""}
      </button>
      {deliveryStatus === "deliverable" ? (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-4" aria-hidden="true" />
          Nächster Slot: <span className="font-medium text-foreground">{`${NEXT_SLOT.day} ${NEXT_SLOT.time}`}</span>
        </span>
      ) : (
        <span className="text-destructive">Noch nicht im Liefergebiet</span>
      )}
    </div>
  )
}

function MinimumProgress() {
  const { totals, fillWithAi } = useShop()
  const credit = `${WELCOME_CREDIT.toLocaleString("de-DE")} € Guthaben`

  return (
    <div className="flex flex-col gap-1.5 md:min-w-[28rem] md:max-w-xl md:flex-1">
      <div className="flex items-start justify-between gap-3">
        <p className={cn("flex items-start gap-1.5", totals.minReached && "text-success")} aria-live="polite">
          {totals.minReached ? (
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Truck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          )}
          {totals.minReached ? (
            <span>
              <strong>Mindestbestellwert erreicht</strong> – erste Lieferung gratis + {credit}
            </span>
          ) : (
            <span>
              <strong className="tabular-nums">Noch {formatEUR(totals.remainingCents)}</strong> bis zum
              Mindestbestellwert – dann erste Lieferung gratis + {credit}
            </span>
          )}
        </p>
        {!totals.minReached && (
          <button
            type="button"
            onClick={fillWithAi}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-secondary-foreground underline underline-offset-4 hover:text-foreground"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Mit KI auffüllen
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Fortschritt zum Mindestbestellwert"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(totals.progress * 100)}
        className="h-1.5 overflow-hidden rounded-full bg-black/10"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", totals.minReached ? "bg-success" : "bg-primary")}
          style={{ width: `${totals.progress * 100}%` }}
        />
      </div>
    </div>
  )
}
