import { DoorOpen } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Brand } from "../components/Brand";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { GameView } from "../components/GameView";
import { Leaderboard } from "../components/Leaderboard";
import { LobbyView } from "../components/LobbyView";
import { PreparingView } from "../components/PreparingView";
import { useRoomStore } from "../features/room/roomStore";
import { strings } from "../shared/i18n/strings";
import { defaultSettings } from "../shared/model/settings";

export function RoomPage() {
  const params = useParams();
  const navigate = useNavigate();
  const roomCode = (params.roomCode ?? "").toUpperCase();
  const {
    room,
    session,
    activeRound,
    roundResult,
    roundOutcomes,
    leaderboard,
    generationOptions,
    preparing,
    selectedOptionId,
    answer,
    connectionState,
    error,
    loadGenerationOptions,
    loadRoom,
    restoreSession,
    connect,
    joinRoom,
    startGame,
    submitAnswer,
    nextRound,
    updateLocalSettings
  } = useRoomStore();
  const [nickname, setNickname] = useState("");
  const [joinError, setJoinError] = useState<string | undefined>();
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    void loadGenerationOptions().catch(() => undefined);
  }, [loadGenerationOptions]);

  useEffect(() => {
    if (!roomCode) return;
    void loadRoom(roomCode).catch((loadError) => setJoinError(loadError instanceof Error ? loadError.message : strings.errors.generic));
    const restored = restoreSession(roomCode);
    if (restored) connect(restored);
  }, [connect, loadRoom, restoreSession, roomCode]);

  const isHost = useMemo(() => Boolean(room && session?.playerId === room.hostPlayerId), [room, session]);

  async function handleJoin(event: FormEvent) {
    event.preventDefault();
    if (!nickname.trim()) {
      setJoinError(strings.errors.nicknameRequired);
      return;
    }
    setJoining(true);
    setJoinError(undefined);
    try {
      const joinedCode = await joinRoom(roomCode, nickname.trim());
      const restored = restoreSession(joinedCode);
      if (restored) connect(restored);
    } catch (joinRoomError) {
      setJoinError(joinRoomError instanceof Error ? joinRoomError.message : strings.errors.generic);
    } finally {
      setJoining(false);
    }
  }

  if (!roomCode) {
    navigate("/");
    return null;
  }

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Brand />
        <div className="flex flex-wrap items-center gap-3">
          <ConnectionBanner state={connectionState} error={error} />
          <Link to="/" className="button-secondary">
            {strings.backHome}
          </Link>
        </div>
      </header>

      {!session ? (
        <section className="panel mx-auto max-w-xl p-6 sm:p-8">
          <div className="label mb-3">{roomCode}</div>
          <h1 className="mb-4 font-display text-4xl uppercase">{strings.noSession}</h1>
          <form onSubmit={handleJoin} className="space-y-4">
            <input className="field" placeholder="Имя игрока" value={nickname} onChange={(event) => setNickname(event.target.value)} />
            <button type="submit" className="button-primary flex w-full items-center justify-center gap-3" disabled={joining}>
              <DoorOpen size={22} />
              {joining ? "Подключаемся" : strings.joinRoom}
            </button>
          </form>
          {joinError ? <div className="mt-5 rounded-2xl border-[3px] border-line bg-accent p-4 font-bold text-cream">{joinError}</div> : null}
        </section>
      ) : !room ? (
        <section className="panel p-8 text-lg font-semibold">Загружаем комнату</section>
      ) : preparing ? (
        <PreparingView preparing={preparing} />
      ) : room.status === "lobby" ? (
        <LobbyView
          room={room}
          session={session}
          generationOptions={generationOptions}
          onSettingsChange={updateLocalSettings}
          onStart={() => startGame(room.settings ?? defaultSettings)}
        />
      ) : room.status === "ended" ? (
        <section className="mx-auto max-w-3xl">
          <Leaderboard entries={leaderboard} currentPlayerId={session.playerId} final />
          <Link to="/" className="button-primary mt-6 flex w-full justify-center">
            {strings.backHome}
          </Link>
        </section>
      ) : (
        <GameView
          round={activeRound}
          result={roundResult}
          leaderboard={leaderboard}
          selectedOptionId={selectedOptionId}
          answer={answer}
          session={session}
          isHost={isHost}
          totalRounds={room.settings.roundsCount}
          roundOutcomes={roundOutcomes}
          onAnswer={submitAnswer}
          onNextRound={nextRound}
        />
      )}
    </main>
  );
}
