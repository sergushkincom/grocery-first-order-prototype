"use client"

import { DELIVERY_SLOTS, NEXT_SLOT } from "@/config"

type SlotPickerProps = {
  value: string | null
  onChange: (id: string) => void
  invalid?: boolean
}

const DAYS = [
  { day: "heute", label: "Heute" },
  { day: "morgen", label: "Morgen" },
] as const

export function SlotPicker({ value, onChange, invalid }: SlotPickerProps) {
  return (
    <fieldset
      className="flex flex-col gap-4"
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? "section-lieferzeit-error" : undefined}
    >
      <legend className="sr-only">Lieferzeit wählen</legend>
      {DAYS.map(({ day, label }) => (
        <div key={day}>
          <p className="mb-2 text-sm font-semibold text-muted-foreground">{label}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DELIVERY_SLOTS.filter((s) => s.day === day).map((slot) => (
              <label
                key={slot.id}
                className="relative flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-input bg-card px-2 py-3 text-center text-sm transition-colors hover:border-foreground/50 has-[:checked]:border-foreground has-[:checked]:bg-muted has-[:checked]:ring-1 has-[:checked]:ring-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-foreground data-[invalid]:border-destructive"
                data-invalid={invalid || undefined}
              >
                <input
                  type="radio"
                  name="slot"
                  value={slot.id}
                  checked={value === slot.id}
                  onChange={() => onChange(slot.id)}
                  className="sr-only"
                />
                <span className="font-semibold tabular-nums">{slot.time}</span>
                <span className="text-xs text-muted-foreground">
                  {slot.id === NEXT_SLOT.id ? "Nächster Slot · gratis" : "gratis"}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </fieldset>
  )
}
