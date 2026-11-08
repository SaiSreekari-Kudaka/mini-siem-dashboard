import { FormEvent, useCallback, useEffect, useState } from "react";
import { DatabaseZap, Plus, RotateCcw, Trash2, Users } from "lucide-react";

import { EmptyState, LoadingState } from "../components/State";
import { useToast } from "../components/Toast";
import { clearDemo, createUser, fetchAdminStats, fetchUsers, seedDemo } from "../services/api";
import type { Page, Role, User } from "../types";

export function AdminPage() {
  const { notify } = useToast();
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [users, setUsers] = useState<Page<User> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [statsResult, usersResult] = await Promise.all([fetchAdminStats(), fetchUsers({ page_size: 50 })]);
    setStats(statsResult);
    setUsers(usersResult);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function seed() {
    await seedDemo();
    notify("Demo data seeded", "success");
    await load();
  }

  async function clear() {
    await clearDemo();
    notify("Demo data cleared", "success");
    await load();
  }

  if (loading) return <LoadingState label="Loading administration" />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">Administration</h2>
        <p className="mt-1 text-[13px] text-text-secondary">Manage users and system data available to administrators.</p>
      </div>

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
              <div className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{key.replace(/_/g, " ")}</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-xl bg-surface-raised shadow-panel ring-1 ring-surface-border/80">
          <div className="flex items-center gap-2 border-b border-surface-border/60 px-4 py-3.5">
            <Users className="h-4 w-4 text-forest-300" strokeWidth={1.75} />
            <h3 className="text-[13px] font-semibold text-text-primary">Users</h3>
          </div>
          {users?.items.length ? <UsersTable users={users.items} /> : <div className="p-4"><EmptyState title="No users found" /></div>}
        </section>

        <aside className="space-y-4">
          <UserForm onCreated={load} />
          <section className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
            <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-text-primary">
              <DatabaseZap className="h-4 w-4 text-forest-300" strokeWidth={1.75} />
              Demo data
            </h3>
            <div className="grid gap-2">
              <button className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-500" onClick={seed}>
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                Seed demo data
              </button>
              <button className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/15" onClick={clear}>
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                Clear demo data
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface-inset/60 text-[11px] uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">Username</th>
            <th className="px-4 py-2.5 font-medium">Email</th>
            <th className="px-4 py-2.5 font-medium">Role</th>
            <th className="px-4 py-2.5 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-surface-border/50">
              <td className="px-4 py-2.5 text-[13px] font-medium text-text-primary">{user.username}</td>
              <td className="px-4 py-2.5 text-[13px] text-text-secondary">{user.email}</td>
              <td className="px-4 py-2.5 text-[13px] capitalize text-text-secondary">{user.role}</td>
              <td className="px-4 py-2.5 text-[12px] text-text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const { notify } = useToast();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "viewer" as Role });
  const inputClass = "focus-ring w-full rounded-lg bg-surface-inset px-3 py-2 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted";

  async function submit(event: FormEvent) {
    event.preventDefault();
    await createUser(form);
    notify("User created", "success");
    setForm({ username: "", email: "", password: "", role: "viewer" });
    await onCreated();
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-surface-raised p-4 shadow-panel ring-1 ring-surface-border/80">
      <h3 className="mb-4 text-[13px] font-semibold text-text-primary">Create user</h3>
      <div className="space-y-3">
        <input required className={inputClass} placeholder="Username" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
        <input required className={inputClass} placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <input required className={inputClass} placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        <select className={inputClass} value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Role }))}>
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
        <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-500">
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Create user
        </button>
      </div>
    </form>
  );
}
