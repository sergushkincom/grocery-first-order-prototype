import Image from "next/image"
import type { Product } from "@/data/products"
import { formatEUR, toCents } from "@/lib/format"
import { Price } from "@/components/price"
import { QuantityStepper } from "@/components/quantity-stepper"

export function ProductCard({ product }: { product: Product }) {
  const title = `${product.name}, ${product.amount}`

  return (
    <article className="flex w-full flex-col rounded-xl bg-card p-3 ring-1 ring-border transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-contain p-3 mix-blend-multiply"
        />
        {product.weighed && (
          <span className="absolute left-2 top-2 rounded-md bg-card px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            Wiegeware
          </span>
        )}
        {product.bio && (
          <span className="absolute right-2 top-2 rounded-md bg-success px-1.5 py-0.5 text-xs font-bold tracking-wide text-white">
            BIO
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-sm font-medium leading-snug text-pretty">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {product.unitPrice}
          {product.pfand ? ` · zzgl. ${formatEUR(toCents(product.pfand))} Pfand` : ""}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-col items-start gap-1">
            {product.oldPrice && (
              <s className="text-xs text-muted-foreground">
                <span className="sr-only">Statt </span>
                {formatEUR(toCents(product.oldPrice))}
              </s>
            )}
            <Price cents={toCents(product.price)} className={product.oldPrice ? "text-destructive" : undefined} />
            {product.discountLabel && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-white">
                {product.discountLabel}
              </span>
            )}
          </div>
          <QuantityStepper productId={product.id} productName={product.name} notifyOnAdd />
        </div>
      </div>
    </article>
  )
}
