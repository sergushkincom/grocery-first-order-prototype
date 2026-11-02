"use client"

import { useState } from "react"
import { ListPlus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const secondaryButton =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function CartListActions({ className }: { className?: string }) {
  const { totals, clearCart } = useShop()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (totals.itemCount === 0) return null

  const countLabel = totals.itemCount === 1 ? "1 Artikel" : `${totals.itemCount} Artikel`

  function saveAsList() {
    toast.success("Als Einkaufsliste gespeichert", {
      description: `${countLabel} · im Prototyp nicht dauerhaft gespeichert`,
    })
  }

  function confirmClear() {
    clearCart()
    setConfirmOpen(false)
    toast("Warenkorb geleert")
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button type="button" onClick={() => setConfirmOpen(true)} className={secondaryButton}>
        <Trash2 className="size-4" aria-hidden="true" />
        Warenkorb leeren
      </button>
      <button type="button" onClick={saveAsList} className={secondaryButton}>
        <ListPlus className="size-4" aria-hidden="true" />
        Als Einkaufsliste speichern
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Warenkorb leeren?</DialogTitle>
            <DialogDescription>
              Alle {countLabel} werden aus deinem Warenkorb entfernt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" onClick={() => setConfirmOpen(false)} className={cn(secondaryButton, "justify-center")}>
              Abbrechen
            </button>
            <button
              type="button"
              onClick={confirmClear}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-destructive px-3 text-sm font-semibold text-white transition-colors hover:bg-destructive/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
            >
              Warenkorb leeren
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
