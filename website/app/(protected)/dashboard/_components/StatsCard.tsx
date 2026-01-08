interface StatsCardProps {
  title: string;
  icon: string;
  value: number;
  change: number;
  periodLabel: string;
}

export function StatsCard({
  title,
  icon,
  value,
  change,
  periodLabel,
}: StatsCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const formattedValue = new Intl.NumberFormat("en-US").format(value);
  const formattedChange = new Intl.NumberFormat("en-US").format(
    Math.abs(change),
  );

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 text-sm font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-display">{formattedValue}</span>
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium ${
              isPositive
                ? "text-green-500"
                : isNegative
                  ? "text-red-500"
                  : "text-white/60"
            }`}
          >
            {isPositive ? "+" : isNegative ? "-" : ""}
            {formattedChange}
          </span>
          <span className="text-xs text-white/40">{periodLabel}</span>
        </div>
      </div>
    </div>
  );
}
