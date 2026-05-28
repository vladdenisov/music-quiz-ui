import { CheckCircle2 } from "lucide-react";
import { strings } from "../shared/i18n/strings";
import type { AnswerOption } from "../shared/model/types";

type Props = {
  options: AnswerOption[];
  selectedOptionId?: string;
  correctOptionId?: string;
  disabled?: boolean;
  resultPlayers?: {
    playerId: string;
    selectedOptionId?: string;
    isCorrect: boolean;
    score: number;
  }[];
  getPlayerName?: (playerId: string) => string;
  onSelect: (optionId: string) => void;
};

export function AnswerGrid({ options, selectedOptionId, correctOptionId, disabled, resultPlayers, getPlayerName, onSelect }: Props) {
  const hasResult = Boolean(correctOptionId);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option, index) => {
        const selected = selectedOptionId === option.id;
        const correct = correctOptionId === option.id;
        const voters = resultPlayers?.filter((player) => player.selectedOptionId === option.id) ?? [];
        const resultClass = correct ? "bg-[#168a3a] text-cream" : hasResult && voters.length > 0 ? "bg-accent text-cream" : "";
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className={`min-h-24 rounded-[22px] p-4 text-left transition ${
              resultClass || (selected ? "bg-ink text-cream" : "bg-cream hover:-translate-y-0.5")
            } disabled:hover:translate-y-0`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-xs uppercase opacity-75">вариант {index + 1}</span>
              {selected ? <CheckCircle2 size={18} /> : null}
            </div>
            <div className="break-words font-display text-xl leading-tight">{option.label}</div>
            {voters.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {voters.map((player) => (
                  <span key={player.playerId} className="rounded-full bg-cream/20 px-3 py-1 text-xs font-bold">
                    {getPlayerName?.(player.playerId) ?? "Игрок"} · {player.score}
                  </span>
                ))}
              </div>
            ) : null}
          </button>
        );
      })}
      {hasResult && resultPlayers?.some((player) => !player.selectedOptionId) ? (
        <div className="rounded-[22px] bg-cream/70 p-4 sm:col-span-2">
          <div className="label mb-2">Без ответа</div>
          <div className="flex flex-wrap gap-2">
            {resultPlayers
              .filter((player) => !player.selectedOptionId)
              .map((player) => (
                <span key={player.playerId} className="rounded-full bg-paper px-3 py-1 text-sm font-bold">
                  {getPlayerName?.(player.playerId) ?? "Игрок"}
                </span>
              ))}
          </div>
        </div>
      ) : null}
      {selectedOptionId ? <div className="sm:col-span-2 label text-accent">{strings.answerSubmitted}</div> : null}
    </div>
  );
}
