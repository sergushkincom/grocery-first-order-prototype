"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock } from "lucide-react"
import { DELIVERY_CITY, DELIVERY_SLOTS, MIN_ORDER, PAYMENT_METHODS, type PaymentMethodId } from "@/config"
import {
  validateAddress,
  validateContact,
  type Address,
  type Contact,
  type FieldErrors,
  type SectionStatus,
} from "@/lib/checkout"
import { formatEUR } from "@/lib/format"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"
import { CartSummary } from "@/components/cart/cart-summary"
import { ChecklistSection } from "@/components/checkout/checklist-section"
import { CheckoutChecklist, type ChecklistStep } from "@/components/checkout/checkout-checklist"
import { FormField } from "@/components/checkout/form-field"
import { PaymentPicker } from "@/components/checkout/payment-picker"
import { SlotPicker } from "@/components/checkout/slot-picker"

export function CheckoutForm() {
  const router = useRouter()
  const { totals, postcode, deliveryStatus, placeOrder } = useShop()

  const [address, setAddress] = useState<Address>({
    street: "",
    number: "",
    postcode: postcode ?? "",
    city: deliveryStatus === "deliverable" ? DELIVERY_CITY : "",
  })
  const [contact, setContact] = useState<Contact>({ firstName: "", lastName: "", email: "", phone: "" })
  const [slotId, setSlotId] = useState<string | null>(null)
  const [payment, setPayment] = useState<PaymentMethodId | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [placing, setPlacing] = useState(false)

  if (!placing && !totals.minReached) {
    return (
      <div className="mx-auto max-w-lg rounded-xl bg-card p-8 text-center ring-1 ring-border">
        <h1 className="text-xl font-bold">Noch nicht bereit für die Kasse</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {totals.itemCount === 0
            ? "Dein Warenkorb ist leer."
            : `Noch ${formatEUR(totals.remainingCents)} bis zum Mindestbestellwert von ${MIN_ORDER.toLocaleString("de-DE")} €.`}
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90"
        >
          Weiter einkaufen
        </Link>
      </div>
    )
  }

  const addressErrors = validateAddress(address)
  const contactErrors = validateContact(contact)
  const shown = <T,>(errors: FieldErrors<T>, prefix: string, key: keyof T) =>
    touched[`${prefix}.${String(key)}`] || submitAttempted ? errors[key] : undefined

  function fieldStatus<T>(errors: FieldErrors<T>, prefix: string): SectionStatus {
    const keys = Object.keys(errors) as (keyof T)[]
    if (keys.length === 0) return "done"
    return keys.some((k) => shown(errors, prefix, k)) ? "error" : "open"
  }

  const firstShown = <T,>(errors: FieldErrors<T>, prefix: string) =>
    (Object.keys(errors) as (keyof T)[]).map((k) => shown(errors, prefix, k)).find(Boolean)

  const selectedSlot = DELIVERY_SLOTS.find((s) => s.id === slotId)
  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === payment)

  const steps: ChecklistStep[] = [
    {
      id: "adresse",
      title: "Adresse",
      status: fieldStatus(addressErrors, "address"),
      summary: `${address.street} ${address.number}, ${address.postcode} ${address.city}`,
      openAction: "Adresse vervollständigen",
      errorAction: "Adresse prüfen",
    },
    {
      id: "kontakt",
      title: "Kontakt",
      status: fieldStatus(contactErrors, "contact"),
      summary: `${contact.firstName} ${contact.lastName} · ${contact.email}`,
      openAction: "Kontaktdaten angeben",
      errorAction: "Kontaktdaten prüfen",
    },
    {
      id: "lieferzeit",
      title: "Lieferzeit",
      status: selectedSlot ? "done" : submitAttempted ? "error" : "open",
      summary: selectedSlot ? `${selectedSlot.day} ${selectedSlot.time}` : undefined,
      openAction: "Lieferzeit wählen",
      errorAction: "Lieferzeit wählen",
    },
    {
      id: "zahlung",
      title: "Zahlung",
      status: selectedPayment ? "done" : submitAttempted ? "error" : "open",
      summary: selectedPayment?.label,
      openAction: "Zahlungsart wählen",
      errorAction: "Zahlungsart wählen",
    },
  ]

  const missing = steps.filter((s) => s.status !== "done")
  const ready = missing.length === 0
  const approx = totals.hasWeighed ? "ca. " : ""
  const buttonLabel = ready
    ? `Kostenpflichtig bestellen – ${approx}${formatEUR(totals.totalCents)}`
    : missing.length === 1
      ? `Noch offen: ${missing[0].status === "error" ? missing[0].errorAction : missing[0].openAction}`
      : `Noch offen: ${missing.map((s) => s.title).join(", ")}`
  const reserves = totals.hasWeighed && (selectedPayment ? selectedPayment.reservesWeighed : true)

  const touch = (key: string) => setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  const updateAddress = (key: keyof Address) => (value: string) =>
    setAddress((prev) => ({ ...prev, [key]: key === "postcode" ? value.replace(/\D/g, "").slice(0, 5) : value }))
  const updateContact = (key: keyof Contact) => (value: string) => setContact((prev) => ({ ...prev, [key]: value }))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!ready) {
      setSubmitAttempted(true)
      const target = document.getElementById(`section-${missing[0].id}`)
      target?.scrollIntoView({ behavior: "smooth", block: "start" })
      document.getElementById(`section-${missing[0].id}-title`)?.focus({ preventScroll: true })
      return
    }
    setPlacing(true)
    placeOrder({
      number: `GP-${Math.floor(100000 + Math.random() * 900000)}`,
      firstName: contact.firstName.trim(),
      email: contact.email.trim(),
      slotLabel: `${selectedSlot!.day} ${selectedSlot!.time}`,
      addressLines: [`${address.street.trim()} ${address.number.trim()}`, `${address.postcode} ${address.city.trim()}`],
      paymentLabel: selectedPayment!.label,
      totalCents: totals.totalCents,
      creditCents: totals.creditCents,
      approx: totals.hasWeighed,
      reserveCents: reserves ? totals.weighedReserveCents : 0,
      itemCount: totals.itemCount,
    })
    router.push("/bestaetigung")
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <Link
          href="/warenkorb"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurück zum Warenkorb
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Kasse</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vier Schritte auf einer Seite – alles, was fehlt, siehst du sofort.</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-4">
          <ChecklistSection id="adresse" index={1} title="Lieferadresse" status={steps[0].status} errorText={firstShown(addressErrors, "address")}>
            <div className="grid grid-cols-6 gap-3">
              <FormField id="street" label="Straße" autoComplete="address-line1" className="col-span-4" value={address.street} onChange={updateAddress("street")} onBlur={() => touch("address.street")} error={shown(addressErrors, "address", "street")} />
              <FormField id="number" label="Hausnr." className="col-span-2" value={address.number} onChange={updateAddress("number")} onBlur={() => touch("address.number")} error={shown(addressErrors, "address", "number")} />
              <FormField id="postcode" label="PLZ" inputMode="numeric" autoComplete="postal-code" maxLength={5} className="col-span-2" value={address.postcode} onChange={updateAddress("postcode")} onBlur={() => touch("address.postcode")} error={shown(addressErrors, "address", "postcode")} />
              <FormField id="city" label="Ort" autoComplete="address-level2" className="col-span-4" value={address.city} onChange={updateAddress("city")} onBlur={() => touch("address.city")} error={shown(addressErrors, "address", "city")} />
            </div>
          </ChecklistSection>

          <ChecklistSection id="kontakt" index={2} title="Kontakt" status={steps[1].status} errorText={firstShown(contactErrors, "contact")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField id="firstName" label="Vorname" autoComplete="given-name" value={contact.firstName} onChange={updateContact("firstName")} onBlur={() => touch("contact.firstName")} error={shown(contactErrors, "contact", "firstName")} />
              <FormField id="lastName" label="Nachname" autoComplete="family-name" value={contact.lastName} onChange={updateContact("lastName")} onBlur={() => touch("contact.lastName")} error={shown(contactErrors, "contact", "lastName")} />
              <FormField id="email" label="E-Mail" type="email" autoComplete="email" inputMode="email" value={contact.email} onChange={updateContact("email")} onBlur={() => touch("contact.email")} error={shown(contactErrors, "contact", "email")} />
              <FormField id="phone" label="Telefon" type="tel" autoComplete="tel" inputMode="tel" placeholder="0151 2345678" value={contact.phone} onChange={updateContact("phone")} onBlur={() => touch("contact.phone")} error={shown(contactErrors, "contact", "phone")} />
            </div>
          </ChecklistSection>

          <ChecklistSection id="lieferzeit" index={3} title="Lieferzeit" status={steps[2].status} errorText="Bitte wähle eine Lieferzeit.">
            <SlotPicker value={slotId} onChange={setSlotId} />
          </ChecklistSection>

          <ChecklistSection id="zahlung" index={4} title="Zahlung" status={steps[3].status} errorText="Bitte wähle eine Zahlungsart.">
            <PaymentPicker value={payment} onChange={setPayment} />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" />
              Prototyp: Es wird keine echte Zahlung ausgelöst.
            </p>
          </ChecklistSection>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
          <CheckoutChecklist steps={steps} />
          <CartSummary totals={totals} showReserveNote={reserves}>
            <button
              type="submit"
              aria-disabled={!ready}
              className={cn(
                "mt-5 min-h-12 w-full rounded-lg px-4 py-3 text-sm font-bold transition-colors",
                ready
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed bg-white/15 text-white/70",
              )}
            >
              {buttonLabel}
            </button>
            <p className="mt-2 text-center text-xs text-white/60">
              {totals.itemCount} Artikel · erste Lieferung gratis
            </p>
          </CartSummary>
        </aside>
      </div>
    </form>
  )
}
