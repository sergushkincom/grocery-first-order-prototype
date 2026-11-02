import { cn } from "@/lib/utils"
import { formatEUR, splitPrice } from "@/lib/format"

const sizes = {
  sm: { euros: "text-base", cents: "text-[0.6rem] mt-0.5" },
  md: { euros: "text-2xl", cents: "text-xs mt-0.5" },
  lg: { euros: "text-3xl", cents: "text-sm mt-1" },
}

type PriceProps = {
  cents: number
  size?: keyof typeof sizes
  approx?: boolean
  className?: string
}

/** Big euros with superscript cents, e.g. 1⁹⁹ €. */
export function Price({ cents, size = "md", approx = false, className }: PriceProps) {
  const [euros, rest] = splitPrice(cents)
  const s = sizes[size]
  return (
    <span className={cn("inline-flex items-start font-bold leading-none tabular-nums", className)}>
      <span className="sr-only">
        {approx ? "ca. " : ""}
        {formatEUR(cents)}
      </span>
      <span aria-hidden="true" className="inline-flex items-start">
        {approx && <span className={cn("mr-1 self-end font-semibold", s.cents)}>ca.</span>}
        <span className={s.euros}>{euros}</span>
        <span className={cn("ml-px", s.cents)}>{rest}</span>
        <span className={cn("ml-0.5", s.cents)}>€</span>
      </span>
    </span>
  )
}
