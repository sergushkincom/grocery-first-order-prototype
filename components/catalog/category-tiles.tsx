"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CATEGORIES, type CategoryId } from "@/data/products"
import { cn } from "@/lib/utils"

type CategoryTilesProps = {
  active: CategoryId | null
  onSelect: (id: CategoryId | null) => void
}

export function CategoryTiles({ active, onSelect }: CategoryTilesProps) {
  const rowRef = useRef<HTMLUListElement>(null)
  const scroll = (direction: 1 | -1) =>
    rowRef.current?.scrollBy({ left: direction * rowRef.current.clientWidth * 0.8, behavior: "smooth" })

  return (
    <div className="relative min-w-0 max-w-full">
      <ul
        ref={rowRef}
        className="-mx-4 flex max-w-[calc(100%+2rem)] snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
      >
        {CATEGORIES.map((category) => {
          const selected = active === category.id
          return (
            <li key={category.id} className="snap-start">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(selected ? null : category.id)}
                className={cn(
                  "flex w-28 flex-col items-center gap-2 rounded-xl bg-card p-2.5 text-center text-xs font-semibold ring-1 transition-shadow hover:shadow-md lg:w-32 lg:text-sm",
                  selected ? "ring-2 ring-primary" : "ring-border",
                )}
              >
                <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <Image src={category.image} alt="" fill sizes="128px" className="object-contain p-2" />
                </span>
                <span className="line-clamp-2 min-h-[2lh] leading-tight">{category.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <ScrollButton side="left" onClick={() => scroll(-1)} />
      <ScrollButton side="right" onClick={() => scroll(1)} />
    </div>
  )
}

function ScrollButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Kategorien zurück" : "Weitere Kategorien"}
      className={cn(
        "absolute top-[calc(50%-1.25rem)] hidden size-10 place-items-center rounded-full bg-card shadow-md ring-1 ring-border transition-colors hover:bg-muted md:grid",
        side === "left" ? "-left-4" : "-right-4",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  )
}
