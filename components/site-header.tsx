"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Leaf, Search, ShoppingCart } from "lucide-react"
import { SHOP_NAME } from "@/config"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"
import { DealBar } from "@/components/deal-bar"

export function SiteHeader() {
  const pathname = usePathname()
  const showDealBar = pathname === "/" || pathname === "/warenkorb"

  return (
    <header className="sticky top-0 z-40 bg-card shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:gap-8 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-md font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg leading-none">
            Grocery<span className="text-primary">Prototype</span>
          </span>
          <span className="sr-only">{SHOP_NAME} – Startseite</span>
        </Link>
        <SearchField className="hidden max-w-2xl flex-1 md:flex" />
        <CartButton className="ml-auto" />
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchField />
      </div>
      {showDealBar && <DealBar />}
    </header>
  )
}

function SearchField({ className }: { className?: string }) {
  const { search, setSearch } = useShop()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <form
      role="search"
      className={cn("relative flex", className)}
      onSubmit={(e) => {
        e.preventDefault()
        if (pathname !== "/") router.push("/")
      }}
    >
      <label htmlFor="product-search" className="sr-only">
        Produkte suchen
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="product-search"
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          if (pathname !== "/") router.push("/")
        }}
        placeholder="Suche nach Bananen, Milch, Brot …"
        className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/20"
      />
    </form>
  )
}

function CartButton({ className }: { className?: string }) {
  const { totals, setCartOpen } = useShop()
  const hasItems = totals.itemCount > 0

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={`Warenkorb öffnen, ${totals.itemCount} Artikel, ${formatEUR(totals.goodsWithPfandCents)}`}
      className={cn(
        "flex h-11 items-center gap-2 rounded-lg bg-primary px-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4",
        className,
      )}
    >
      <span className="relative">
        <ShoppingCart className="size-5" aria-hidden="true" />
        {hasItems && (
          <span className="absolute -right-2 -top-2 grid min-w-4 place-items-center rounded-full bg-summary px-1 text-[0.65rem] leading-4 text-summary-foreground">
            {totals.itemCount}
          </span>
        )}
      </span>
      <span className="tabular-nums">{hasItems ? formatEUR(totals.goodsWithPfandCents) : "Warenkorb"}</span>
    </button>
  )
}
