import { useState } from "react";
import { Download, FileJson, FileText, UploadCloud } from "lucide-react";

import { SeverityBadge } from "../components/Badge";
import { EmptyState } from "../components/State";
import { useToast } from "../components/Toast";
import { uploadLogs } from "../services/api";
import type { IngestResponse } from "../types";

const samples = [
  { label: "SSH auth", href: "/sample_logs/ssh_auth.log" },
  { label: "Web access", href: "/sample_logs/web_access.log" },
  { label: "Firewall", href: "/sample_logs/firewall.log" },
  { label: "JSON app", href: "/sample_logs/application_logins.jsonl" },
];

export function UploadLogsPage() {
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    try {
      const response = await uploadLogs(file, setProgress);
      setResult(response);
      notify(`Parsed ${response.parsed_count} events and touched ${response.alert_count} alerts`, "success");
    } catch {
      notify("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Upload logs</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Ingest supported log files, review parsing results, and inspect generated events.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <section className="rounded-xl bg-surface-raised p-5 shadow-panel ring-1 ring-surface-border/80">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest-500/18 text-[10px] text-forest-200 ring-1 ring-forest-400/15">1</span>
              Select file
            </div>
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-inset/50 p-6 text-center transition hover:border-forest-400/30 hover:bg-surface-inset">
              <UploadCloud className="mb-3 h-8 w-8 text-forest-300" strokeWidth={1.5} />
              <span className="text-sm font-medium text-text-primary">{file ? file.name : "Choose JSON, CSV, TXT, or LOG"}</span>
              <span className="mt-1 text-[12px] text-text-muted">Maximum file size 2 MB</span>
              <input className="hidden" type="file" accept=".json,.csv,.txt,.log" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                className="focus-ring flex items-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-500 disabled:opacity-50"
                disabled={!file || loading}
                onClick={submit}
              >
                <UploadCloud className="h-4 w-4" strokeWidth={1.75} />
                {loading ? "Processing…" : "Upload & process"}
              </button>
              <div className="flex-1">
                <div className="h-1.5 min-w-40 overflow-hidden rounded-full bg-surface-inset ring-1 ring-surface-border/40">
                  <div className="h-full bg-forest-400 transition-all" style={{ width: `${progress}%` }} />
                </div>
                {loading || progress > 0 ? <div className="mt-1 text-[11px] text-text-muted">{progress}%</div> : null}
              </div>
            </div>
          </section>

          {result ? (
            <section className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
              <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">Processing results</div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-surface-inset px-3 py-2.5 ring-1 ring-surface-border/40">
                  <div className="text-[10px] uppercase tracking-wide text-text-muted">Events parsed</div>
                  <div className="mt-1 text-lg font-semibold text-text-primary">{result.parsed_count}</div>
                </div>
                <div className="rounded-lg bg-surface-inset px-3 py-2.5 ring-1 ring-surface-border/40">
                  <div className="text-[10px] uppercase tracking-wide text-text-muted">Alerts affected</div>
                  <div className="mt-1 text-lg font-semibold text-text-primary">{result.alert_count}</div>
                </div>
                <div className="rounded-lg bg-surface-inset px-3 py-2.5 ring-1 ring-surface-border/40">
                  <div className="text-[10px] uppercase tracking-wide text-text-muted">Errors</div>
                  <div className="mt-1 text-lg font-semibold text-text-primary">{result.errors.length}</div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
            <h2 className="mb-3 text-[13px] font-semibold text-text-primary">Event preview</h2>
            {result?.preview.length ? (
              <div className="overflow-x-auto rounded-lg ring-1 ring-surface-border/50">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-surface-inset/60 text-[11px] uppercase tracking-wide text-text-muted">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Type</th>
                      <th className="px-4 py-2.5 font-medium">Severity</th>
                      <th className="px-4 py-2.5 font-medium">Source</th>
                      <th className="px-4 py-2.5 font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.preview.map((event) => (
                      <tr key={event.id} className="border-t border-surface-border/50">
                        <td className="px-4 py-2.5 text-[13px] text-text-primary">{event.event_type}</td>
                        <td className="px-4 py-2.5">
                          <SeverityBadge value={event.severity} />
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-text-secondary">{event.source_ip ?? "—"}</td>
                        <td className="max-w-md truncate px-4 py-2.5 text-[13px] text-text-muted">{event.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No preview yet" description="Upload a log file to see parsed events." />
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
            <h2 className="mb-3 text-[13px] font-semibold text-text-primary">Sample logs</h2>
            <div className="space-y-1.5">
              {samples.map((sample) => (
                <a
                  key={sample.href}
                  className="focus-ring flex items-center justify-between rounded-lg bg-surface-inset/60 px-3 py-2.5 text-[13px] text-text-secondary ring-1 ring-surface-border/40 transition hover:bg-surface-hover hover:text-text-primary"
                  href={sample.href}
                  download
                >
                  <span className="flex items-center gap-2">
                    {sample.href.endsWith(".jsonl") ? <FileJson className="h-4 w-4 text-forest-300" strokeWidth={1.75} /> : <FileText className="h-4 w-4 text-text-muted" strokeWidth={1.75} />}
                    {sample.label}
                  </span>
                  <Download className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
            <h2 className="mb-3 text-[13px] font-semibold text-text-primary">Parse errors</h2>
            {result?.errors.length ? (
              <div className="max-h-64 space-y-2 overflow-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="rounded-lg bg-amber-500/8 p-2.5 text-[12px] leading-relaxed text-amber-100/90 ring-1 ring-amber-400/15">
                    {error}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-surface-inset/60 px-3 py-3 text-[13px] text-text-muted ring-1 ring-surface-border/40">No errors reported.</div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

