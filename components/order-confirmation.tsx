"use client"

import Link from "next/link"
import { CircleCheck, Clock, CreditCard, MapPin } from "lucide-react"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"

export function OrderConfirmation() {
  const { lastOrder } = useShop()

  if (!lastOrder) {
    return (
      <div className="rounded-xl bg-card p-8 text-center ring-1 ring-border">
        <h1 className="text-xl font-bold">Keine Bestellung gefunden</h1>
        <p className="mt-2 text-sm text-muted-foreground">Leg ein paar Produkte in den Warenkorb, um zu bestellen.</p>
        <Link href="/" className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90">
          Zu den Produkten
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="flex flex-col items-center gap-2 bg-success px-6 py-8 text-center text-white">
        <CircleCheck className="size-12" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-balance">Danke, {lastOrder.firstName}! Deine Bestellung ist eingegangen.</h1>
        <p className="text-sm text-white/85">
          Bestellnummer <span className="font-semibold">{lastOrder.number}</span> · Bestätigung an {lastOrder.email}
        </p>
      </div>
      <dl className="divide-y px-6">
        <Item icon={Clock} label="Lieferung" value={lastOrder.slotLabel} />
        <Item icon={MapPin} label="Adresse" value={lastOrder.addressLines.join(", ")} />
        <Item icon={CreditCard} label="Zahlung" value={lastOrder.paymentLabel} />
        <div className="flex items-baseline justify-between py-4">
          <dt className="font-semibold">Gesamt ({lastOrder.itemCount} Artikel)</dt>
          <dd className="text-lg font-bold tabular-nums">
            {lastOrder.approx ? "ca. " : ""}
            {formatEUR(lastOrder.totalCents)}
          </dd>
        </div>
      </dl>
      <div className="flex flex-col gap-1 bg-background px-6 py-4 text-xs text-muted-foreground">
        <p>Erste Lieferung gratis · {formatEUR(lastOrder.creditCents)} Startguthaben wurde abgezogen.</p>
        {lastOrder.approx && <p>Wiegeware rechnen wir nach tatsächlichem Gewicht ab.</p>}
        {lastOrder.reserveCents > 0 && (
          <p>Zusätzlich reserviert: bis zu {formatEUR(lastOrder.reserveCents)} – wird nach der Lieferung freigegeben.</p>
        )}
      </div>
      <div className="p-6">
        <Link href="/" className="grid h-12 place-items-center rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          Weiter einkaufen
        </Link>
      </div>
    </div>
  )
}

function Item({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 text-sm">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
