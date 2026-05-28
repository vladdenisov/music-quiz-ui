import { describe, expect, it } from "vitest";
import { formatSeconds, getRemainingMs, getRoundProgress } from "./timer";

describe("round timer helpers", () => {
  it("calculates remaining time from backend timestamps", () => {
    expect(getRemainingMs("2026-05-28T12:00:10.000Z", Date.parse("2026-05-28T12:00:04.200Z"))).toBe(5800);
  });

  it("calculates progress and display seconds", () => {
    const start = "2026-05-28T12:00:00.000Z";
    const end = "2026-05-28T12:00:10.000Z";

    expect(getRoundProgress(start, end, Date.parse("2026-05-28T12:00:05.000Z"))).toBe(0.5);
    expect(formatSeconds(4200)).toBe("05");
  });
});
