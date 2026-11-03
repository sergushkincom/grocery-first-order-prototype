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

export function FieldError({ id, message, className }: { id: string; message: string; className?: string }) {
  return (
    <p id={id} role="alert" className={cn("flex items-start gap-1 text-xs font-medium text-destructive", className)}>
      <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

export function FormField({
  id,
  label,
  labelAction,
  value,
  onChange,
  onBlur,
  error,
  className,
  ...inputProps
}: FormFieldProps & { labelAction?: React.ReactNode }) {
  const errorId = `${id}-error`
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {labelAction}
      </div>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 bg-card text-base md:text-sm focus-visible:border-foreground focus-visible:ring-foreground/15",
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        )}
        {...inputProps}
      />
      {error && <FieldError id={errorId} message={error} />}
    </div>
  )
}
