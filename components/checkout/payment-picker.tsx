"use client"

import { CreditCard, FileText, Smartphone, Truck, Wallet } from "lucide-react"
import { PAYMENT_METHODS, type PaymentMethod, type PaymentMethodId } from "@/config"

const ICONS: Record<PaymentMethodId, typeof CreditCard> = {
  card: CreditCard,
  applepay: Smartphone,
  googlepay: Smartphone,
  klarna: FileText,
  paypal: Wallet,
  courier: Truck,
}

const GROUPS: PaymentMethod["group"][] = ["Online", "PayPal", "Bei Lieferung"]

type PaymentPickerProps = {
  value: PaymentMethodId | null
  onChange: (id: PaymentMethodId) => void
  invalid?: boolean
}

export function PaymentPicker({ value, onChange, invalid }: PaymentPickerProps) {
  return (
    <fieldset
      className="flex flex-col gap-4"
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? "section-zahlung-error" : undefined}
    >
      <legend className="sr-only">Zahlungsart wählen</legend>
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="mb-2 text-sm font-semibold text-muted-foreground">{group}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.filter((m) => m.group === group).map((method) => {
              const Icon = ICONS[method.id]
              return (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-card p-3 text-sm transition-colors hover:border-foreground/50 has-[:checked]:border-foreground has-[:checked]:bg-muted has-[:checked]:ring-1 has-[:checked]:ring-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-foreground data-[invalid]:border-destructive"
                  data-invalid={invalid || undefined}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={value === method.id}
                    onChange={() => onChange(method.id)}
                    className="size-4 accent-foreground"
                  />
                  <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="flex flex-col">
                    <span className="font-semibold">{method.label}</span>
                    {method.description && <span className="text-xs text-muted-foreground">{method.description}</span>}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </fieldset>
  )
}
