"use client"

import { Info } from "lucide-react"
import { WEIGHED_RESERVE_RATE } from "@/config"
import { MIN_ORDER_CENTS, type CartTotals } from "@/lib/pricing"
import { formatEUR } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Price } from "@/components/price"
import { DeliveryFeesDialog } from "@/components/cart/delivery-fees-dialog"
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

type CartSummaryProps = {
  totals: CartTotals
  showReserveNote?: boolean
  className?: string
  children?: React.ReactNode
}

export function CartSummary({ totals, showReserveNote = true, className, children }: CartSummaryProps) {
  return (
    <section
      aria-labelledby="cart-summary-title"
      className={cn("rounded-xl bg-summary p-4 text-summary-foreground", className)}
    >
      <h2 id="cart-summary-title" className="text-base font-bold">
        Zusammenfassung
      </h2>
      <dl className="mt-3 flex flex-col gap-1.5 text-sm">
        <Row label="Warenwert" value={`${totals.hasWeighed ? "ca. " : ""}${formatEUR(totals.subtotalCents)}`} />
        {totals.pfandCents > 0 && <Row label="Pfand" value={formatEUR(totals.pfandCents)} />}
        <Row label="Lieferung" hint="erste Lieferung" info={<DeliveryFeesDialog />} value={formatEUR(totals.deliveryCents)} />
        {totals.minReached ? (
          <Row label="Guthaben" value={`−${formatEUR(totals.creditCents)}`} valueClassName="text-[#8fd19e]" />
        ) : (
          <Row label="Guthaben" hint={`ab ${formatEUR(MIN_ORDER_CENTS)}`} value="−" valueClassName="text-white/50" />
        )}
      </dl>
      <div className="mt-3 flex items-end justify-between border-t border-white/15 pt-3">
        <span className="font-semibold">Gesamt</span>
        <Price cents={totals.totalCents} size="lg" approx={totals.hasWeighed} />
      </div>
      {totals.hasWeighed && <WeighedNote totals={totals} showReserve={showReserveNote} />}
      {children}
    </section>
  )
}

function WeighedNote({ totals, showReserve }: { totals: CartTotals; showReserve: boolean }) {
  const reserve = formatEUR(totals.weighedReserveCents)
  const percent = `${Math.round(WEIGHED_RESERVE_RATE * 100)} %`

  return (
    <div className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-white/70">
      <Popover>
        <PopoverTrigger
          aria-label="Mehr zu Wiegeware und Kartenreservierung"
          className="mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full text-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
        >
          <Info className="size-3.5" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="flex flex-col gap-2 text-xs leading-relaxed">
          <PopoverTitle className="text-sm">Wiegeware & Kartenreservierung</PopoverTitle>
          <PopoverDescription>
            Obst, Gemüse und Käse an der Theke werden nach dem tatsächlichen Gewicht berechnet. Der Endbetrag kann
            daher leicht vom angezeigten „ca.“-Preis abweichen.
          </PopoverDescription>
          <PopoverDescription>
            Bei Zahlung mit Karte, Apple Pay oder Google Pay reservieren wir zusätzlich bis zu {percent} des Werts der
            Wiegeware (aktuell bis zu {reserve}).
          </PopoverDescription>
          <PopoverDescription>
            Abgebucht wird nur der tatsächliche Betrag. Die nicht benötigte Reservierung geben wir direkt nach der
            Lieferung frei.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
      <p>
        Wiegeware: Endbetrag kann leicht abweichen
        {showReserve && ` · Karte: bis zu ${reserve} reserviert`}
      </p>
    </div>
  )
}

function Row({
  label,
  value,
  hint,
  info,
  valueClassName,
}: {
  label: string
  value: string
  hint?: string
  info?: React.ReactNode
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-1 text-white/80">
        {label}
        {hint && <span className="ml-0.5 text-xs text-white/50">({hint})</span>}
        {info}
      </dt>
      <dd className={cn("font-medium tabular-nums", valueClassName)}>{value}</dd>
    </div>
  )
}
