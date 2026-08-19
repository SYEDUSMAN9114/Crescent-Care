import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import logo from "@/assets/crescent-logo.png";

type NavLeaf = {
  label: string;
  icon: typeof LayoutGrid;
  match: (p: string) => boolean;
  to: string;
  children?: undefined;
};

type NavParent = {
  label: string;
  icon: typeof LayoutGrid;
  match: (p: string) => boolean;
  to?: undefined;
  children: { to: string; label: string }[];
};

type NavItem = NavLeaf | NavParent;

const nav: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutGrid, match: (p) => p === "/" },
  {
    label: "Claims",
    icon: FileStack,
    match: (p) => p.startsWith("/claims"),
    children: [
      { to: "/claims/list", label: "Claim List" },
      { to: "/claims/new", label: "New Claim" },
      { to: "/claims/new/settlement", label: "Settlement" },
    ],
  },
  { to: "/", label: "Providers", icon: Stethoscope, match: () => false },
  { to: "/", label: "Policies", icon: Building2, match: () => false },
  { to: "/", label: "Payments", icon: Receipt, match: () => false },
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
  const [expanded, setExpanded] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Keep the dropdown open whenever we're on a route that belongs to it
  // (e.g. /claims/new), and closed otherwise — instead of always closing
  // it on every navigation.
  useEffect(() => {
    const match = nav.find((item) => item.children && item.match(path));
    setOpenMenu(match ? match.label : null);
  }, [path]);

  return (
    <div className="min-h-screen bg-background">
      <header className="relative sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-5">
          <Link
            to="/"
            className="relative z-10 grid size-10 shrink-0 place-items-center rounded-xl bg-ink-foreground/10"
          >
            <img src={logo} alt="Crescent Care" className="block size-7 object-contain" />
          </Link>
          <span className="truncate font-display text-[20px] font-bold text-ink">Crescent Care</span>
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

      <aside
        className={`fixed inset-y-0 left-0 top-14 z-30 hidden flex-col bg-ink py-4 transition-[width] duration-200 lg:flex ${
          expanded ? "w-[232px] px-3" : "w-[76px] items-center px-2"
        }`}
      >
        <div className={`mb-6 flex items-center gap-2.5 ${expanded ? "px-1" : "flex-col"}`}>
          <button
            onClick={() => setExpanded((e) => !e)}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className={`grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-ink-foreground/10 hover:text-ink-foreground ${
              expanded ? "ml-auto" : "mt-1"
            }`}
          >
            {expanded ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = item.match(path);

            if (item.children) {
              const open = openMenu === item.label;
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl transition-colors ${
                      expanded ? "px-3 py-2.5" : "size-11 justify-center"
                    } ${
                      active
                        ? "bg-ink-foreground/10 text-ink-foreground"
                        : "text-ink-muted hover:bg-ink-foreground/5 hover:text-ink-foreground"
                    }`}
                  >
                    <item.icon className="size-[18px] shrink-0" strokeWidth={1.75} />
                    {expanded ? (
                      <>
                        <span className="truncate text-sm font-medium">{item.label}</span>
                        <ChevronDown
                          className={`ml-auto size-3.5 shrink-0 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    ) : (
                      <span className="pointer-events-none absolute left-14 z-40 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-ink-foreground opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
                        {item.label}
                      </span>
                    )}
                  </button>
                  {open && expanded && (
                    <div className="ml-8 mt-1 flex flex-col gap-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                            path === child.to
                              ? "bg-ink-foreground/10 text-ink-foreground"
                              : "text-ink-muted hover:bg-ink-foreground/5 hover:text-ink-foreground"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`group relative flex items-center gap-3 rounded-xl transition-colors ${
                  expanded ? "px-3 py-2.5" : "size-11 justify-center"
                } ${
                  active
                    ? "bg-ink-foreground/10 text-ink-foreground"
                    : "text-ink-muted hover:bg-ink-foreground/5 hover:text-ink-foreground"
                }`}
              >
                <item.icon className="size-[18px] shrink-0" strokeWidth={1.75} />
                {expanded ? (
                  <span className="truncate text-sm font-medium">{item.label}</span>
                ) : (
                  <span className="pointer-events-none absolute left-14 z-40 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-ink-foreground opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={`flex items-center gap-3 rounded-xl text-ink-muted hover:text-ink-foreground ${
            expanded ? "px-3 py-2.5" : "size-11 justify-center"
          }`}
        >
          <Settings className="size-[18px] shrink-0" strokeWidth={1.75} />
          {expanded && <span className="text-sm font-medium">Settings</span>}
        </div>
      </aside>

      <div className={`pt-5 transition-[padding] duration-200 ${expanded ? "lg:pl-[232px]" : "lg:pl-[76px]"}`}>
        <div className="px-5 pb-16">
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
