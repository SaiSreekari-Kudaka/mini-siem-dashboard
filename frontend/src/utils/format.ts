import clsx from "clsx";

export function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function shortNumber(value: number) {
  return new Intl.NumberFormat(undefined, { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

export function severityClass(severity?: string) {
  return clsx(
    "border",
    severity === "critical" && "border-red-400/25 bg-red-500/12 text-red-200",
    severity === "high" && "border-orange-400/25 bg-orange-500/12 text-orange-200",
    severity === "medium" && "border-amber-400/25 bg-amber-500/10 text-amber-100",
    severity === "low" && "border-sky-400/20 bg-sky-500/10 text-sky-100",
    !severity && "border-surface-border bg-surface-inset text-text-secondary",
  );
}

export function statusClass(status?: string) {
  return clsx(
    "border",
    status === "open" && "border-red-400/25 bg-red-500/12 text-red-200",
    status === "investigating" && "border-forest-300/25 bg-forest-500/15 text-forest-100",
    status === "resolved" && "border-emerald-400/25 bg-emerald-500/12 text-emerald-100",
    status === "false_positive" && "border-surface-border bg-surface-inset text-text-secondary",
    !status && "border-surface-border bg-surface-inset text-text-secondary",
  );
}

