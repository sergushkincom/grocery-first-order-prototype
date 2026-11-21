export type ThresholdCrossing = "reached" | "dropped" | "none"

/**
 * The cart either just crossed the minimum, just fell back under it, or stayed
 * on the same side. Staying above it — even if the total grows — is "none",
 * so the celebration plays once per crossing and only reverses on the way down.
 */
export function thresholdCrossing(wasReached: boolean, isReached: boolean): ThresholdCrossing {
  if (wasReached === isReached) return "none"
  return isReached ? "reached" : "dropped"
}

/** The glow is the arrival, not the retreat, and it stays off when motion is reduced. */
export function playsReachedGlow(crossing: ThresholdCrossing, prefersReducedMotion: boolean): boolean {
  return crossing === "reached" && !prefersReducedMotion
}

/**
 * Spoken status for the deal bar. The reached sentence does not include the
 * running total, so adding more once the minimum is met does not announce again.
 */
export function minimumLiveAnnouncement(minReached: boolean, remainingLabel: string, creditLabel: string): string {
  if (minReached) {
    return `Mindestbestellwert erreicht. Die erste Lieferung ist gratis. Plus ${creditLabel} Guthaben.`
  }
  return `Noch ${remainingLabel} bis zum Mindestbestellwert.`
}
