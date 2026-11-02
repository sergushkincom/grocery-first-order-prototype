"use client"

import { Check, ChevronDown, EllipsisVertical, Sparkles, User } from "lucide-react"
import { toast } from "sonner"
import { useShop } from "@/lib/shop-store"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

const triggerClass =
  "flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

function GermanFlag() {
  return (
    <span
      aria-hidden="true"
      className="h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/10"
      style={{ background: "linear-gradient(#000 0 33.3%, #dd0000 33.3% 66.6%, #ffce00 66.6%)" }}
    />
  )
}

function LanguageOptions() {
  return (
    <ul className="flex flex-col">
      <li className="flex items-center gap-2 rounded-md px-2 py-2 font-medium">
        <GermanFlag />
        Deutsch
        <Check className="ml-auto size-4 text-success" aria-label="ausgewählt" />
      </li>
      <li className="flex items-center gap-2 rounded-md px-2 py-2 text-muted-foreground">
        <span className="h-3.5 w-5 shrink-0 rounded-[2px] bg-muted ring-1 ring-black/10" aria-hidden="true" />
        English
        <span className="ml-auto text-xs">bald</span>
      </li>
    </ul>
  )
}

export function LanguageSwitch() {
  return (
    <Popover>
      <PopoverTrigger className={cn(triggerClass, "hidden sm:flex")} aria-label="Sprache: Deutsch">
        <GermanFlag />
        <span className="hidden lg:inline">DE</span>
        <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-48 p-1">
        <PopoverTitle className="sr-only">Sprache wählen</PopoverTitle>
        <LanguageOptions />
      </PopoverContent>
    </Popover>
  )
}

export function MobileMenu() {
  return (
    <Popover>
      <PopoverTrigger className={cn(triggerClass, "px-2 sm:hidden")} aria-label="Weitere Optionen">
        <EllipsisVertical className="size-5" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-52 p-1">
        <PopoverTitle className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sprache
        </PopoverTitle>
        <LanguageOptions />
      </PopoverContent>
    </Popover>
  )
}

export function LoginButton() {
  return (
    <button
      type="button"
      onClick={() => toast("Anmeldung ist im Prototyp nicht verfügbar.")}
      className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-input px-3 text-sm font-semibold transition-colors hover:bg-muted"
    >
      <User className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Anmelden</span>
      <span className="sr-only sm:hidden">Anmelden</span>
    </button>
  )
}

const PROMPTS = ["Frühstück für 2 Personen", "Wocheneinkauf unter 30 €", "Schnelles Abendessen"]

export function AiAssistant() {
  const { totals, suggestAiFill } = useShop()

  return (
    <Popover>
      <PopoverTrigger className={`${triggerClass} text-secondary-foreground hover:text-foreground`}>
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        <span className="hidden underline-offset-4 hover:underline xl:inline">KI-Assistent</span>
        <span className="sr-only xl:hidden">KI-Assistent</span>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 p-4">
        <PopoverTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          KI-Assistent
          <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium uppercase text-muted-foreground">
            Demo
          </span>
        </PopoverTitle>
        <PopoverDescription className="mt-1">
          Sag mir, was du vorhast – ich stelle dir passende Produkte zusammen.
        </PopoverDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          {!totals.minReached && totals.itemCount > 0 && (
            <button
              type="button"
              onClick={suggestAiFill}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80"
            >
              Auf Mindestbestellwert auffüllen
            </button>
          )}
          {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => toast(`„${prompt}“ – im Prototyp nur als Beispiel.`)}
              className="rounded-full border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              {prompt}
            </button>
          ))}
        </div>
        <label htmlFor="ai-prompt" className="sr-only">
          Frage an den KI-Assistenten
        </label>
        <input
          id="ai-prompt"
          disabled
          placeholder="Frag mich etwas … (bald verfügbar)"
          className="mt-3 h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </PopoverContent>
    </Popover>
  )
}
