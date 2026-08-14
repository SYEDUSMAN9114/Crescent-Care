import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutGrid,
  FileStack,
  Stethoscope,
  Building2,
  Receipt,
  Settings,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/", label: "Claims", icon: FileStack },
  { to: "/", label: "Providers", icon: Stethoscope },
  { to: "/", label: "Policies", icon: Building2 },
  { to: "/", label: "Payments", icon: Receipt },
];

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col items-center gap-1 bg-ink py-5 lg:flex">
        <Link
          to="/"
          className="mb-6 grid size-11 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground"
        >
          iG
        </Link>
        {nav.map((item, i) => {
          const active = i === (path === "/" ? 1 : 1);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`group relative grid size-11 place-items-center rounded-xl transition-colors ${
                active
                  ? "bg-ink-foreground/10 text-ink-foreground"
                  : "text-ink-muted hover:bg-ink-foreground/5 hover:text-ink-foreground"
              }`}
            >
              <item.icon className="size-[18px]" strokeWidth={1.75} />
              <span className="pointer-events-none absolute left-14 z-40 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-ink-foreground opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
        <div className="mt-auto grid size-11 place-items-center rounded-xl text-ink-muted hover:text-ink-foreground">
          <Settings className="size-[18px]" strokeWidth={1.75} />
        </div>
      </aside>

      <div className="lg:pl-[76px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-4 px-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="font-display tracking-tight">Premier Insurance</span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                Health
              </span>
            </div>
            <div className="ml-2 hidden items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs text-muted-foreground md:flex">
              <Search className="size-3.5" />
              Search claim, policy, member
              <kbd className="ml-6 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px]">
                ⌘K
              </kbd>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                Year 2026 <ChevronDown className="size-3.5" />
              </button>
              <button className="relative grid size-8 place-items-center rounded-lg hover:bg-muted">
                <Bell className="size-4" strokeWidth={1.75} />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
              </button>
              <div className="flex items-center gap-2 border-l border-border pl-3">
                <div className="grid size-8 place-items-center rounded-full bg-ink text-[11px] font-semibold text-ink-foreground">
                  FK
                </div>
                <div className="hidden leading-tight sm:block">
                  <div className="text-xs font-semibold">Faizan Khan</div>
                  <div className="text-[11px] text-muted-foreground">Claims Officer</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 pb-16 pt-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
