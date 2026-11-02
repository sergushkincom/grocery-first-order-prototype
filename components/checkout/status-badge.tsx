import { Check, CircleAlert } from "lucide-react"
import type { SectionStatus } from "@/lib/checkout"
import { cn } from "@/lib/utils"

/** Status marker with three clearly different states: done (green), open (grey), error (red). */
export function StatusIcon({ status, index, className }: { status: SectionStatus; index: number; className?: string }) {
  if (status === "done") {
    return (
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full bg-success text-white", className)}>
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        <span className="sr-only">Erledigt</span>
      </span>
    )
  }
  if (status === "error") {
    return (
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full bg-destructive text-white", className)}>
        <CircleAlert className="size-4" strokeWidth={2.5} aria-hidden="true" />
        <span className="sr-only">Fehler</span>
      </span>
    )
  }
  return (
    <span
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full border-2 border-dashed border-muted-foreground/40 text-xs font-bold text-muted-foreground",
        className,
      )}
    >
      {index}
      <span className="sr-only">Noch offen</span>
    </span>
  )
}

export function StatusLabel({ status, errorText }: { status: SectionStatus; errorText?: string }) {
  if (status === "done") return <span className="text-xs font-semibold text-success">Erledigt</span>
  if (status === "error")
    return <span className="text-xs font-semibold text-destructive">{errorText ?? "Bitte prüfen"}</span>
  return <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Noch offen</span>
}
