"use client"

import Image from "next/image"
import type { CartLine } from "@/lib/pricing"
import { formatEUR } from "@/lib/format"
import { QuantityStepper } from "@/components/quantity-stepper"

export function CartItemRow({ line }: { line: CartLine }) {
  const { product } = line

  return (
    <li className="flex gap-3 py-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-border">
        <Image src={product.image} alt="" fill sizes="64px" className="object-contain p-1" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              {product.amount}
              {line.pfandCents > 0 ? ` · + ${formatEUR(line.pfandCents)} Pfand` : ""}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums">
            {product.weighed ? "ca. " : ""}
            {formatEUR(line.lineCents)}
          </p>
        </div>
        <QuantityStepper
          productId={product.id}
          productName={product.name}
          variant="outline"
          className="h-9 self-start"
        />
      </div>
    </li>
  )
}
