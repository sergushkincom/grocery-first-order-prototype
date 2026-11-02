"use client"

import { CircleAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  className?: string
} & Pick<React.ComponentProps<"input">, "autoComplete" | "inputMode" | "type" | "maxLength" | "placeholder">

export function FormField({ id, label, value, onChange, onBlur, error, className, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-11 bg-card text-base md:text-sm"
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="flex items-start gap-1 text-xs text-destructive">
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
