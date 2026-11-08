import {
  Activity,
  Bell,
  Database,
  FileUp,
  LayoutDashboard,
  LogOut,
  Menu,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  adminOnly?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Monitoring",
    items: [
      { to: "/events", label: "Events", icon: Activity },
      { to: "/upload", label: "Upload Logs", icon: FileUp },
    ],
  },
  {
    label: "Detection",
    items: [
      { to: "/alerts", label: "Alerts", icon: Bell },
      { to: "/rules", label: "Detection Rules", icon: SlidersHorizontal },
      { to: "/threat-intel", label: "Threat Intel", icon: Radar },
    ],
  },
  {
    label: "Administration",
    items: [{ to: "/admin", label: "Admin", icon: Users, adminOnly: true }],
  },
];

const flatNav = navGroups.flatMap((g) => g.items);

export function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = flatNav.find((item) => item.to === location.pathname)?.label ?? "Mini SIEM";

  const sidebar = (
    <aside className="flex h-full w-[17rem] flex-col border-r border-surface-border/70 bg-[#09140f]">
      <Link to="/" className="focus-ring mx-4 mt-5 flex items-center gap-3 rounded-xl px-2 py-2" onClick={() => setOpen(false)}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-500/18 text-forest-200 ring-1 ring-forest-400/20">
          <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold tracking-tight text-text-primary">Mini SIEM</div>
          <div className="text-[11px] text-text-muted">Security operations</div>
        </div>
      </Link>

      <nav className="mt-6 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => {
          const items = group.items.filter((item) => !item.adminOnly || user?.role === "admin");
          if (!items.length) return null;
          return (
            <div key={group.label}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">{group.label}</div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${
                          isActive
                            ? "bg-forest-500/16 text-text-primary ring-1 ring-forest-400/15"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-surface-border/60 p-3">
        <div className="mb-2 rounded-lg bg-surface-raised/70 px-3 py-2.5 ring-1 ring-surface-border/50">
          <div className="truncate text-[13px] font-medium text-text-primary">{user?.username}</div>
          <div className="text-[11px] capitalize text-text-muted">{user?.role}</div>
        </div>
        <button
          className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-surface-base text-text-primary">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">{sidebar}</div>
      {open ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-fit" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
          <button className="focus-ring absolute right-4 top-4 rounded-lg bg-surface-raised p-2 text-text-primary ring-1 ring-surface-border" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <main className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-surface-border/60 bg-surface-base/92 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button className="focus-ring rounded-lg p-2 text-text-secondary hover:bg-surface-hover lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-text-primary">{title}</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-lg bg-surface-raised/60 px-2.5 py-1.5 text-[11px] text-text-secondary ring-1 ring-surface-border/50 sm:flex">
            <Database className="h-3.5 w-3.5 text-forest-300" strokeWidth={1.75} />
            <span>Connected</span>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

