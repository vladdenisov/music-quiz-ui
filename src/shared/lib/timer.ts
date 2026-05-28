export function getRemainingMs(roundEndsAt: string, now = Date.now()) {
  return Math.max(0, new Date(roundEndsAt).getTime() - now);
}

export function getRoundProgress(roundStartedAt: string, roundEndsAt: string, now = Date.now()) {
  const start = new Date(roundStartedAt).getTime();
  const end = new Date(roundEndsAt).getTime();
  if (end <= start) return 1;
  return Math.min(1, Math.max(0, (now - start) / (end - start)));
}

export function formatSeconds(ms: number) {
  return Math.ceil(ms / 1000).toString().padStart(2, "0");
}
