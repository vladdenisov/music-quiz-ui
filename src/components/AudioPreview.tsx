import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const VOLUME_KEY = "music-quiz:volume";

function readStoredVolume(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw !== null) return Math.min(1, Math.max(0, Number(raw)));
  } catch {}
  return 0.7;
}

type Props = {
  src: string;
};

export function AudioPreview({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [volume, setVolume] = useState(readStoredVolume);

  useEffect(() => {
    setPlaying(false);
    setBlocked(false);
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    const play = audio.play();
    if (play) {
      void play.catch(() => setBlocked(true));
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
    try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch {}
  }, [volume]);

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
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-paper/80 px-3 py-2">
          <button type="button" onClick={() => setVolume(volume > 0 ? 0 : readStoredVolume() || 0.7)} className="text-muted hover:text-ink transition-colors">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider w-20 sm:w-28 accent-accent"
          />
        </div>
        <button type="button" onClick={toggle} className="button-primary flex items-center justify-center gap-3 sm:min-w-52">
          {playing ? <Pause size={24} /> : <Play size={24} />}
          {playing ? "Пауза" : "Слушать"}
        </button>
      </div>
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
