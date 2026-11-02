import type { SectionStatus } from "@/lib/checkout"
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
        {steps.map((step, i) => (
          <li key={step.id}>
            <a
              href={`#section-${step.id}`}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
            >
              <StatusIcon status={step.status} index={i + 1} className="size-6" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{step.title}</span>
                {step.status === "done" && step.summary && (
                  <span className="block truncate text-xs text-muted-foreground">{step.summary}</span>
                )}
              </span>
              <StatusLabel status={step.status} />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
