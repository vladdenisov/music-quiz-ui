import { Radio } from "lucide-react";
import { strings } from "../shared/i18n/strings";

export function Brand() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-line bg-ink text-cream">
        <Radio size={22} className="text-accent" />
      </div>
      <div className="font-display text-3xl uppercase leading-none sm:text-4xl">{strings.appName}</div>
      <div className="hidden rounded-full border-[3px] border-line px-5 py-2 font-mono text-sm uppercase sm:block">
        {strings.version} · MVP
      </div>
    </div>
  );
}
