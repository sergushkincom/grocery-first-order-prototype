import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

const GLOW_COLOR = {
  light: "rgba(46, 125, 62, 0.55)",
  dark: "rgba(143, 209, 158, 0.95)",
} as const

type MinimumMeterProps = {
  progress: number
  reached: boolean
  glowing: boolean
  tone: "light" | "dark"
  /** Toast copy is decorative. The deal bar keeps the named progress bar. */
  decorative?: boolean
}

/** The thin bar that fills toward the minimum. The glow class is added for one crossing. */
export function MinimumMeter({ progress, reached, glowing, tone, decorative = false }: MinimumMeterProps) {
  const dark = tone === "dark"
  const clamped = Math.min(1, Math.max(0, progress))
  const style = { "--threshold-glow-color": GLOW_COLOR[tone] } as CSSProperties

  return (
    <div
      role={decorative ? undefined : "progressbar"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Fortschritt zum Mindestbestellwert"}
      aria-valuemin={decorative ? undefined : 0}
      aria-valuemax={decorative ? undefined : 100}
      aria-valuenow={decorative ? undefined : Math.round(clamped * 100)}
      className="relative h-[6px]"
      style={style}
    >
      <div className={cn("absolute inset-0 overflow-hidden rounded-full", dark ? "bg-white/25" : "bg-neutral-300")}>
        <div
          className={cn(
            "h-full rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            reached ? (dark ? "bg-[#8fd19e]" : "bg-success") : "bg-primary",
            glowing && "threshold-fill-glow",
          )}
          style={{ width: `${clamped * 100}%` }}
        />
        {glowing && <span aria-hidden="true" className="threshold-bar-sheen pointer-events-none absolute inset-y-0 w-2/5" />}
      </div>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute -inset-x-1 inset-y-0 rounded-full", glowing && "threshold-bar-glow")}
      />
    </div>
  )
}
