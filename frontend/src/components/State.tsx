import { Loader2, SearchX } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 rounded-xl bg-surface-raised text-sm text-text-secondary ring-1 ring-surface-border/80">
      <Loader2 className="h-4 w-4 animate-spin text-forest-300" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title = "No results", description }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl bg-surface-raised px-4 text-center ring-1 ring-surface-border/70">
      <SearchX className="h-5 w-5 text-text-muted" />
      <span className="text-sm font-medium text-text-primary">{title}</span>
      {description ? <span className="max-w-md text-xs text-text-secondary">{description}</span> : null}
    </div>
  );
}

