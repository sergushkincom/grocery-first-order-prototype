import type { SectionStatus } from "@/lib/checkout"
import { cn } from "@/lib/utils"
import { StatusIcon, StatusLabel } from "@/components/checkout/status-badge"

export type ChecklistStep = {
  id: string
  title: string
  status: SectionStatus
  summary?: string
  openAction: string
  errorAction: string
}

export function CheckoutChecklist({ steps }: { steps: ChecklistStep[] }) {
  return (
    <nav aria-label="Bestell-Checkliste" className="rounded-xl bg-card p-4 ring-1 ring-border">
      <h2 className="mb-3 text-sm font-bold">Checkliste</h2>
      <ol className="flex flex-col gap-1">
        {steps.map((step, i) => {
          const next = steps[i + 1]
          const solid = next && step.status === "done" && next.status === "done"
          return (
            <li key={step.id} className="relative">
              {next && (
                // Connector from below this icon (8px padding + 24px icon) to above the next one (4px gap + 8px padding).
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[19px] top-[34px] -bottom-[10px]",
                    solid ? "w-0.5 bg-success" : "w-0 border-l-2 border-dotted border-muted-foreground/50",
                  )}
                />
              )}
              <a href={`#section-${step.id}`} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted">
                <StatusIcon status={step.status} index={i + 1} className="size-6" />
                <span className="mt-0.5 min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{step.title}</span>
                  {step.status === "done" && step.summary && (
                    <span className="block truncate text-xs text-muted-foreground">{step.summary}</span>
                  )}
                </span>
                <span className="mt-0.5">
                  <StatusLabel status={step.status} />
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
