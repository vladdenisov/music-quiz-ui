import { Wifi, WifiOff } from "lucide-react";
import { strings } from "../shared/i18n/strings";

type Props = {
  state: "idle" | "connecting" | "connected" | "disconnected" | "reconnecting";
  error?: string;
};

export function ConnectionBanner({ state, error }: Props) {
  const isOnline = state === "connected";
  const label = state === "idle" ? strings.connection.disconnected : strings.connection[state];

  return (
    <div className={`chip flex items-center gap-2 ${isOnline ? "text-ink" : "text-accent"}`}>
      {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{error || label}</span>
    </div>
  );
}
