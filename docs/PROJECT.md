# Project

A clickable prototype of a first grocery order. Sample products and sample prices, no real checkout. The deal stays on screen from the first window through payment: the minimum order, the delivery fee, the next slot, and the total.

Numbers live in `config.ts`. Cart math lives in `lib/pricing.ts`. The bottle deposit does not count toward the minimum.

## Crossing the minimum

The deal bar shows how close the cart is. When the goods value reaches the minimum:

- the bar runs to the end and glows once
- the truck icon morphs into a check
- the add-to-cart note glows on that same add, and not on later ones
- a screen reader hears "Mindestbestellwert erreicht" once (the copy in the cart drawer does not announce it again)

Adding more after that does not replay it. If the cart drops below the minimum, the check morphs back into the truck and the bar shrinks. There is no glow on the way down.

With `prefers-reduced-motion: reduce`, the icon swaps and the bar jumps.

Whether the cart just crossed is `thresholdCrossing` in `lib/minimum-threshold.ts`. The morph uses [morphicons](https://github.com/guillermolg00/morphicons) (MIT). The glow is a short sheen on the bar.

A product flying into the cart is a separate idea and is not part of this.

## Checks

`pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`.
