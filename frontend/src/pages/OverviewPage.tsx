import { useEffect, useState, type ReactNode } from "react";
import { Activity, AlertTriangle, Bell, ShieldAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SeverityBadge, StatusBadge } from "../components/Badge";
import { MetricCard } from "../components/MetricCard";
import { EmptyState, LoadingState } from "../components/State";
import { fetchDashboard } from "../services/api";
import type { DashboardSummary, SeriesPoint } from "../types";
import { formatDate } from "../utils/format";

const severityPalette: Record<string, string> = {
  critical: "#b45454",
  high: "#b97a48",
  medium: "#b08a46",
  low: "#4f7f99",
};
const palette = ["#4f8a68", "#6b947c", "#8fb29d", "#b08a46", "#7a8f84"];

export function OverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (!summary) return <EmptyState title="Dashboard unavailable" description="The summary endpoint did not return data." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Security overview</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Current activity, alert posture, and recent detections from connected telemetry.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total events" value={summary.total_events} icon={Activity} tone="neutral" hint="Ingested & normalized" />
        <MetricCard title="Total alerts" value={summary.total_alerts} icon={Bell} tone="forest" hint="Detections generated" />
        <MetricCard title="Open critical alerts" value={summary.open_critical_alerts} icon={ShieldAlert} tone="red" hint="Require attention" />
        <MetricCard title="Recent alerts shown" value={summary.recent_alerts.length} icon={AlertTriangle} tone="amber" hint="Latest activity" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <ChartPanel title="Event activity" description="Volume of events over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={summary.events_over_time} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="eventFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f8a68" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#4f8a68" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1d3328" vertical={false} />
              <XAxis dataKey="label" stroke="#6f8679" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6f8679" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#2f5e45" }} />
              <Area type="monotone" dataKey="value" stroke="#6b947c" fill="url(#eventFill)" strokeWidth={1.75} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Alert severity" description="Distribution by severity">
          <Donut data={summary.alerts_by_severity} />
        </ChartPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartPanel title="Top source IPs" description="Most frequent sources">
          <HorizontalBars data={summary.top_source_ips} />
        </ChartPanel>
        <ChartPanel title="Top usernames" description="Most frequent identities">
          <HorizontalBars data={summary.top_usernames} />
        </ChartPanel>
        <ChartPanel title="Top event types" description="Most common event classes">
          <HorizontalBars data={summary.top_event_types} />
        </ChartPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <ChartPanel title="Authentication outcomes" description="Failed vs successful logins">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.login_trends} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#1d3328" vertical={false} />
              <XAxis dataKey="label" stroke="#6f8679" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6f8679" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#12211a" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9fb3a7" }} />
              <Bar dataKey="failed" name="Failed" fill="#b45454" radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="successful" name="Successful" fill="#4f8a68" radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <section className="rounded-xl bg-surface-raised shadow-panel ring-1 ring-surface-border/80">
          <div className="border-b border-surface-border/60 px-4 py-3.5">
            <h2 className="text-[13px] font-semibold text-text-primary">Recent alerts</h2>
            <p className="mt-0.5 text-[11px] text-text-muted">Latest detections requiring visibility</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Title</th>
                  <th className="px-4 py-2.5 font-medium">Severity</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {summary.recent_alerts.length ? (
                  summary.recent_alerts.map((alert) => (
                    <tr key={alert.id} className="border-t border-surface-border/50">
                      <td className="max-w-xs px-4 py-3 text-[13px] text-text-primary">{alert.title}</td>
                      <td className="px-4 py-3">
                        <SeverityBadge value={alert.severity} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge value={alert.status} />
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">{formatDate(alert.last_seen)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[13px] text-text-muted">
                      No recent alerts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "#0d1914",
  border: "1px solid #1d3328",
  borderRadius: 10,
  color: "#f3f6f2",
  fontSize: 12,
};

function ChartPanel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
      <div className="mb-3">
        <h2 className="text-[13px] font-semibold text-text-primary">{title}</h2>
        {description ? <p className="mt-0.5 text-[11px] text-text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function HorizontalBars({ data }: { data: SeriesPoint[] }) {
  if (!data.length) return <div className="flex h-[240px] items-center justify-center text-[13px] text-text-muted">No data</div>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12, top: 0, bottom: 0 }}>
        <CartesianGrid stroke="#1d3328" horizontal={false} />
        <XAxis type="number" stroke="#6f8679" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
        <YAxis dataKey="label" type="category" width={92} stroke="#9fb3a7" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#12211a" }} />
        <Bar dataKey="value" fill="#4f8a68" radius={[0, 3, 3, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Donut({ data }: { data: SeriesPoint[] }) {
  if (!data.length) return <div className="flex h-[280px] items-center justify-center text-[13px] text-text-muted">No data</div>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="transparent">
          {data.map((entry, index) => (
            <Cell key={index} fill={severityPalette[entry.label?.toLowerCase()] ?? palette[index % palette.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#9fb3a7" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
