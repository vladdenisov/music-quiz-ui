import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatSeconds, getRemainingMs, getRoundProgress } from "../shared/lib/timer";

type Props = {
  startedAt: string;
  endsAt: string;
};

export function RoundTimer({ startedAt, endsAt }: Props) {
  const [now, setNow] = useState(Date.now());
  const remaining = getRemainingMs(endsAt, now);
  const progress = getRoundProgress(startedAt, endsAt, now);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(interval);
  }, [startedAt, endsAt]);

  return (
    <div className="rounded-[20px] bg-cream/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-2xl">
          <Clock3 size={22} className="text-accent" />
          {formatSeconds(remaining)}
        </div>
        <div className="font-mono text-xs uppercase text-muted">сек</div>
      </div>
      <div className="h-4 overflow-hidden rounded-full border-2 border-line bg-paper">
        <div className="h-full bg-accent transition-[width]" style={{ width: `${Math.max(0, 100 - progress * 100)}%` }} />
      </div>
    </div>
  );
}
