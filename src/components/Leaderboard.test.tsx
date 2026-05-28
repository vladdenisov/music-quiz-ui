import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Leaderboard } from "./Leaderboard";

describe("Leaderboard", () => {
  it("renders players sorted by score", () => {
    render(
      <Leaderboard
        entries={[
          { playerId: "1", nickname: "Лена", score: 300 },
          { playerId: "2", nickname: "Ира", score: 900 }
        ]}
      />
    );

    const names = screen.getAllByText(/Лена|Ира/).map((node) => node.textContent);
    expect(names).toEqual(["Ира", "Лена"]);
  });
});
