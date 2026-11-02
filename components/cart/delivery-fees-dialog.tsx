"use client"

import { Info } from "lucide-react"
import { DELIVERY_FEE_TIERS, FIRST_DELIVERY_FEE, type DeliveryFeeTier } from "@/config"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const amount = (value: number) =>
  value.toLocaleString("de-DE", { minimumFractionDigits: Number.isInteger(value) ? 0 : 2 })

const fee = (value: number) =>
  value === 0 ? "gratis" : value.toLocaleString("de-DE", { style: "currency", currency: "EUR" })

const tierLabel = (tier: DeliveryFeeTier) =>
  tier.to === undefined ? `ab ${amount(tier.from)} €` : `${amount(tier.from)}–${amount(tier.to)} €`

export function DeliveryFeesDialog() {
  return (
    <Dialog>
      <DialogTrigger
        aria-label="Lieferkosten nach Bestellwert anzeigen"
        className="inline-flex size-5 items-center justify-center rounded-full text-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
      >
        <Info className="size-3.5" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Lieferkosten nach Bestellwert</DialogTitle>
          <DialogDescription>Die Lieferkosten richten sich nach dem Warenwert deiner Bestellung.</DialogDescription>
        </DialogHeader>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th scope="col" className="py-2 font-medium">
                Bestellwert
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Lieferkosten
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-success/10 font-semibold text-success">
              <th scope="row" className="rounded-l-md px-2 py-2.5 text-left">
                Deine erste Lieferung
              </th>
              <td className="rounded-r-md px-2 py-2.5 text-right">{fee(FIRST_DELIVERY_FEE)}</td>
            </tr>
            {DELIVERY_FEE_TIERS.map((tier) => (
              <tr key={tier.from} className="border-b last:border-b-0">
                <th scope="row" className="px-2 py-2.5 text-left font-normal tabular-nums">
                  {tierLabel(tier)}
                </th>
                <td className="px-2 py-2.5 text-right font-medium tabular-nums">{fee(tier.fee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <DialogFooter>
          <DialogClose render={<Button className="w-full sm:w-auto" />}>OK, verstanden</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
