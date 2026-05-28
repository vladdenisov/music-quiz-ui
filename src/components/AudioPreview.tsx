import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
};

export function AudioPreview({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setBlocked(false);
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    const play = audio.play();
    if (play) {
      void play.catch(() => setBlocked(true));
    }
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-[24px] bg-cream/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="label mb-2">Audio preview</div>
        <div className="font-display text-2xl uppercase">{playing ? "Трек играет" : blocked ? "Нажми, чтобы включить" : "Запускаем трек"}</div>
      </div>
      <button type="button" onClick={toggle} className="button-primary flex items-center justify-center gap-3 sm:min-w-52">
          {playing ? <Pause size={24} /> : <Play size={24} />}
          {playing ? "Пауза" : "Слушать"}
      </button>
      <audio
        ref={audioRef}
        src={src}
        autoPlay
        preload="auto"
        onPlay={() => {
          setBlocked(false);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
