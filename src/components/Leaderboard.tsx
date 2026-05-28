import { Trophy } from "lucide-react";
import { strings } from "../shared/i18n/strings";
import type { LeaderboardEntry } from "../shared/model/types";

type Props = {
  entries: LeaderboardEntry[];
  currentPlayerId?: string;
  final?: boolean;
};

export function Leaderboard({ entries, currentPlayerId, final }: Props) {
  const sorted = [...entries].sort((left, right) => right.score - left.score);
  return (
    <section className="panel-flat p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase">{final ? strings.final : strings.leaderboard}</h2>
        <Trophy className="text-accent" size={22} />
      </div>
      <div className="space-y-3">
        {sorted.map((entry, index) => (
          <div
            key={entry.playerId}
            className={`flex items-center justify-between rounded-2xl border-2 border-line px-4 py-3 ${
              entry.playerId === currentPlayerId ? "bg-accent text-cream" : "bg-paper"
            }`}
          >
            <div className="min-w-0">
              <div className="font-mono text-xs opacity-70">#{index + 1}</div>
              <div className="truncate text-lg font-bold">{entry.nickname}</div>
            </div>
            <div className="font-display text-2xl">{entry.score}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
