import { FastForward } from "lucide-react";
import { AnswerGrid } from "./AnswerGrid";
import { AudioPreview } from "./AudioPreview";
import { Leaderboard } from "./Leaderboard";
import { RoundProgress } from "./RoundProgress";
import { RoundTimer } from "./RoundTimer";
import { strings } from "../shared/i18n/strings";
import type { AnswerSubmitted, LeaderboardEntry, PublicRoundState, RoundResultState, Session } from "../shared/model/types";

type Props = {
  round?: PublicRoundState;
  result?: RoundResultState;
  leaderboard: LeaderboardEntry[];
  selectedOptionId?: string;
  answer?: AnswerSubmitted;
  session?: Session;
  isHost?: boolean;
  totalRounds: number;
  roundOutcomes: Record<number, "correct" | "wrong">;
  onAnswer: (optionId: string) => void;
  onNextRound: () => void;
};

export function GameView({
  round,
  result,
  leaderboard,
  selectedOptionId,
  answer,
  session,
  isHost,
  totalRounds,
  roundOutcomes,
  onAnswer,
  onNextRound
}: Props) {
  const getPlayerName = (playerId: string) => leaderboard.find((entry) => entry.playerId === playerId)?.nickname ?? "Игрок";
  const ownResult = result?.playerResults.find((playerResult) => playerResult.playerId === session?.playerId);
  const questionText = round ? strings.questionType[round.questionType] || round.questionText : "";

  if (result && !round) {
    const ownResult = result.playerResults.find((playerResult) => playerResult.playerId === session?.playerId);
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-[32px] bg-paper p-5 sm:p-7">
          <RoundProgress total={totalRounds} outcomes={roundOutcomes} />
          <div className="label mb-2">Раунд завершён</div>
          <h1 className="mb-5 font-display text-4xl uppercase sm:text-6xl">{strings.correctAnswer}</h1>
          <div className="flex flex-col gap-5 rounded-[24px] bg-cream p-4 sm:flex-row sm:items-center">
            {result.artworkUrl ? <img src={result.artworkUrl} alt="" className="h-28 w-28 rounded-[18px] object-cover" /> : null}
            <div className="min-w-0 flex-1">
              <div className="label mb-2">{result.correctArtist}</div>
              <div className="font-display text-3xl uppercase leading-tight">{result.correctTitle}</div>
              {result.album ? <div className="mt-2 text-muted">{result.album}</div> : null}
            </div>
            <div className="rounded-[20px] bg-paper px-5 py-4">
              <div className="label mb-1">{strings.yourScore}</div>
              <div className="font-display text-4xl text-accent">{ownResult?.score ?? 0}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {result.playerResults.map((playerResult) => {
              const entry = leaderboard.find((candidate) => candidate.playerId === playerResult.playerId);
              return (
                <div key={playerResult.playerId} className={`rounded-2xl p-4 ${playerResult.isCorrect ? "bg-[#168a3a] text-cream" : "bg-accent text-cream"}`}>
                  <div className="font-bold">{entry?.nickname ?? "Игрок"}</div>
                  <div className="font-mono text-sm uppercase opacity-80">
                    {playerResult.isCorrect ? "верно" : "нет ответа / ошибка"} · {playerResult.score}
                  </div>
                </div>
              );
            })}
          </div>

          {isHost ? (
            <button type="button" className="button-primary mt-6 flex w-full items-center justify-center gap-3" onClick={onNextRound}>
              <FastForward size={24} />
              {strings.nextRound}
            </button>
          ) : (
            <div className="label mt-6">{strings.waitingNext}</div>
          )}
        </section>
        <Leaderboard entries={leaderboard} currentPlayerId={session?.playerId} />
      </div>
    );
  }

  if (!round) {
    return <div className="panel p-8 text-lg font-semibold">{strings.waitingNext}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="rounded-[32px] bg-paper p-5 sm:p-7">
        <RoundProgress total={totalRounds} outcomes={roundOutcomes} />
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="label mb-2">{result ? "Раунд завершён" : `${strings.round} ${round.roundNumber} · ${strings.questionMode[round.questionType]}`}</div>
            <h1 className="font-display text-4xl uppercase leading-none sm:text-6xl">{result ? strings.correctAnswer : questionText}</h1>
          </div>
          {!result ? (
            <div className="lg:w-52">
              <RoundTimer startedAt={round.roundStartedAt} endsAt={round.roundEndsAt} />
            </div>
          ) : null}
        </div>

        {result ? (
          <div className="mb-5 flex flex-col gap-4 rounded-[24px] bg-cream/80 p-4 sm:flex-row sm:items-center">
            {result.artworkUrl ? <img src={result.artworkUrl} alt="" className="h-24 w-24 rounded-[18px] object-cover" /> : null}
            <div className="min-w-0 flex-1">
              <div className="label mb-2">{result.correctArtist}</div>
              <div className="truncate font-display text-3xl uppercase">{result.correctTitle}</div>
              {result.album ? <div className="truncate text-muted">{result.album}</div> : null}
            </div>
            <div className="rounded-[18px] bg-paper px-5 py-3">
              <div className="label">{strings.yourScore}</div>
              <div className="font-display text-4xl text-accent">{ownResult?.score ?? 0}</div>
            </div>
          </div>
        ) : (
          <AudioPreview src={round.previewUrl} />
        )}

        <div className="mt-6">
          <AnswerGrid
            options={round.options}
            selectedOptionId={selectedOptionId}
            correctOptionId={result?.correctOptionId}
            resultPlayers={result?.playerResults}
            getPlayerName={getPlayerName}
            disabled={Boolean(result || selectedOptionId || answer)}
            onSelect={onAnswer}
          />
        </div>

        {result ? (
          <div className="mt-6">
            {isHost ? (
              <button type="button" className="button-primary flex w-full items-center justify-center gap-3" onClick={onNextRound}>
                <FastForward size={24} />
                {strings.nextRound}
              </button>
            ) : (
              <div className="label">{strings.waitingNext}</div>
            )}
          </div>
        ) : null}
      </section>
      <Leaderboard entries={leaderboard} currentPlayerId={session?.playerId} />
    </div>
  );
}
