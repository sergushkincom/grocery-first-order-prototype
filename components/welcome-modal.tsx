"use client"

import { useState } from "react"
import { CircleCheck, Clock, Gift, MapPin, ShoppingBasket, Truck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { DELIVERABLE_POSTCODES, DELIVERY_CITY, MIN_ORDER, NEXT_SLOT, WELCOME_CREDIT } from "@/config"
import { isValidPostcodeFormat } from "@/lib/pricing"
import { useShop } from "@/lib/shop-store"

const euro = (value: number) => `${value.toLocaleString("de-DE")} €`

const TEST_POSTCODES = [
  { code: "80331", label: "Liefergebiet" },
  { code: "10115", label: "kein Liefergebiet" },
]

export function WelcomeModal() {
  const { welcomeOpen, setWelcomeOpen, postcode, deliveryStatus, checkPostcode } = useShop()
  const [value, setValue] = useState(postcode ?? "")
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(true)

  const showResult = !editing && deliveryStatus !== "unknown"
  const close = () => setWelcomeOpen(false)

  function runCheck(code: string) {
    const trimmed = code.trim()
    if (!isValidPostcodeFormat(trimmed)) {
      setError("Bitte gib eine 5-stellige Postleitzahl ein, z. B. 80331.")
      return
    }
    setError(null)
    checkPostcode(trimmed)
    setEditing(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    runCheck(value)
  }

  function applyTestPostcode(code: string) {
    setValue(code)
    runCheck(code)
  }

  return (
    <Dialog
      open={welcomeOpen}
      onOpenChange={(open) => {
        setWelcomeOpen(open)
        if (open) setEditing(deliveryStatus === "unknown")
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="bg-primary px-6 pb-6 pt-7 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Gift className="size-4" aria-hidden="true" />
            Für deine erste Bestellung
          </div>
          <DialogTitle className="mt-2 text-3xl font-extrabold leading-tight">
            {euro(WELCOME_CREDIT)} Startguthaben
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-primary-foreground/90">
            Mindestbestellwert {euro(MIN_ORDER)}. Deine erste Lieferung ist gratis. Prüfe kurz, ob wir zu dir liefern.
          </DialogDescription>
        </div>

        <div className="p-6">
          {!showResult && (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              <label htmlFor="welcome-postcode" className="text-sm font-semibold">
                Deine Postleitzahl
              </label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="welcome-postcode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value.replace(/\D/g, ""))
                    if (error) setError(null)
                  }}
                  placeholder="z. B. 80331"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "welcome-postcode-error" : undefined}
                  className="h-12 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-base outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                />
              </div>
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                Zum Testen:
                {TEST_POSTCODES.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => applyTestPostcode(code)}
                    aria-label={`${code} eintragen und prüfen (${label})`}
                    className="rounded-full border border-input bg-muted px-2 py-0.5 font-mono font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                  >
                    {code}
                  </button>
                ))}
              </p>
              {error && (
                <p id="welcome-postcode-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="mt-1 h-12 rounded-lg bg-primary px-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Guthaben sichern & Lieferung prüfen
              </button>
              <button
                type="button"
                onClick={close}
                className="self-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Später
              </button>
            </form>
          )}

          {showResult && deliveryStatus === "deliverable" && (
            <div className="flex flex-col gap-4">
              <p className="flex items-center gap-2 font-semibold text-success">
                <CircleCheck className="size-5" aria-hidden="true" />
                Super, wir liefern nach {postcode} {DELIVERY_CITY}!
              </p>
              <section aria-labelledby="conditions-title" className="rounded-xl bg-background p-4">
                <h3 id="conditions-title" className="text-sm font-bold">
                  Deine Bedingungen
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                  <Condition icon={ShoppingBasket} label="Mindestbestellwert" value={euro(MIN_ORDER)} />
                  <Condition icon={Truck} label="Erste Lieferung" value="gratis" />
                  <Condition icon={Clock} label="Nächster Slot" value={`${NEXT_SLOT.day} ${NEXT_SLOT.time}`} />
                  <Condition icon={Gift} label="Startguthaben" value={euro(WELCOME_CREDIT)} />
                </ul>
              </section>
              <button
                type="button"
                onClick={close}
                className="h-12 rounded-lg bg-primary px-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Jetzt einkaufen
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="self-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Andere PLZ prüfen
              </button>
            </div>
          )}

          {showResult && deliveryStatus === "not-deliverable" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-background p-4 text-sm">
                <p className="font-semibold">Schade – nach {postcode} liefern wir noch nicht.</p>
                <p className="mt-1 text-muted-foreground">
                  Aktuell beliefern wir {DELIVERY_CITY} (PLZ {DELIVERABLE_POSTCODES.from}–{DELIVERABLE_POSTCODES.to}).
                  Du kannst trotzdem stöbern – oder eine andere Adresse prüfen, z. B. deine Arbeit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue("")
                  setEditing(true)
                }}
                className="h-12 rounded-lg bg-primary px-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Andere PLZ prüfen
              </button>
              <button
                type="button"
                onClick={close}
                className="h-12 rounded-lg border border-input px-4 font-semibold transition-colors hover:bg-muted"
              >
                Trotzdem umsehen
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Condition({ icon: Icon, label, value }: { icon: typeof Gift; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </li>
  )
}
