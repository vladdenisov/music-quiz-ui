import type { Session } from "../model/types";

const key = "music-quiz-session";

export function saveSession(session: Session) {
  localStorage.setItem(key, JSON.stringify(session));
}

export function readSession(roomCode?: string): Session | undefined {
  const raw = localStorage.getItem(key);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as Session;
    if (roomCode && parsed.roomCode.toUpperCase() !== roomCode.toUpperCase()) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function clearSession() {
  localStorage.removeItem(key);
}
