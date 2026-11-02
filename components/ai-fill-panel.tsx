"use client"

import { useMemo, useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getProduct, type Product } from "@/data/products"
import { formatEUR, toCents } from "@/lib/format"
import { useShop } from "@/lib/shop-store"

type SuggestedLine = { product: Product; qty: number }

function groupSuggestion(picks: string[]): SuggestedLine[] {
  const counts = new Map<string, number>()
  for (const id of picks) counts.set(id, (counts.get(id) ?? 0) + 1)
  const lines: SuggestedLine[] = []
  for (const [id, qty] of counts) {
    const product = getProduct(id)
    if (product) lines.push({ product, qty })
  }
  return lines
}

export function AiFillPanel() {
  const { aiSuggestion, cancelAiFill } = useShop()

  return (
    <Dialog open={aiSuggestion !== null} onOpenChange={(open) => !open && cancelAiFill()}>
      <DialogContent className="sm:max-w-md">
        {aiSuggestion && <AiFillForm key={aiSuggestion.join(",")} picks={aiSuggestion} />}
      </DialogContent>
    </Dialog>
  )
}

function AiFillForm({ picks }: { picks: string[] }) {
  const { confirmAiFill, cancelAiFill } = useShop()
  const lines = useMemo(() => groupSuggestion(picks), [picks])
  const [selected, setSelected] = useState(() => new Set(lines.map((l) => l.product.id)))

  const totalCents = lines
    .filter((l) => selected.has(l.product.id))
    .reduce((sum, l) => sum + toCents(l.product.price) * l.qty, 0)
  const hasApprox = lines.some((l) => l.product.weighed && selected.has(l.product.id))

  function toggle(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-base font-bold">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          Vorschläge zum Auffüllen
        </DialogTitle>
        <DialogDescription>
          Damit erreichst du den Mindestbestellwert. Wähle aus, was in deinen Warenkorb soll.
        </DialogDescription>
      </DialogHeader>

      <fieldset>
        <legend className="sr-only">Vorgeschlagene Artikel</legend>
        <ul className="divide-y rounded-lg border">
          {lines.map(({ product, qty }) => {
            const inputId = `ai-fill-${product.id}`
            return (
              <li key={product.id}>
                <label htmlFor={inputId} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/50">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={(e) => toggle(product.id, e.target.checked)}
                    className="size-4 shrink-0 accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">
                      {qty > 1 ? `${qty} × ` : ""}
                      {product.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">{product.amount}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {product.weighed ? "ca. " : ""}
                    {formatEUR(toCents(product.price) * qty)}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <div className="flex items-baseline justify-between px-1" aria-live="polite">
        <span className="font-semibold">Summe</span>
        <span className="text-base font-bold tabular-nums">
          {hasApprox ? "ca. " : ""}
          {formatEUR(totalCents)}
        </span>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={cancelAiFill}>
          Abbrechen
        </Button>
        <Button onClick={() => confirmAiFill([...selected])} disabled={selected.size === 0}>
          Hinzufügen
        </Button>
      </DialogFooter>
    </>
  )
}
