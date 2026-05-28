type Props = {
  total: number;
  outcomes: Record<number, "correct" | "wrong">;
};

export function RoundProgress({ total, outcomes }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {Array.from({ length: total }, (_, index) => {
        const roundNumber = index + 1;
        const outcome = outcomes[roundNumber];
        const className = outcome === "correct" ? "bg-[#168a3a]" : outcome === "wrong" ? "bg-accent" : "bg-cream";

        return (
          <div
            key={roundNumber}
            className={`h-4 w-4 rounded-full ${className}`}
            title={`Раунд ${roundNumber}`}
            aria-label={`Раунд ${roundNumber}`}
          />
        );
      })}
    </div>
  );
}
