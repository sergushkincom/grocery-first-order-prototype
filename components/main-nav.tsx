"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MOCK_SECTIONS = ["Angebote", "Rezepte", "Marken"]

const pillClass = "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"

export function MainNav() {
  const pathname = usePathname()
  const onCatalog = pathname === "/"

  return (
    <nav aria-label="Hauptnavigation" className="border-t">
      <ul className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-4 py-2 lg:px-8">
        <li>
          <Link
            href="/"
            aria-current={onCatalog ? "page" : undefined}
            className={cn(pillClass, "block", onCatalog ? "bg-foreground text-background" : "bg-muted hover:bg-muted/70")}
          >
            Sortiment
          </Link>
        </li>
        {MOCK_SECTIONS.map((label) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => toast(`${label} sind im Prototyp nicht verfügbar.`)}
              className={cn(pillClass, "bg-muted hover:bg-muted/70")}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
