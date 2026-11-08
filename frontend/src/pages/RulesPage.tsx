import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Search, ToggleLeft, ToggleRight } from "lucide-react";

import { SeverityBadge } from "../components/Badge";
import { EmptyState, LoadingState } from "../components/State";
import { useAuth } from "../components/AuthProvider";
import { useToast } from "../components/Toast";
import { createRule, fetchRules, toggleRule } from "../services/api";
import type { DetectionRule, Page, Severity } from "../types";

export function RulesPage() {
  const [data, setData] = useState<Page<DetectionRule> | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { can } = useAuth();
  const { notify } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    fetchRules({ q: query, page_size: 100 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  async function onToggle(rule: DetectionRule) {
    await toggleRule(rule.id, !rule.enabled);
    notify(`Rule ${!rule.enabled ? "enabled" : "disabled"}`, "success");
    await load();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Detection rules</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Manage rule status and conditions used to generate alerts.</p>
      </div>

      <div className={`grid gap-4 ${can("admin") ? "xl:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
        <section className="rounded-xl bg-surface-raised shadow-panel ring-1 ring-surface-border/80">
          <div className="border-b border-surface-border/60 p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" strokeWidth={1.75} />
              <input
                className="focus-ring w-full rounded-lg bg-surface-inset py-2 pl-9 pr-3 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
                placeholder="Search rules"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          {loading ? <div className="p-4"><LoadingState label="Loading rules" /></div> : data && data.items.length ? <RuleList rules={data.items} canEdit={can("admin")} onToggle={onToggle} /> : <div className="p-4"><EmptyState title="No rules found" description="Try a different search." /></div>}
        </section>
        {can("admin") ? <CustomRuleForm onCreated={load} /> : null}
      </div>
    </div>
  );
}

function RuleList({ rules, canEdit, onToggle }: { rules: DetectionRule[]; canEdit: boolean; onToggle: (rule: DetectionRule) => void }) {
  return (
    <div className="divide-y divide-surface-border/50">
      {rules.map((rule) => (
        <article key={rule.id} className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[14px] font-semibold text-text-primary">{rule.name}</h3>
                <SeverityBadge value={rule.severity} />
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${rule.enabled ? "bg-forest-500/12 text-forest-200 ring-forest-400/15" : "bg-surface-inset text-text-muted ring-surface-border/50"}`}>
                  {rule.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-text-secondary">{rule.description}</p>
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-text-muted">
                <span className="rounded-md bg-surface-inset px-2 py-1 ring-1 ring-surface-border/40">Threshold {rule.threshold}</span>
                <span className="rounded-md bg-surface-inset px-2 py-1 ring-1 ring-surface-border/40">{rule.time_window_minutes} min window</span>
              </div>
            </div>
            <button
              className="focus-ring flex shrink-0 items-center gap-2 rounded-lg bg-surface-inset px-3 py-2 text-[13px] text-text-secondary ring-1 ring-surface-border/50 transition hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
              disabled={!canEdit}
              onClick={() => onToggle(rule)}
            >
              {rule.enabled ? <ToggleRight className="h-4.5 w-4.5 text-forest-300" strokeWidth={1.75} /> : <ToggleLeft className="h-4.5 w-4.5 text-text-muted" strokeWidth={1.75} />}
              {rule.enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function CustomRuleForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: "", description: "", severity: "medium" as Severity, eventType: "failed_login", threshold: 3, window: 10 });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await createRule({
      name: form.name,
      description: form.description,
      severity: form.severity,
      enabled: true,
      threshold: form.threshold,
      time_window_minutes: form.window,
      conditions_json: { type: "threshold", filters: { event_type: form.eventType }, group_by: ["source_ip"] },
    });
    notify("Custom rule created", "success");
    setForm({ name: "", description: "", severity: "medium", eventType: "failed_login", threshold: 3, window: 10 });
    await onCreated();
  }

  const inputClass = "focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted";
  return (
    <form onSubmit={submit} className="h-fit rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
      <h2 className="mb-4 text-[13px] font-semibold text-text-primary">Create custom rule</h2>
      <div className="space-y-3">
        <Input label="Name" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} className={inputClass} />
        <Input label="Description" value={form.description} onChange={(description) => setForm((current) => ({ ...current, description }))} className={inputClass} />
        <Input label="Event type" value={form.eventType} onChange={(eventType) => setForm((current) => ({ ...current, eventType }))} className={inputClass} />
        <select className={inputClass} value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value as Severity }))}>
          {["low", "medium", "high", "critical"].map((severity) => (
            <option key={severity}>{severity}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Threshold" value={form.threshold} onChange={(threshold) => setForm((current) => ({ ...current, threshold }))} className={inputClass} />
          <NumberInput label="Minutes" value={form.window} onChange={(window) => setForm((current) => ({ ...current, window }))} className={inputClass} />
        </div>
        <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-500">
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Create rule
        </button>
      </div>
    </form>
  );
}

function Input({ label, value, onChange, className }: { label: string; value: string; onChange: (value: string) => void; className: string }) {
  return <input required className={className} placeholder={label} value={value} onChange={(event) => onChange(event.target.value)} />;
}

function NumberInput({ label, value, onChange, className }: { label: string; value: number; onChange: (value: number) => void; className: string }) {
  return <input required min={1} className={className} placeholder={label} type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />;
}
