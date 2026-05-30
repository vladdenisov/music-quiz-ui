import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { defaultSettings } from "../shared/model/settings";
import { GameResultsView } from "./GameResultsView";

const leaderboard = [
  { playerId: "host", nickname: "Хост", score: 1200 },
  { playerId: "guest", nickname: "Гость", score: 300 }
];

describe("GameResultsView", () => {
  it("shows replay control only for the host", async () => {
    const onStart = vi.fn();
    renderView({ isHost: true, onStart });

    await userEvent.click(screen.getByRole("button", { name: /Сыграть ещё/i }));
    expect(onStart).toHaveBeenCalledWith(defaultSettings);
  });

  it("hides replay control for regular players", () => {
    renderView({ isHost: false });

    expect(screen.queryByRole("button", { name: /Сыграть ещё/i })).not.toBeInTheDocument();
  });
});

function renderView({ isHost, onStart = vi.fn() }: { isHost: boolean; onStart?: (settings: typeof defaultSettings) => void }) {
  render(
    <MemoryRouter>
      <GameResultsView
        leaderboard={leaderboard}
        roundHistory={[]}
        currentPlayerId="host"
        totalScore={1200}
        isHost={isHost}
        settings={defaultSettings}
        onStart={onStart}
      />
    </MemoryRouter>
  );
}
