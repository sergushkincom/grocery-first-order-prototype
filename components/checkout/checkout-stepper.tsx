"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type StepperStep = {
  label: string
  done: boolean
  /** Element id to scroll to; omitted for steps that link elsewhere. */
  targetId?: string
  focusId?: string
  href?: string
}

export function CheckoutStepper({ steps }: { steps: StepperStep[] }) {
  const currentIndex = steps.findIndex((s) => !s.done)

  function scrollTo(step: StepperStep) {
    if (!step.targetId) return
    document.getElementById(step.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    if (step.focusId) document.getElementById(step.focusId)?.focus({ preventScroll: true })
  }

  return (
    <nav aria-label="Bestellschritte" className="rounded-xl bg-card px-3 py-2.5 ring-1 ring-border sm:px-4">
      <ol className="flex items-center gap-1 overflow-x-auto sm:gap-2">
        {steps.map((step, i) => {
          const isCurrent = i === currentIndex
          const content = (
            <>
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                  step.done
                    ? "bg-success text-white"
                    : isCurrent
                      ? "bg-foreground text-background"
                      : "border border-muted-foreground/40 text-muted-foreground",
                )}
              >
                {step.done ? <Check className="size-3" strokeWidth={3.5} aria-hidden="true" /> : i + 1}
              </span>
              <span>{step.label}</span>
              {step.done && <span className="sr-only">(erledigt)</span>}
            </>
          )
          const className = cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
            step.done && "text-foreground",
            isCurrent && "bg-muted font-bold text-foreground",
            !step.done && !isCurrent && "text-muted-foreground",
          )
          return (
            <li key={step.label} className="flex shrink-0 items-center gap-1 sm:gap-2">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn("h-px w-3 sm:w-6", steps[i - 1].done ? "bg-success" : "bg-border")}
                />
              )}
              {step.href ? (
                <Link href={step.href} className={className} aria-current={isCurrent ? "step" : undefined}>
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollTo(step)}
                  className={className}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
