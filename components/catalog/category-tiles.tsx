"use client"

import Image from "next/image"
import { LayoutGrid } from "lucide-react"
import { CATEGORIES, type CategoryId } from "@/data/products"
import { cn } from "@/lib/utils"

type CategoryTilesProps = {
  active: CategoryId | null
  onSelect: (id: CategoryId | null) => void
}

export function CategoryTiles({ active, onSelect }: CategoryTilesProps) {
  const tileClass = (selected: boolean) =>
    cn(
      "flex w-28 shrink-0 flex-col items-center gap-2 rounded-xl bg-card p-3 text-center text-xs font-semibold ring-1 transition-shadow hover:shadow-md sm:w-auto sm:text-sm",
      selected ? "ring-2 ring-primary" : "ring-border",
    )

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
      <button type="button" aria-pressed={active === null} onClick={() => onSelect(null)} className={tileClass(active === null)}>
        <span className="grid aspect-square w-full place-items-center rounded-lg bg-secondary text-secondary-foreground">
          <LayoutGrid className="size-8" aria-hidden="true" />
        </span>
        Alle Produkte
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={active === category.id}
          onClick={() => onSelect(active === category.id ? null : category.id)}
          className={tileClass(active === category.id)}
        >
          <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-background">
            <Image src={category.image} alt="" fill sizes="160px" className="object-contain p-2" />
          </span>
          {category.label}
        </button>
      ))}
    </div>
  )
}
