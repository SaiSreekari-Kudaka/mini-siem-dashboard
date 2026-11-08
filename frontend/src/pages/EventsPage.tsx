import { useEffect, useState } from "react";
import { Eye, Search, X } from "lucide-react";

import { SeverityBadge } from "../components/Badge";
import { EmptyState, LoadingState } from "../components/State";
import { fetchEvents } from "../services/api";
import type { NormalizedEvent, Page } from "../types";
import { formatDate } from "../utils/format";

export function EventsPage() {
  const [data, setData] = useState<Page<NormalizedEvent> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NormalizedEvent | null>(null);
  const [filters, setFilters] = useState({ q: "", severity: "", event_type: "", source_ip: "", username: "", hostname: "" });

  useEffect(() => {
    setLoading(true);
    fetchEvents({ ...filters, page_size: 30 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Events</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Normalized telemetry across sources. Filter to investigate specific activity.</p>
      </div>

      <div className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
        <div className="grid gap-3 md:grid-cols-[minmax(180px,1.5fr)_repeat(5,minmax(120px,1fr))]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" strokeWidth={1.75} />
            <input
              className="focus-ring w-full rounded-lg bg-surface-inset py-2 pl-9 pr-3 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
              placeholder="Search events"
              value={filters.q}
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
            />
          </label>
          <FilterInput label="Severity" value={filters.severity} onChange={(value) => setFilters((current) => ({ ...current, severity: value }))} options={["", "critical", "high", "medium", "low"]} />
          <FilterInput label="Type" value={filters.event_type} onChange={(value) => setFilters((current) => ({ ...current, event_type: value }))} options={["", "failed_login", "successful_login", "web_request", "http_404", "firewall_denied"]} />
          <TextFilter label="Source IP" value={filters.source_ip} onChange={(value) => setFilters((current) => ({ ...current, source_ip: value }))} />
          <TextFilter label="Username" value={filters.username} onChange={(value) => setFilters((current) => ({ ...current, username: value }))} />
          <TextFilter label="Hostname" value={filters.hostname} onChange={(value) => setFilters((current) => ({ ...current, hostname: value }))} />
        </div>
      </div>

      {loading ? <LoadingState label="Loading events" /> : data && data.items.length > 0 ? <EventsTable events={data.items} onSelect={setSelected} /> : <EmptyState title="No events found" description="Try adjusting filters or upload new logs." />}

      {selected ? <EventDrawer event={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}

function EventsTable({ events, onSelect }: { events: NormalizedEvent[]; onSelect: (event: NormalizedEvent) => void }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-raised shadow-panel ring-1 ring-surface-border/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-surface-inset/60 text-[11px] uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Time</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Severity</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Host</th>
              <th className="px-4 py-2.5 font-medium">Message</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-surface-border/50 transition hover:bg-surface-hover/60">
                <td className="whitespace-nowrap px-4 py-2.5 text-[12px] text-text-secondary">{formatDate(event.timestamp)}</td>
                <td className="px-4 py-2.5 text-[13px] text-text-primary">{event.event_type}</td>
                <td className="px-4 py-2.5">
                  <SeverityBadge value={event.severity} />
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">{event.source_ip ?? "—"}</td>
                <td className="px-4 py-2.5 text-[13px] text-text-secondary">{event.username ?? "—"}</td>
                <td className="px-4 py-2.5 text-[13px] text-text-secondary">{event.hostname ?? "—"}</td>
                <td className="max-w-sm truncate px-4 py-2.5 text-[13px] text-text-muted">{event.message}</td>
                <td className="px-4 py-2.5 text-right">
                  <button className="focus-ring rounded-lg p-1.5 text-text-muted transition hover:bg-surface-inset hover:text-text-primary" onClick={() => onSelect(event)} aria-label="View event details">
                    <Eye className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventDrawer({ event, onClose }: { event: NormalizedEvent; onClose: () => void }) {
  const fields = Object.entries(event).filter(([key]) => !["raw_log", "message"].includes(key));
  return (
    <div className="fixed inset-0 z-40 bg-black/55" onClick={onClose}>
      <aside className="ml-auto flex h-full w-full max-w-2xl flex-col border-l border-surface-border/70 bg-surface-base shadow-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-surface-border/60 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">{event.event_type}</h2>
            <p className="text-[12px] text-text-muted">{formatDate(event.timestamp)}</p>
          </div>
          <button className="focus-ring rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">Message</div>
            <p className="rounded-lg bg-surface-raised p-3 text-[13px] leading-relaxed text-text-secondary ring-1 ring-surface-border/60">{event.message}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map(([key, value]) => (
              <div key={key} className="rounded-lg bg-surface-raised p-3 ring-1 ring-surface-border/50">
                <div className="text-[10px] font-medium uppercase tracking-wide text-text-muted">{key.replace(/_/g, " ")}</div>
                <div className="mt-1 break-words text-[13px] text-text-primary">{String(value ?? "—")}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">Raw log</div>
            <pre className="max-h-64 overflow-auto rounded-lg bg-[#07100c] p-3 text-[11px] leading-relaxed text-text-secondary ring-1 ring-surface-border/50">{event.raw_log ?? "—"}</pre>
          </div>
        </div>
      </aside>
    </div>
  );
}

function FilterInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select className="focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option || "all"} value={option}>
            {option || label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextFilter({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      className="focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
      placeholder={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

