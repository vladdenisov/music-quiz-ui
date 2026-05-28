import { Crown, UserRound } from "lucide-react";
import { strings } from "../shared/i18n/strings";
import type { PublicPlayerState } from "../shared/model/types";

type Props = {
  players: PublicPlayerState[];
};

export function PlayerList({ players }: Props) {
  return (
    <section className="panel-flat p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl uppercase">{strings.players}</h2>
        <span className="chip">{players.length}</span>
      </div>
      <div className="space-y-3">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-line bg-paper px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`rounded-xl border-2 border-line p-2 ${player.isConnected ? "bg-cream" : "bg-muted/20"}`}>
                {player.isHost ? <Crown size={18} className="text-accent" /> : <UserRound size={18} />}
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold">{player.nickname}</div>
                <div className="font-mono text-xs uppercase text-muted">{player.isConnected ? "онлайн" : "вышел"}</div>
              </div>
            </div>
            <div className="font-display text-xl">{player.score}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
