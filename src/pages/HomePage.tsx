import { ArrowRight, DoorOpen, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brand } from "../components/Brand";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { strings } from "../shared/i18n/strings";
import { defaultSettings } from "../shared/model/settings";
import { useRoomStore } from "../features/room/roomStore";

export function HomePage() {
  const navigate = useNavigate();
  const createRoom = useRoomStore((state) => state.createRoom);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const error = useRoomStore((state) => state.error);
  const connectionState = useRoomStore((state) => state.connectionState);
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  async function handleCreate() {
    if (!nickname.trim()) {
      setFormError(strings.errors.nicknameRequired);
      return;
    }

    setBusy("create");
    setFormError(undefined);
    try {
      const code = await createRoom(nickname.trim(), defaultSettings);
      navigate(`/rooms/${code}`);
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : strings.errors.generic);
    } finally {
      setBusy(undefined);
    }
  }

  async function handleJoin(event: FormEvent) {
    event.preventDefault();
    if (!nickname.trim()) {
      setFormError(strings.errors.nicknameRequired);
      return;
    }
    if (!roomCode.trim()) {
      setFormError(strings.errors.codeRequired);
      return;
    }

    setBusy("join");
    setFormError(undefined);
    try {
      const code = await joinRoom(roomCode.trim().toUpperCase(), nickname.trim());
      navigate(`/rooms/${code}`);
    } catch (joinError) {
      setFormError(joinError instanceof Error ? joinError.message : strings.errors.generic);
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden p-5 sm:p-8">
      <header className="flex items-center justify-between gap-4">
        <Brand />
        <div className="hidden sm:block">
          <ConnectionBanner state={connectionState} error={error} />
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-110px)] gap-8 py-8 xl:grid-cols-[1fr_520px] xl:items-center">
        <div className="relative">
          <div className="mb-8 flex flex-wrap gap-3">
            <div className="chip bg-accent text-cream">● {strings.live} · 248 комнат</div>
            <div className="chip">Side A / 2026</div>
          </div>
          <h1 className="font-display text-[19vw] uppercase leading-[0.82] tracking-normal sm:text-[17vw] xl:text-[8.5rem]">
            {strings.homeTitleA}
            <br />
            <span className="text-accent">{strings.homeTitleB}</span>
            <br />
            {strings.homeTitleC}
          </h1>
          <p className="mt-8 max-w-2xl text-2xl leading-snug text-[#4a3327]">{strings.homeSubtitle}</p>
          <div className="mt-10 hidden max-w-lg rotate-[-5deg] rounded-[32px] border-[8px] border-line bg-ink p-5 shadow-soft md:block">
            <div className="rounded-2xl border-2 border-[#5e4633] bg-cream p-4 font-mono text-lg uppercase">
              Side A <span className="font-display">Микс вечера</span> · 90 min
            </div>
            <div className="mt-5 grid grid-cols-2 gap-12 px-6 pb-3 text-cream">
              <div className="aspect-square rounded-full border-[10px] border-cream" />
              <div className="aspect-square rounded-full border-[10px] border-cream" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-5 sm:p-7">
            <div className="label mb-3">01 / твоё имя</div>
            <label className="block">
              <span className="sr-only">{strings.nickname}</span>
              <input
                className="field"
                placeholder="golubaya_laguna"
                value={nickname}
                maxLength={32}
                onChange={(event) => setNickname(event.target.value)}
              />
            </label>
          </section>

          <section className="panel p-5 sm:p-7">
            <div className="label mb-3">02A / создать комнату</div>
            <h2 className="mb-4 font-display text-4xl uppercase leading-none">{strings.createRoom}</h2>
            <p className="mb-6 text-lg text-[#4a3327]">Ты выбираешь жанр, длину раунда и тип вопросов. Друзья подключаются по коду.</p>
            <button type="button" className="button-primary flex w-full items-center justify-center gap-3" disabled={busy === "create"} onClick={handleCreate}>
              <Sparkles size={24} />
              {busy === "create" ? "Создаём" : strings.createRoom}
              <ArrowRight size={24} />
            </button>
          </section>

          <form className="panel p-5 sm:p-7" onSubmit={handleJoin}>
            <div className="label mb-3">02B / войти по коду</div>
            <h2 className="mb-4 font-display text-4xl uppercase leading-none">{strings.roomCode}</h2>
            <input
              className="field mb-5 font-mono text-3xl uppercase tracking-[0.18em]"
              placeholder="AX7Q3"
              value={roomCode}
              maxLength={12}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
            />
            <button type="submit" className="button-secondary flex w-full items-center justify-center gap-3" disabled={busy === "join"}>
              <DoorOpen size={22} />
              {busy === "join" ? "Входим" : strings.joinRoom}
            </button>
          </form>

          {formError || error ? <div className="rounded-2xl border-[3px] border-line bg-accent p-4 font-bold text-cream">{formError || error}</div> : null}
        </div>
      </section>
    </main>
  );
}
