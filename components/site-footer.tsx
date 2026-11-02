import { SHOP_NAME } from "@/config"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-card">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between lg:px-8">
        <p>
          {SHOP_NAME} · Klickbarer Prototyp mit Beispieldaten, keine echten Bestellungen oder Zahlungen.
        </p>
        <p>Prototype — not affiliated with Knuspr</p>
      </div>
    </footer>
  )
}
