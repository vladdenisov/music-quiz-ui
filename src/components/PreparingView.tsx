import { Disc3 } from "lucide-react";
import type { GamePreparingState } from "../shared/model/types";

type Props = {
  preparing: GamePreparingState;
};

const phaseLabels: Record<GamePreparingState["phase"], string> = {
  queued: "Ставим задачу в очередь",
  spotify_search: "Ищем треки",
  preview_matching: "Подбираем audio preview",
  building_rounds: "Собираем раунды",
  ready: "Готово",
  failed: "Не удалось собрать игру"
};

export function PreparingView({ preparing }: Props) {
  const progress = getPreparingProgress(preparing);
  const matched = preparing.matchedTracks ?? 0;
  const rejected = preparing.rejectedTracks ?? 0;

  return (
    <section className="mx-auto max-w-4xl rounded-[32px] bg-paper p-6 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-5">
        <div>
          <div className="label mb-3">Старт игры</div>
          <h1 className="font-display text-5xl uppercase leading-none sm:text-7xl">Собираем плейлист</h1>
        </div>
        <Disc3 className={`mt-2 text-accent ${preparing.phase !== "failed" ? "animate-spin" : ""}`} size={44} />
      </div>

      <div className="rounded-[24px] bg-cream/80 p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-2xl uppercase">{phaseLabels[preparing.phase]}</div>
            <div className="mt-1 text-muted">{preparing.message}</div>
          </div>
          <div className="font-display text-4xl text-accent">{Math.round(progress)}%</div>
        </div>
        <div className="h-5 overflow-hidden rounded-full bg-paper">
          <div className={`h-full ${preparing.phase === "failed" ? "bg-accent" : "bg-[#168a3a]"}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <Metric label="Раундов" value={preparing.requestedRounds} />
        <Metric label="Цель треков" value={preparing.targetTracks} />
        <Metric label="Найдено" value={preparing.foundSourceTracks ?? 0} />
        <Metric label="Preview" value={`${matched}/${matched + rejected}`} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[20px] bg-cream/70 p-4">
      <div className="label mb-2">{label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}

function getPreparingProgress(preparing: GamePreparingState) {
  if (preparing.phase === "failed") return 100;
  if (preparing.phase === "ready") return 100;
  if (preparing.phase === "building_rounds") return 92;
  if (preparing.phase === "spotify_search") return 20;
  if (preparing.phase === "preview_matching") {
    const done = Math.min(preparing.targetTracks, preparing.matchedTracks ?? 0);
    return Math.min(88, 25 + (done / Math.max(1, preparing.targetTracks)) * 60);
  }
  return 8;
}
