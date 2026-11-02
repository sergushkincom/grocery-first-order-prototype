"use client"

import { useState } from "react"
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/data/products"
import { useShop } from "@/lib/shop-store"
import { CategoryTiles } from "@/components/catalog/category-tiles"
import { ProductCard } from "@/components/catalog/product-card"

export function HomeCatalog() {
  const { search, setSearch } = useShop()
  const [category, setCategory] = useState<CategoryId | null>(null)

  const query = search.trim().toLowerCase()
  const products = PRODUCTS.filter(
    (p) => (category === null || p.category === category) && (query === "" || p.name.toLowerCase().includes(query)),
  )
  const heading = query
    ? `Ergebnisse für „${search.trim()}“`
    : (CATEGORIES.find((c) => c.id === category)?.label ?? "Beliebt bei Erstbestellern")

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="categories-title">
        <h2 id="categories-title" className="mb-3 text-lg font-bold">
          Kategorien
        </h2>
        <CategoryTiles active={category} onSelect={setCategory} />
      </section>

      <section aria-labelledby="products-title">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="products-title" className="text-lg font-bold">
            {heading}
          </h2>
          <span className="text-sm text-muted-foreground">{products.length} Produkte</span>
        </div>
        {products.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl bg-card p-8 text-center">
            <p className="font-semibold">Keine Produkte gefunden.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setCategory(null)
              }}
              className="mt-2 text-sm font-semibold text-secondary-foreground underline underline-offset-4"
            >
              Alle Produkte anzeigen
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
