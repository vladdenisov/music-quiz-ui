import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnswerGrid } from "./AnswerGrid";

const options = [
  { id: "a", label: "Toxic" },
  { id: "b", label: "Hung Up" },
  { id: "c", label: "Maneater" },
  { id: "d", label: "Don't Cha" }
];

describe("AnswerGrid", () => {
  it("renders four options and submits selected option", async () => {
    const onSelect = vi.fn();
    render(<AnswerGrid options={options} onSelect={onSelect} />);

    expect(screen.getAllByRole("button")).toHaveLength(4);
    await userEvent.click(screen.getByRole("button", { name: /Toxic/i }));
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("locks buttons after answer is selected", () => {
    render(<AnswerGrid options={options} selectedOptionId="b" disabled onSelect={vi.fn()} />);

    expect(screen.getByRole("button", { name: /Hung Up/i })).toBeDisabled();
    expect(screen.getByText("Ответ принят")).toBeInTheDocument();
  });

  it("does not show player choices before round result is available", () => {
    render(
      <AnswerGrid
        options={options}
        selectedOptionId="a"
        resultPlayers={[{ playerId: "p1", selectedOptionId: "a", isCorrect: true, score: 900 }]}
        getPlayerName={() => "Лена"}
        onSelect={vi.fn()}
      />
    );

    expect(screen.queryByText(/Лена/)).not.toBeInTheDocument();
  });

  it("shows player choices after round result is available", () => {
    render(
      <AnswerGrid
        options={options}
        correctOptionId="a"
        resultPlayers={[{ playerId: "p1", selectedOptionId: "a", isCorrect: true, score: 900 }]}
        getPlayerName={() => "Лена"}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText(/Лена · 900/)).toBeInTheDocument();
  });
});
