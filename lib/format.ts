const euroFormatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })

export function toCents(eur: number) {
  return Math.round(eur * 100)
}

/** Formats cents as a de-DE price, e.g. 1988 → "19,88 €". */
export function formatEUR(cents: number) {
  return euroFormatter.format(cents / 100)
}

export function splitPrice(cents: number): [euros: string, cents: string] {
  const safe = Math.max(0, Math.round(cents))
  return [String(Math.floor(safe / 100)), String(safe % 100).padStart(2, "0")]
}
