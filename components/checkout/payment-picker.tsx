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
}

export function PaymentPicker({ value, onChange }: PaymentPickerProps) {
  return (
    <fieldset className="flex flex-col gap-4">
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
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-card p-3 text-sm transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:checked]:ring-1 has-[:checked]:ring-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={value === method.id}
                    onChange={() => onChange(method.id)}
                    className="size-4 accent-primary"
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
