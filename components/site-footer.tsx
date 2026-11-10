import { ArrowUpRight } from "lucide-react"

const REPO = "https://github.com/sergushkincom/grocery-first-order-prototype"
const LINKS = [
  { label: "GitHub", href: REPO },
  { label: "README", href: `${REPO}#readme` },
]
const link =
  "rounded-sm underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * Who made this and where the code is. One thin row at the end of the page, in normal flow.
 * Below lg, cart and checkout pin the summary bar to the bottom; the extra bottom padding
 * keeps the footer scrollable above it instead of hidden underneath.
 */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-card max-lg:[body:has([data-mobile-summary-bar])_&]:pb-24">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-3 px-4 text-xs text-muted-foreground lg:px-8">
        <p className="truncate max-sm:hidden">Design prototype · for demonstration only</p>
        <nav aria-label="About this project" className="flex items-center gap-3 max-sm:w-full max-sm:justify-between">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={link}>
              {l.label}
            </a>
          ))}
          <a href="https://sergushkin.com" target="_blank" rel="noreferrer" className={`${link} flex items-center gap-0.5`}>
            Built by <span className="text-foreground">Denys Sergushkin</span>
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </nav>
      </div>
    </footer>
  )
}
