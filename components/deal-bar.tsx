"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Clock, MapPin, Sparkles } from "lucide-react"
import { Check, Truck } from "lucide"
import { MorphIcon } from "morphicons/react"
import { DELIVERY_CITY, MIN_ORDER, NEXT_SLOT, WELCOME_CREDIT } from "@/config"
import { formatEUR } from "@/lib/format"
import { minimumLiveAnnouncement, playsReachedGlow, thresholdCrossing } from "@/lib/minimum-threshold"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"
import { MinimumMeter } from "@/components/minimum-meter"

const MORPH_SPRING = { stiffness: 120, damping: 22 }
const GLOW_MS = 720

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  )
}

/** Glows for one short beat after the cart crosses the minimum, then turns itself off. */
function useReachedGlow(minReached: boolean) {
  const reducedMotion = usePrefersReducedMotion()
  const [wasReached, setWasReached] = useState(minReached)
  const [glowing, setGlowing] = useState(false)

  if (minReached !== wasReached) {
    const crossing = thresholdCrossing(wasReached, minReached)
    setWasReached(minReached)
    if (playsReachedGlow(crossing, reducedMotion)) setGlowing(true)
    else if (crossing === "dropped") setGlowing(false)
  }

  useEffect(() => {
    if (!glowing) return
    const timer = window.setTimeout(() => setGlowing(false), GLOW_MS)
    return () => window.clearTimeout(timer)
  }, [glowing])

  return glowing
}

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
  const glowing = useReachedGlow(totals.minReached)
  const creditAmount = `${WELCOME_CREDIT.toLocaleString("de-DE")} €`
  const credit = `${creditAmount} Guthaben`
  const dark = tone === "dark"
  const textClass = dark ? undefined : "truncate"

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {live && (
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {minimumLiveAnnouncement(totals.minReached, formatEUR(totals.remainingCents), creditAmount)}
        </p>
      )}
      <div className={cn("flex justify-between gap-3", dark ? "items-start" : "items-center")}>
        <p
          className={cn(
            "flex min-w-0 gap-1.5",
            dark ? "items-start" : "items-center",
            totals.minReached && (dark ? "text-[#8fd19e]" : "text-success"),
          )}
        >
          <MorphIcon
            icon={totals.minReached ? Check : Truck}
            size={16}
            strokeWidth={2}
            color="currentColor"
            spring={MORPH_SPRING}
            reducedMotion="user"
            className={cn(
              "shrink-0 transition-colors duration-500 ease-out motion-reduce:transition-none",
              totals.minReached ? (dark ? "text-[#8fd19e]" : "text-success") : "text-primary",
              dark && "mt-0.5",
            )}
          />
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
      <MinimumMeter progress={totals.progress} reached={totals.minReached} glowing={glowing} tone={tone} />
    </div>
  )
}
