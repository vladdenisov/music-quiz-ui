import { Check, Home, Music, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Leaderboard } from "./Leaderboard";
import { strings } from "../shared/i18n/strings";
import type { RoundHistoryEntry } from "../features/room/roomStore";
import type { LeaderboardEntry } from "../shared/model/types";

type Props = {
  leaderboard: LeaderboardEntry[];
  roundHistory: RoundHistoryEntry[];
  currentPlayerId?: string;
  totalScore: number;
};

export function GameResultsView({ leaderboard, roundHistory, currentPlayerId, totalScore }: Props) {
  const correctCount = roundHistory.filter((r) => r.isCorrect).length;
  const totalCount = roundHistory.length;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <section className="rounded-[32px] bg-paper p-5 sm:p-7">
          <div className="label mb-2">{strings.final}</div>
          <h1 className="mb-2 font-display text-4xl uppercase sm:text-6xl">Игра завершена</h1>
          <div className="flex flex-wrap items-center gap-4 text-lg">
            <span className="rounded-full bg-[#168a3a]/10 px-4 py-1.5 font-bold text-[#168a3a]">
              {correctCount} из {totalCount} верно
            </span>
            <span className="font-display text-2xl text-accent">{totalScore} очков</span>
          </div>
        </section>

        <section className="rounded-[32px] bg-paper p-5 sm:p-7">
          <h2 className="mb-4 font-display text-xl uppercase">Все треки</h2>
          <div className="space-y-3">
            {roundHistory.map((entry) => (
              <TrackCard key={entry.roundNumber} entry={entry} />
            ))}
          </div>
        </section>

        <Link to="/" className="button-primary flex w-full items-center justify-center gap-3">
          <Home size={22} />
          {strings.backHome}
        </Link>
      </div>

      <Leaderboard entries={leaderboard} currentPlayerId={currentPlayerId} final />
    </div>
  );
}

function TrackCard({ entry }: { entry: RoundHistoryEntry }) {
  const selectedOption = entry.options.find((o) => o.id === entry.selectedOptionId);

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition ${
        entry.isCorrect ? "border-[#168a3a]/40 bg-[#168a3a]/5" : "border-accent/30 bg-accent/5"
      }`}
    >
      {entry.artworkUrl ? (
        <img src={entry.artworkUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream">
          <Music size={24} className="text-muted" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted">#{entry.roundNumber}</span>
          {entry.isCorrect ? (
            <span className="flex items-center gap-1 rounded-full bg-[#168a3a] px-2 py-0.5 text-xs font-bold text-white">
              <Check size={12} /> Верно
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
              <X size={12} /> Неверно
            </span>
          )}
          {entry.playerScore > 0 && (
            <span className="font-mono text-xs text-[#168a3a]">+{entry.playerScore}</span>
          )}
        </div>
        <div className="mt-1 truncate font-bold leading-tight">{entry.correctArtist} — {entry.correctTitle}</div>
        {entry.album && <div className="truncate text-sm text-muted">{entry.album}</div>}
        {!entry.isCorrect && selectedOption && (
          <div className="mt-1 text-sm text-accent">
            Твой ответ: {selectedOption.label}
          </div>
        )}
        {!entry.isCorrect && !entry.selectedOptionId && (
          <div className="mt-1 text-sm text-muted">Нет ответа</div>
        )}
      </div>
    </div>
  );
}
