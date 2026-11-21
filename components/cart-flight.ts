import { centerOf, flightControl, shouldPlayCartFlight, type Point } from "@/lib/fly-to-cart"

/** Long enough to read the arc, short enough to cross the deal bar before its glow is the thing you notice. */
export const FLIGHT_MS = 600
const TILE_PX = 72

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)"

const listeners = new Set<() => void>()

export function onCartFlightLanded(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notifyCartFlightLanded() {
  for (const listener of listeners) listener()
}

function curvePath(from: Point, control: Point, to: Point) {
  const n = (value: number) => value.toFixed(2)
  return `path("M ${n(from.x)} ${n(from.y)} Q ${n(control.x)} ${n(control.y)} ${n(to.x)} ${n(to.y)}")`
}

function liftedShadow(alpha: number, blur: number) {
  const drop = blur === 0 ? "0 0 0 transparent" : `0 ${Math.round(blur * 0.7)}px ${blur}px rgba(31, 29, 27, ${alpha})`
  return `0 0 0 1px rgba(31, 29, 27, 0.08), ${drop}`
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** A small copy of the thumbnail arcs into the cart icon, then the counter bumps. */
export function flyProductToCart(source: HTMLElement, imageSrc: string) {
  if (!shouldPlayCartFlight(prefersReducedMotion())) return

  const sourceRect = source.getBoundingClientRect()
  if (sourceRect.width < 8 || sourceRect.height < 8) return

  // The cart label changes width as the first price replaces "Warenkorb".
  // Read the icon after that commit, so the arc ends on the icon where it actually sits.
  requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>("[data-cart-target]")
    if (!target) return
    const targetRect = target.getBoundingClientRect()
    if (targetRect.width < 8 || targetRect.height < 8) return
    launchFlight(sourceRect, targetRect, imageSrc)
  })
}

function launchFlight(sourceRect: DOMRect, targetRect: DOMRect, imageSrc: string) {
  const from = centerOf(sourceRect)
  const to = centerOf(targetRect)
  const control = flightControl(from, to)

  const shell = document.createElement("div")
  shell.setAttribute("aria-hidden", "true")
  shell.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "z-index:45",
    "pointer-events:none",
    "margin:0",
    `width:${TILE_PX}px`,
    `height:${TILE_PX}px`,
    "offset-anchor:center",
    "offset-rotate:0deg",
  ].join(";")
  shell.style.offsetPath = curvePath(from, control, to)
  shell.style.offsetDistance = "0%"

  const tile = document.createElement("div")
  tile.style.cssText = "width:100%;height:100%;border-radius:var(--radius);background:var(--muted);overflow:hidden;isolation:isolate;"

  const image = document.createElement("img")
  image.src = imageSrc
  image.alt = ""
  image.draggable = false
  image.style.cssText = "display:block;width:100%;height:100%;object-fit:contain;padding:6px;mix-blend-mode:multiply;"

  tile.append(image)
  shell.append(tile)
  document.body.append(shell)

  // Two keyframes, so this easing is the whole arc — fast across the deal bar, soft into the icon.
  const travel = shell.animate([{ offsetDistance: "0%" }, { offsetDistance: "100%" }], {
    duration: FLIGHT_MS,
    easing: EASE_OUT,
    fill: "forwards",
  })

  tile.animate(
    [
      { offset: 0, transform: "scale(0.64) rotate(-6deg)", opacity: 1, boxShadow: liftedShadow(0.12, 10) },
      { offset: 0.16, transform: "scale(1) rotate(-2deg)", opacity: 1, boxShadow: liftedShadow(0.22, 22) },
      { offset: 0.7, transform: "scale(0.48) rotate(4deg)", opacity: 1, boxShadow: liftedShadow(0.12, 12) },
      { offset: 1, transform: "scale(0.16) rotate(0deg)", opacity: 0, boxShadow: liftedShadow(0, 0) },
    ],
    { duration: FLIGHT_MS, easing: "linear", fill: "forwards" },
  )

  let settled = false
  const finish = (landed: boolean) => {
    if (settled) return
    settled = true
    shell.remove()
    if (landed) notifyCartFlightLanded()
  }

  travel.onfinish = () => finish(true)
  window.setTimeout(() => finish(travel.playState === "finished"), FLIGHT_MS + 400)
}
