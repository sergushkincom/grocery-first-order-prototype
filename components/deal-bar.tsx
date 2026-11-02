"use client"

import { CircleCheck, Clock, MapPin, Sparkles, Truck } from "lucide-react"
import { DELIVERY_CITY, MIN_ORDER, NEXT_SLOT, WELCOME_CREDIT } from "@/config"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"

export function DealBar() {
  return (
    <div className="border-t bg-secondary/60">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-2 text-sm md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8">
        <DeliveryInfo />
        <MinimumProgress className="md:min-w-[30rem] md:max-w-2xl md:flex-1" />
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

/** `live` is off for secondary copies so screen readers don't announce the same change twice. */
export function MinimumProgress({
  className,
  live = true,
  tone = "light",
}: {
  className?: string
  live?: boolean
  tone?: "light" | "dark"
}) {
  const { totals, suggestAiFill } = useShop()
  const credit = `${WELCOME_CREDIT.toLocaleString("de-DE")} € Guthaben`
  const dark = tone === "dark"
  const textClass = dark ? undefined : "truncate"

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex justify-between gap-3", dark ? "items-start" : "items-center")}>
        <p
          className={cn(
            "flex min-w-0 gap-1.5",
            dark ? "items-start" : "items-center",
            totals.minReached && (dark ? "text-[#8fd19e]" : "text-success"),
          )}
          aria-live={live ? "polite" : undefined}
        >
          {totals.minReached ? (
            <CircleCheck className={cn("size-4 shrink-0", dark && "mt-0.5")} aria-hidden="true" />
          ) : (
            <Truck className={cn("size-4 shrink-0 text-primary", dark && "mt-0.5")} aria-hidden="true" />
          )}
          {totals.minReached ? (
            <span className={textClass}>
              <strong>Mindestbestellwert erreicht</strong> – erste Lieferung gratis + {credit}
            </span>
          ) : (
            <span className={textClass}>
              <strong className="tabular-nums">Noch {formatEUR(totals.remainingCents)}</strong> bis{" "}
              {`${MIN_ORDER.toLocaleString("de-DE")} €`} Mindestbestellwert · erste Lieferung gratis
            </span>
          )}
        </p>
        {!totals.minReached && (
          <button
            type="button"
            onClick={suggestAiFill}
            className={cn(
              "flex shrink-0 items-center gap-1 text-xs font-semibold underline underline-offset-4",
              dark ? "mt-0.5 text-primary hover:text-primary/80" : "text-secondary-foreground hover:text-foreground",
            )}
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
        className={cn("h-[6px] overflow-hidden rounded-full", dark ? "bg-white/25" : "bg-neutral-300")}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${totals.progress * 100}%` }}
        />
      </div>
    </div>
  )
}
