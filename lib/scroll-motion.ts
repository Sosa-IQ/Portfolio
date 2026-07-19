export function calculateRevealProgress(elementTop: number, viewportHeight: number): number {
  if (viewportHeight <= 0) return elementTop <= 0 ? 1 : 0;

  const revealStart = viewportHeight * 0.95;
  const revealEnd = viewportHeight * 0.32;
  const progress = (revealStart - elementTop) / (revealStart - revealEnd);
  return Math.min(1, Math.max(0, progress));
}
