import { MIN_ORDER_CENTS, type CartTotals } from "@/lib/pricing"
import { formatEUR } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Price } from "@/components/price"

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
      className={cn("rounded-xl bg-summary p-5 text-summary-foreground", className)}
    >
      <h2 id="cart-summary-title" className="text-base font-bold">
        Zusammenfassung
      </h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <Row label="Warenwert" value={`${totals.hasWeighed ? "ca. " : ""}${formatEUR(totals.subtotalCents)}`} />
        <Row label="Pfand" value={formatEUR(totals.pfandCents)} />
        <Row label="Lieferung" hint="erste Lieferung" value={formatEUR(totals.deliveryCents)} />
        {totals.minReached ? (
          <Row label="Guthaben" value={`−${formatEUR(totals.creditCents)}`} valueClassName="text-[#8fd19e]" />
        ) : (
          <Row label="Guthaben" hint={`ab ${formatEUR(MIN_ORDER_CENTS)} Warenwert`} value="−" valueClassName="text-white/50" />
        )}
      </dl>
      <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-4">
        <span className="font-semibold">Gesamt</span>
        <Price cents={totals.totalCents} size="lg" approx={totals.hasWeighed} />
      </div>
      {totals.hasWeighed && (
        <div className="mt-3 flex flex-col gap-1.5 text-xs leading-relaxed text-white/70">
          <p>„ca.“: Wiegeware wird nach tatsächlichem Gewicht berechnet, der Endbetrag kann leicht abweichen.</p>
          {showReserveNote && (
            <p>
              Bei Kartenzahlung reservieren wir bis zu {formatEUR(totals.weighedReserveCents)} mehr für Wiegeware – die
              Differenz geben wir nach der Lieferung frei.
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

function Row({
  label,
  value,
  hint,
  valueClassName,
}: {
  label: string
  value: string
  hint?: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-white/80">
        {label}
        {hint && <span className="ml-1.5 text-xs text-white/50">({hint})</span>}
      </dt>
      <dd className={cn("font-medium tabular-nums", valueClassName)}>{value}</dd>
    </div>
  )
}
