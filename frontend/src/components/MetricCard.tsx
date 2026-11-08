import type { LucideIcon } from "lucide-react";

import { shortNumber } from "../utils/format";

export function MetricCard({
  title,
  value,
  icon: Icon,
  tone = "forest",
  hint,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  tone?: "forest" | "neutral" | "amber" | "red";
  hint?: string;
}) {
  const tones = {
    forest: "bg-forest-500/12 text-forest-200",
    neutral: "bg-surface-inset text-text-secondary",
    amber: "bg-amber-500/12 text-amber-100",
    red: "bg-red-500/12 text-red-200",
  };
  return (
    <div className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text-secondary">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">{shortNumber(value)}</p>
          {hint ? <p className="mt-1.5 text-xs text-text-muted">{hint}</p> : null}
        </div>
        <div className={`rounded-lg p-2.5 ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

