import { ArrowUpRight, BookOpenIcon } from "lucide-react"

const REPO = "https://github.com/sergushkincom/grocery-first-order-prototype"
const link =
  "flex items-center gap-1 rounded-sm underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// GitHub's mark (Octicons, MIT). Lucide no longer ships brand icons.
function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

const LINKS = [
  { label: "GitHub", href: REPO, Icon: GitHubMark },
  { label: "README", href: `${REPO}#readme`, Icon: BookOpenIcon },
]

/**
 * Who made this and where the code is. One thin bar at the end of the page, in normal flow.
 * Below lg, cart and checkout pin the summary bar to the bottom; the extra bottom padding
 * keeps the footer scrollable above it instead of hidden underneath.
 */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-muted max-lg:[body:has([data-mobile-summary-bar])_&]:pb-24">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2.5 text-xs text-muted-foreground lg:px-8">
        <p>Design prototype · Clickable prototype with sample data. No real orders or payments.</p>
        <nav aria-label="About this project" className="flex items-center gap-4 max-sm:w-full max-sm:justify-between">
          {LINKS.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className={link}>
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </a>
          ))}
          <a href="https://sergushkin.com" target="_blank" rel="noreferrer" className={`${link} gap-0.5`}>
            Built by <span className="text-foreground">Denys Sergushkin</span>
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </nav>
      </div>
    </footer>
  )
}
