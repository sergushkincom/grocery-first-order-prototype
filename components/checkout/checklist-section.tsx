import type { SectionStatus } from "@/lib/checkout"
import { cn } from "@/lib/utils"
import { StatusIcon, StatusLabel } from "@/components/checkout/status-badge"

type ChecklistSectionProps = {
  id: string
  index: number
  title: string
  status: SectionStatus
  errorText?: string
  children: React.ReactNode
}

export function ChecklistSection({ id, index, title, status, errorText, children }: ChecklistSectionProps) {
  return (
    <section
      id={`section-${id}`}
      aria-labelledby={`section-${id}-title`}
      className={cn(
        "scroll-mt-24 rounded-xl bg-card p-4 ring-1 transition-colors sm:p-6",
        status === "error" ? "ring-2 ring-destructive/60" : status === "done" ? "ring-success/40" : "ring-border",
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <StatusIcon status={status} index={index} />
        <h2 id={`section-${id}-title`} tabIndex={-1} className="flex-1 text-lg font-bold outline-none">
          {title}
        </h2>
        <StatusLabel status={status} errorText={status === "error" ? "Bitte prüfen" : undefined} />
      </div>
      {status === "error" && errorText && (
        <p role="alert" className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorText}
        </p>
      )}
      {children}
    </section>
  )
}
