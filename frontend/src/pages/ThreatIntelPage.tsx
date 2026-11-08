import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

import { SeverityBadge } from "../components/Badge";
import { EmptyState, LoadingState } from "../components/State";
import { useAuth } from "../components/AuthProvider";
import { useToast } from "../components/Toast";
import { createIndicator, deleteIndicator, fetchIndicators } from "../services/api";
import type { Page, Severity, ThreatIndicator } from "../types";

export function ThreatIntelPage() {
  const [data, setData] = useState<Page<ThreatIndicator> | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { can } = useAuth();
  const { notify } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    fetchIndicators({ q: query, page_size: 50 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    await deleteIndicator(id);
    notify("Indicator deleted", "success");
    await load();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Threat intelligence</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Manage indicators used to enrich and contextualize detections.</p>
      </div>

      <div className={`grid gap-4 ${can("admin") ? "xl:grid-cols-[minmax(0,1fr)_340px]" : ""}`}>
        <section className="rounded-xl bg-surface-raised shadow-panel ring-1 ring-surface-border/80">
          <div className="border-b border-surface-border/60 p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" strokeWidth={1.75} />
              <input
                className="focus-ring w-full rounded-lg bg-surface-inset py-2 pl-9 pr-3 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
                placeholder="Search indicators"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          {loading ? <div className="p-4"><LoadingState label="Loading indicators" /></div> : data && data.items.length ? <IndicatorTable indicators={data.items} canEdit={can("admin")} onDelete={remove} /> : <div className="p-4"><EmptyState title="No indicators found" description="Add indicators or adjust your search." /></div>}
        </section>
        {can("admin") ? <IndicatorForm onCreated={load} /> : null}
      </div>
    </div>
  );
}

function IndicatorTable({ indicators, canEdit, onDelete }: { indicators: ThreatIndicator[]; canEdit: boolean; onDelete: (id: number) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-surface-inset/60 text-[11px] uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Value</th>
            <th className="px-4 py-2.5 font-medium">Severity</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
            <th className="px-4 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {indicators.map((indicator) => (
            <tr key={indicator.id} className="border-t border-surface-border/50 transition hover:bg-surface-hover/60">
              <td className="px-4 py-2.5 text-[13px] capitalize text-text-secondary">{indicator.type}</td>
              <td className="px-4 py-2.5 font-mono text-[12px] text-text-primary">{indicator.value}</td>
              <td className="px-4 py-2.5">
                <SeverityBadge value={indicator.severity} />
              </td>
              <td className="max-w-md px-4 py-2.5 text-[13px] text-text-secondary">{indicator.description ?? "—"}</td>
              <td className="px-4 py-2.5 text-right">
                <button
                  className="focus-ring rounded-lg p-1.5 text-text-muted transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-40"
                  disabled={!canEdit}
                  onClick={() => onDelete(indicator.id)}
                  aria-label="Delete indicator"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IndicatorForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const { notify } = useToast();
  const [form, setForm] = useState({ type: "ip" as ThreatIndicator["type"], value: "", description: "", severity: "medium" as Severity });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await createIndicator(form);
    notify("Indicator added", "success");
    setForm({ type: "ip", value: "", description: "", severity: "medium" });
    await onCreated();
  }

  const inputClass = "focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted";
  return (
    <form onSubmit={submit} className="h-fit rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
      <h2 className="mb-4 text-[13px] font-semibold text-text-primary">Add indicator</h2>
      <div className="space-y-3">
        <select className={inputClass} value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as ThreatIndicator["type"] }))}>
          <option value="ip">IP</option>
          <option value="domain">Domain</option>
          <option value="username">Username</option>
        </select>
        <input required className={inputClass} placeholder="Value" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} />
        <input className={inputClass} placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        <select className={inputClass} value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value as Severity }))}>
          {["low", "medium", "high", "critical"].map((severity) => (
            <option key={severity}>{severity}</option>
          ))}
        </select>
        <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-500">
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Add indicator
        </button>
      </div>
    </form>
  );
}
