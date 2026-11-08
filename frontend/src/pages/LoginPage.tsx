import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../components/AuthProvider";
import { useToast } from "../components/Toast";

export function LoginPage() {
  const { login, token } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("AdminPass123!");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      notify("Invalid username or password", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4">
      <div className="w-full max-w-[420px]">
        <form onSubmit={onSubmit} className="rounded-2xl bg-surface-raised p-6 shadow-panel ring-1 ring-surface-border/70 sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-500/16 text-forest-200 ring-1 ring-forest-400/20">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-text-primary">Mini SIEM</h1>
              <p className="text-[13px] text-text-secondary">Sign in to the operations console</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-[13px] font-medium text-text-secondary">Username</span>
              <input
                className="focus-ring w-full rounded-lg bg-surface-inset px-3 py-2.5 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-[13px] font-medium text-text-secondary">Password</span>
              <input
                className="focus-ring w-full rounded-lg bg-surface-inset px-3 py-2.5 text-sm text-text-primary ring-1 ring-surface-border placeholder:text-text-muted"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
          </div>

          <button
            className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-500 disabled:opacity-60"
            disabled={loading}
          >
            <LockKeyhole className="h-4 w-4" strokeWidth={1.75} />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-text-muted">Access is controlled by role-based permissions.</p>
      </div>
    </div>
  );
}

