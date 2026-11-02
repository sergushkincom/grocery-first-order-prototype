import { Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { SectionStatus } from "@/lib/checkout"
import { FieldError } from "@/components/checkout/form-field"

type ChecklistSectionProps = {
  id: string
  title: string
  icon: LucideIcon
  status: SectionStatus
  summary?: string
  /** Error shown directly under the section's controls (for pickers without their own field errors). */
  errorText?: string
  children: React.ReactNode
}

export function ChecklistSection({ id, title, icon: Icon, status, summary, errorText, children }: ChecklistSectionProps) {
  return (
    <section
      id={`section-${id}`}
      aria-labelledby={`section-${id}-title`}
      className="scroll-mt-48 rounded-xl bg-card p-4 ring-1 ring-border sm:p-6"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-foreground">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`section-${id}-title`} tabIndex={-1} className="text-lg font-bold leading-9 outline-none">
            {title}
          </h2>
          {status === "done" && summary && (
            <p className="-mt-1 truncate text-sm text-muted-foreground">{summary}</p>
          )}
        </div>
        <SectionState status={status} />
      </div>
      {children}
      {status === "error" && errorText && <FieldError id={`section-${id}-error`} message={errorText} className="mt-2" />}
    </section>
  )
}

function SectionState({ status }: { status: SectionStatus }) {
  if (status === "done") {
    return (
      <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-success">
        <span className="grid size-5 place-items-center rounded-full bg-success text-white">
          <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
        Erledigt
      </span>
    )
  }
  if (status === "error") {
    return <span className="mt-2 text-xs font-semibold text-destructive">Bitte prüfen</span>
  }
  return (
    <span className="mt-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Noch offen</span>
  )
}
