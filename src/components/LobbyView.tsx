import { useState } from "react";
import { Copy, Play } from "lucide-react";
import { SettingsPanel } from "./SettingsPanel";
import { PlayerList } from "./PlayerList";
import { strings } from "../shared/i18n/strings";
import { validateSource } from "../shared/model/settings";
import type { GameSettings, GenerationOptions, PublicRoomState, Session } from "../shared/model/types";

type Props = {
  room: PublicRoomState;
  session?: Session;
  generationOptions?: GenerationOptions;
  onSettingsChange: (settings: GameSettings) => void;
  onStart: () => void;
};

export function LobbyView({ room, session, generationOptions, onSettingsChange, onStart }: Props) {
  const isHost = session?.playerId === room.hostPlayerId;
  const [validationError, setValidationError] = useState<string | undefined>();

  function handleStart() {
    const error = validateSource(room.settings.source);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(undefined);
    onStart();
  }

  function handleSettingsChange(settings: GameSettings) {
    setValidationError(undefined);
    onSettingsChange(settings);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <section className="panel p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="label mb-2">{strings.lobby}</div>
            <h1 className="font-display text-5xl uppercase sm:text-7xl">{room.code}</h1>
          </div>
          <button type="button" className="button-secondary flex items-center justify-center gap-2" onClick={() => void navigator.clipboard?.writeText(room.code)}>
            <Copy size={18} />
            Скопировать код
          </button>
        </div>

        <SettingsPanel settings={room.settings} generationOptions={generationOptions} editable={isHost} onChange={handleSettingsChange} />

        <div className="mt-6">
          {isHost ? (
            <>
              {validationError ? (
                <div className="mb-3 rounded-2xl border-2 border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {validationError}
                </div>
              ) : null}
              <button type="button" className="button-primary flex w-full items-center justify-center gap-3" onClick={handleStart}>
                <Play size={26} />
                {strings.startGame}
              </button>
            </>
          ) : (
            <div className="panel-flat p-5 text-lg font-semibold">{strings.waitingHost}</div>
          )}
        </div>
      </section>

      <PlayerList players={room.players} />
    </div>
  );
}
