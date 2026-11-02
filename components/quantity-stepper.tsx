"use client"

import { Minus, Plus } from "lucide-react"
import { MAX_QTY_PER_ITEM } from "@/config"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"

type QuantityStepperProps = {
  productId: string
  productName: string
  variant?: "solid" | "outline"
  className?: string
}

export function QuantityStepper({ productId, productName, variant = "solid", className }: QuantityStepperProps) {
  const { cart, increment, decrement } = useShop()
  const qty = cart[productId] ?? 0

  if (qty === 0 && variant === "solid") {
    return (
      <button
        type="button"
        onClick={() => increment(productId)}
        aria-label={`${productName} in den Warenkorb legen`}
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className,
        )}
      >
        <Plus className="size-5" strokeWidth={2.5} aria-hidden="true" />
      </button>
    )
  }

  const solid = variant === "solid"
  return (
    <div
      role="group"
      aria-label={`Menge ${productName}`}
      className={cn(
        "flex h-10 shrink-0 items-center rounded-lg",
        solid ? "bg-primary text-primary-foreground" : "border border-input bg-card",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => decrement(productId)}
        aria-label={qty === 1 ? `${productName} entfernen` : `${productName}: eins weniger`}
        className={cn("grid h-full w-9 place-items-center rounded-l-lg", solid ? "hover:bg-black/10" : "hover:bg-muted")}
      >
        <Minus className="size-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => increment(productId)}
        disabled={qty >= MAX_QTY_PER_ITEM}
        aria-label={`${productName}: eins mehr`}
        className={cn(
          "grid h-full w-9 place-items-center rounded-r-lg disabled:opacity-40",
          solid ? "hover:bg-black/10" : "hover:bg-muted",
        )}
      >
        <Plus className="size-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  )
}
