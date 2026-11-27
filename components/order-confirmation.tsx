"use client"

import { useLayoutEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { Clock, CreditCard, MapPin } from "lucide-react"
import {
  COUNT_MS,
  ROW_FADE_MS,
  checkPathAt,
  circleOffsetAt,
  confirmationMotionEndMs,
  countDelayMs,
  countUpCents,
  fullCheckPath,
  rowDelayMs,
} from "@/lib/confirm-motion"
import { formatEUR } from "@/lib/format"
import { useShop, type PlacedOrder } from "@/lib/shop-store"
import { cn } from "@/lib/utils"

export function OrderConfirmation() {
  const { lastOrder } = useShop()

  if (!lastOrder) {
    return (
      <div className="rounded-xl bg-card p-8 text-center ring-1 ring-border">
        <h1 className="text-xl font-bold">Keine Bestellung gefunden</h1>
        <p className="mt-2 text-sm text-muted-foreground">Leg ein paar Produkte in den Warenkorb, um zu bestellen.</p>
        <Link href="/" className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90">
          Zu den Produkten
        </Link>
      </div>
    )
  }

  return <Confirmation order={lastOrder} />
}

function Confirmation({ order }: { order: PlacedOrder }) {
  const motion = useConfirmationMotion(order.totalCents)
  const prefix = order.approx ? "ca. " : ""
  const finalAmount = `${prefix}${formatEUR(order.totalCents)}`
  const shownAmount = `${prefix}${formatEUR(motion.cents)}`
  const rows = [
    { icon: Clock, label: "Lieferung", value: order.slotLabel },
    { icon: MapPin, label: "Adresse", value: order.addressLines.join(", ") },
    { icon: CreditCard, label: "Zahlung", value: order.paymentLabel },
  ]

  return (
    <div className={cn("overflow-hidden rounded-xl bg-card ring-1 ring-border", motion.playing && "confirm-play")}>
      <div className="flex flex-col items-center gap-2 bg-success px-6 py-8 text-center text-white">
        <DrawnCheck circleOffset={motion.circleOffset} checkPath={motion.checkPath} />
        <h1 className="text-2xl font-bold text-balance">Danke, {order.firstName}! Deine Bestellung ist eingegangen.</h1>
        <p className="text-sm text-white/85">
          Bestellnummer <span className="font-semibold">{order.number}</span> · Bestätigung an {order.email}
        </p>
      </div>
      <dl className="divide-y px-6">
        {rows.map((row, index) => (
          <Item key={row.label} icon={row.icon} label={row.label} value={row.value} style={rowStyle(index)} />
        ))}
        <div className="confirm-row flex items-baseline justify-between py-4" style={rowStyle(3)}>
          <dt className="font-semibold">Gesamt ({order.itemCount} Artikel)</dt>
          <dd className="text-lg font-bold tabular-nums">
            <span className="sr-only">{finalAmount}</span>
            <span aria-hidden="true" className="inline-grid justify-items-end">
              <span className="invisible col-start-1 row-start-1">{finalAmount}</span>
              <span className="col-start-1 row-start-1" data-confirm-amount>
                {shownAmount}
              </span>
            </span>
          </dd>
        </div>
      </dl>
      <div className="flex flex-col gap-1 bg-background px-6 py-4 text-xs text-muted-foreground">
        <p>Erste Lieferung gratis · {formatEUR(order.creditCents)} Startguthaben wurde abgezogen.</p>
        {order.approx && <p>Wiegeware rechnen wir nach tatsächlichem Gewicht ab.</p>}
        {order.reserveCents > 0 && (
          <p>Zusätzlich reserviert: bis zu {formatEUR(order.reserveCents)} – wird nach der Lieferung freigegeben.</p>
        )}
      </div>
      <div className="p-6">
        <Link href="/" className="grid h-12 place-items-center rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          Weiter einkaufen
        </Link>
      </div>
    </div>
  )
}

function rowStyle(index: number): CSSProperties {
  return {
    animationDelay: `${rowDelayMs(index)}ms`,
    animationDuration: `${ROW_FADE_MS}ms`,
  }
}

function useConfirmationMotion(totalCents: number) {
  const [playing, setPlaying] = useState(false)
  const [circleOffset, setCircleOffset] = useState(0)
  const [checkPath, setCheckPath] = useState(() => fullCheckPath())
  const [cents, setCents] = useState(totalCents)

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let raf = 0

    const showFinal = () => {
      cancelAnimationFrame(raf)
      setPlaying(false)
      setCircleOffset(0)
      setCheckPath(fullCheckPath())
      setCents(totalCents)
    }

    const play = () => {
      cancelAnimationFrame(raf)
      if (media.matches) {
        showFinal()
        return
      }
      const start = performance.now()
      const endAt = confirmationMotionEndMs()
      setPlaying(true)
      setCircleOffset(circleOffsetAt(0))
      setCheckPath(checkPathAt(0))
      setCents(0)
      const tick = (now: number) => {
        const elapsed = now - start
        if (elapsed >= endAt) {
          setCircleOffset(0)
          setCheckPath(fullCheckPath())
          setCents(totalCents)
          return
        }
        setCircleOffset(circleOffsetAt(elapsed))
        setCheckPath(checkPathAt(elapsed))
        setCents(countUpCents(totalCents, elapsed - countDelayMs(), COUNT_MS))
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    play()
    const onChange = () => {
      if (media.matches) showFinal()
    }
    media.addEventListener("change", onChange)
    return () => {
      cancelAnimationFrame(raf)
      media.removeEventListener("change", onChange)
    }
  }, [totalCents])

  return {
    playing,
    circleOffset,
    checkPath,
    cents: playing ? cents : totalCents,
  }
}

function circleDash(offset: number) {
  if (offset <= 0) return {}
  if (offset >= 1) return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1, style: { opacity: 0 } }
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: offset }
}

function DrawnCheck({ circleOffset, checkPath }: { circleOffset: number; checkPath: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="confirm-check size-12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Pen stroke. Drawing follows line-art-animation (MIT); see lib/confirm-motion.ts. */}
      <circle className="confirm-check-stroke" cx="12" cy="12" r="10" transform="rotate(-90 12 12)" {...circleDash(circleOffset)} />
      <path className="confirm-check-stroke" d={checkPath} />
    </svg>
  )
}

function Item({
  icon: Icon,
  label,
  value,
  style,
}: {
  icon: typeof Clock
  label: string
  value: string
  style: CSSProperties
}) {
  return (
    <div className="confirm-row flex items-start justify-between gap-4 py-4 text-sm" style={style}>
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
