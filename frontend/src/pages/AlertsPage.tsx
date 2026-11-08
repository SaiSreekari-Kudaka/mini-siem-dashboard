import { useEffect, useState } from "react";
import { FileText, Search, X } from "lucide-react";

import { SeverityBadge, StatusBadge } from "../components/Badge";
import { EmptyState, LoadingState } from "../components/State";
import { useAuth } from "../components/AuthProvider";
import { useToast } from "../components/Toast";
import { addAlertNote, fetchAlert, fetchAlerts, updateAlertStatus } from "../services/api";
import type { Alert, AlertDetail, AlertStatus, Page } from "../types";
import { formatDate } from "../utils/format";

export function AlertsPage() {
  const [data, setData] = useState<Page<Alert> | null>(null);
  const [detail, setDetail] = useState<AlertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", severity: "", status: "", source_ip: "", username: "" });

  useEffect(() => {
    setLoading(true);
    fetchAlerts({ ...filters, page_size: 30 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters]);

  async function openDetail(alert: Alert) {
    setDetail(await fetchAlert(alert.id));
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Alerts</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Triage detections by severity, status, and source context.</p>
      </div>

      <div className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
        <div className="grid gap-3 md:grid-cols-[minmax(180px,1.5fr)_repeat(4,minmax(120px,1fr))]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" strokeWidth={1.75} />
            <input
              className="focus-ring w-full rounded-lg bg-surface-inset py-2 pl-9 pr-3 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
              placeholder="Search alerts"
              value={filters.q}
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
            />
          </label>
          <Select value={filters.severity} onChange={(severity) => setFilters((current) => ({ ...current, severity }))} options={["", "critical", "high", "medium", "low"]} label="Severity" />
          <Select value={filters.status} onChange={(status) => setFilters((current) => ({ ...current, status }))} options={["", "open", "investigating", "resolved", "false_positive"]} label="Status" />
          <Text value={filters.source_ip} onChange={(source_ip) => setFilters((current) => ({ ...current, source_ip }))} label="Source IP" />
          <Text value={filters.username} onChange={(username) => setFilters((current) => ({ ...current, username }))} label="Username" />
        </div>
      </div>

      {loading ? <LoadingState label="Loading alerts" /> : data && data.items.length > 0 ? <AlertsTable alerts={data.items} onSelect={openDetail} /> : <EmptyState title="No alerts found" description="No detections match the current filters." />}

      {detail ? <AlertDrawer detail={detail} onClose={() => setDetail(null)} onRefresh={async () => setDetail(await fetchAlert(detail.id))} /> : null}
    </div>
  );
}

function AlertsTable({ alerts, onSelect }: { alerts: Alert[]; onSelect: (alert: Alert) => void }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-raised shadow-panel ring-1 ring-surface-border/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-surface-inset/60 text-[11px] uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Severity</th>
              <th className="px-4 py-2.5 font-medium">Alert</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Events</th>
              <th className="px-4 py-2.5 font-medium">Last seen</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-t border-surface-border/50 transition hover:bg-surface-hover/60">
                <td className="px-4 py-2.5">
                  <SeverityBadge value={alert.severity} />
                </td>
                <td className="max-w-sm px-4 py-2.5 text-[13px] font-medium text-text-primary">{alert.title}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge value={alert.status} />
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">{alert.source_ip ?? "—"}</td>
                <td className="px-4 py-2.5 text-[13px] text-text-secondary">{alert.affected_user ?? "—"}</td>
                <td className="px-4 py-2.5 text-[13px] text-text-secondary">{alert.event_count}</td>
                <td className="px-4 py-2.5 text-[12px] text-text-secondary">{formatDate(alert.last_seen)}</td>
                <td className="px-4 py-2.5 text-right">
                  <button className="focus-ring rounded-lg p-1.5 text-text-muted transition hover:bg-surface-inset hover:text-text-primary" onClick={() => onSelect(alert)} aria-label="View alert details">
                    <FileText className="h-4 w-4" strokeWidth={1.75} />
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

function AlertDrawer({ detail, onClose, onRefresh }: { detail: AlertDetail; onClose: () => void; onRefresh: () => Promise<void> }) {
  const { can } = useAuth();
  const { notify } = useToast();
  const [note, setNote] = useState("");
  const canInvestigate = can("admin", "analyst");

  async function changeStatus(status: AlertStatus) {
    await updateAlertStatus(detail.id, status);
    notify("Alert status updated", "success");
    await onRefresh();
  }

  async function submitNote() {
    if (!note.trim()) return;
    await addAlertNote(detail.id, note);
    setNote("");
    notify("Note added", "success");
    await onRefresh();
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/55" onClick={onClose}>
      <aside className="ml-auto flex h-full w-full max-w-3xl flex-col border-l border-surface-border/70 bg-surface-base shadow-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-surface-border/60 px-5 py-4">
          <div className="min-w-0 space-y-2">
            <h2 className="text-base font-semibold text-text-primary">{detail.title}</h2>
            <div className="flex flex-wrap gap-2">
              <SeverityBadge value={detail.severity} />
              <StatusBadge value={detail.status} />
            </div>
          </div>
          <button className="focus-ring rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">Alert information</div>
            <p className="rounded-lg bg-surface-raised p-3 text-[13px] leading-relaxed text-text-secondary ring-1 ring-surface-border/60">{detail.description}</p>
            <div className="mt-3 grid gap-2 text-[12px] text-text-secondary sm:grid-cols-3">
              <div className="rounded-lg bg-surface-raised px-3 py-2 ring-1 ring-surface-border/50">
                <div className="text-[10px] uppercase tracking-wide text-text-muted">Source</div>
                <div className="mt-0.5 font-mono text-text-primary">{detail.source_ip ?? "—"}</div>
              </div>
              <div className="rounded-lg bg-surface-raised px-3 py-2 ring-1 ring-surface-border/50">
                <div className="text-[10px] uppercase tracking-wide text-text-muted">Affected user</div>
                <div className="mt-0.5 text-text-primary">{detail.affected_user ?? "—"}</div>
              </div>
              <div className="rounded-lg bg-surface-raised px-3 py-2 ring-1 ring-surface-border/50">
                <div className="text-[10px] uppercase tracking-wide text-text-muted">Events</div>
                <div className="mt-0.5 text-text-primary">{detail.event_count}</div>
              </div>
            </div>
          </section>

          {canInvestigate ? (
            <section>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">Status</div>
              <div className="flex flex-wrap gap-2">
                {(["open", "investigating", "resolved", "false_positive"] as AlertStatus[]).map((status) => (
                  <button
                    key={status}
                    className={`focus-ring rounded-lg px-3 py-1.5 text-[13px] capitalize transition ring-1 ${
                      detail.status === status ? "bg-forest-500/18 text-text-primary ring-forest-400/20" : "bg-surface-raised text-text-secondary ring-surface-border/60 hover:bg-surface-hover"
                    }`}
                    onClick={() => changeStatus(status)}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">Related events</h3>
            <div className="space-y-2">
              {detail.related_events.slice(0, 12).map((event) => (
                <div key={event.id} className="rounded-lg bg-surface-raised p-3 ring-1 ring-surface-border/50">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                    <span>{formatDate(event.timestamp)}</span>
                    <span className="font-mono">{event.source_ip ?? "—"}</span>
                    <SeverityBadge value={event.severity} />
                  </div>
                  <p className="mt-1.5 text-[13px] text-text-secondary">{event.message}</p>
                </div>
              ))}
              {!detail.related_events.length ? <p className="text-[13px] text-text-muted">No related events.</p> : null}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">Investigation notes</h3>
            <div className="space-y-2">
              {detail.notes.map((item) => (
                <div key={item.id} className="rounded-lg bg-surface-raised p-3 ring-1 ring-surface-border/50">
                  <div className="mb-1 text-[11px] text-text-muted">
                    {item.user?.username ?? "analyst"} · {formatDate(item.created_at)}
                  </div>
                  <div className="text-[13px] text-text-secondary">{item.note}</div>
                </div>
              ))}
              {canInvestigate ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    className="focus-ring min-h-20 w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add an investigation note…"
                  />
                  <div className="flex justify-end">
                    <button className="focus-ring rounded-lg bg-forest-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-500" onClick={submitNote}>
                      Add note
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select className="focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option || "all"} value={option}>
          {option || label}
        </option>
      ))}
    </select>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      className="focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
      placeholder={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

