"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Check, CircleAlert } from "lucide-react"
import type { SectionStatus } from "@/lib/checkout"
import { cn } from "@/lib/utils"

export type StepperStep = {
  label: string
  status: SectionStatus
  /** Element id to scroll to; omitted for steps that link elsewhere. */
  targetId?: string
  focusId?: string
  href?: string
}

export function CheckoutStepper({ steps }: { steps: StepperStep[] }) {
  const barRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const update = () => {
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0
      setStuck(window.scrollY > 0 && el.getBoundingClientRect().top <= headerH + 0.5)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const firstOpen = steps.findIndex((s) => s.status !== "done")
  const allDone = firstOpen === -1
  const currentIndex = allDone ? steps.length - 1 : firstOpen
  const current = steps[currentIndex]
  const doneCount = steps.filter((s) => s.status === "done").length

  function scrollTo(step: StepperStep) {
    if (!step.targetId) return
    document.getElementById(step.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    if (step.focusId) document.getElementById(step.focusId)?.focus({ preventScroll: true })
  }

  return (
    <div
      ref={barRef}
      style={{ top: "var(--header-h, 0px)" }}
      className={cn(
        "sticky z-30 -mx-4 border-b bg-background px-4 py-2 transition-colors lg:-mx-8 lg:px-8",
        stuck ? "border-border" : "border-transparent",
      )}
    >
      <nav aria-label="Bestellschritte">
        <button
          type="button"
          onClick={() => scrollTo(current)}
          className="w-full rounded-xl bg-card px-3 py-2 text-left ring-1 ring-border sm:hidden"
        >
          <span className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate font-bold">{allDone ? "Alles erledigt" : current.label}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              Schritt {currentIndex + 1} von {steps.length}
            </span>
          </span>
          <span aria-hidden="true" className="mt-2 block h-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-success transition-[width]"
              style={{ width: `${(doneCount / steps.length) * 100}%` }}
            />
          </span>
        </button>

        <ol className="hidden items-center gap-2 overflow-x-auto rounded-xl bg-card px-4 py-2.5 ring-1 ring-border sm:flex">
          {steps.map((step, i) => {
            const done = step.status === "done"
            const isCurrent = !allDone && i === currentIndex
            const content = (
              <>
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                    done
                      ? "bg-success text-white"
                      : step.status === "error"
                        ? "bg-destructive text-white"
                        : isCurrent
                          ? "bg-foreground text-background"
                          : "border border-muted-foreground/40 text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="size-3" strokeWidth={3.5} aria-hidden="true" />
                  ) : step.status === "error" ? (
                    <CircleAlert className="size-3" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span>{step.label}</span>
                {done && <span className="sr-only">(erledigt)</span>}
                {step.status === "error" && <span className="sr-only">(bitte prüfen)</span>}
              </>
            )
            const className = cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
              done && "text-foreground",
              isCurrent && "bg-muted font-bold text-foreground",
              !done && !isCurrent && "text-muted-foreground",
            )
            return (
              <li key={step.label} className="flex shrink-0 items-center gap-2">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn("h-px w-6", steps[i - 1].status === "done" ? "bg-success" : "bg-border")}
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
    </div>
  )
}
