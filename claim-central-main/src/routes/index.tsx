import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowRight,
  ClipboardList,
  FilePlus2,
  FileText,
  Gauge,
  Scale,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { claims, money } from "@/lib/claims-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claims Dashboard - Crescent Care" },
      {
        name: "description",
        content:
          "Claims dashboard with operational metrics, shortcuts and user performance tracking.",
      },
    ],
  }),
  component: DashboardPage,
});

const shortcuts = [
  {
    label: "Claim List",
    desc: "Open the full intimation work queue.",
    to: "/claims/list",
    icon: ClipboardList,
  },
  {
    label: "New Claim",
    desc: "Register a fresh claim intimation.",
    to: "/claims/new",
    icon: FilePlus2,
  },
  {
    label: "Settlement",
    desc: "Prepare payment and settlement lines.",
    to: "/claims/new/settlement",
    icon: FileText,
  },
];

function DashboardPage() {
  const totals = useMemo(
    () => ({
      intimations: claims.length,
      payable: claims.reduce((sum, claim) => sum + claim.lossPayable, 0),
      deductibles: claims.reduce((sum, claim) => sum + claim.lossDeductable, 0),
      awaitingSettlement: claims.filter((claim) => claim.status !== "Posted").length,
      settled: claims.filter((claim) => claim.status === "Full & Final").length,
      posted: claims.filter((claim) => claim.status === "Posted").length,
    }),
    [],
  );

  const performance = [
    { period: "Today", resolved: 9, target: 12, quality: "96%", avgTime: "18m" },
    { period: "This week", resolved: 42, target: 55, quality: "94%", avgTime: "22m" },
    { period: "This month", resolved: 168, target: 210, quality: "95%", avgTime: "24m" },
  ];

  const metricCards = [
    {
      label: "Intimations in view",
      value: totals.intimations.toString(),
      hint: "Active records in the current queue",
      icon: ClipboardList,
    },
    {
      label: "Loss payable",
      value: money(totals.payable),
      hint: "PKR across visible intimations",
      icon: WalletCards,
    },
    {
      label: "Deductibles",
      value: money(totals.deductibles),
      hint: "PKR to adjust before settlement",
      icon: Scale,
    },
    {
      label: "Awaiting settlement",
      value: totals.awaitingSettlement.toString(),
      hint: "Claims that still need officer action",
      icon: Gauge,
    },
  ];

  const priorityClaims = claims
    .filter((claim) => claim.status !== "Posted")
    .slice(0, 5);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Claims overview for login year 2026"
      actions={
        <Link
          to="/claims/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px"
        >
          <FilePlus2 className="size-4" strokeWidth={2} /> New Claim
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-card"
            >
              <div className="grid-paper pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="label-cap">{metric.label}</div>
                  <div className="num mt-2 text-2xl font-semibold">{metric.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{metric.hint}</div>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <metric.icon className="size-5" strokeWidth={1.75} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Claim shortcuts</h2>
                <p className="text-xs text-muted-foreground">Fast access to daily claim work.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.label}
                  to={shortcut.to}
                  className="group rounded-xl border border-border bg-surface-2 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-ink text-ink-foreground">
                      <shortcut.icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="font-semibold">{shortcut.label}</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{shortcut.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Resolution summary</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Full & Final", value: totals.settled, tone: "bg-primary" },
                { label: "Posted", value: totals.posted, tone: "bg-warning" },
                { label: "In progress", value: totals.awaitingSettlement, tone: "bg-info" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{item.label}</span>
                    <span className="num text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${item.tone}`}
                      style={{ width: `${Math.max(12, (item.value / claims.length) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="border-b border-border p-5">
              <h2 className="text-base font-semibold">User performance matrix</h2>
              <p className="text-xs text-muted-foreground">
                Resolution output compared with daily, weekly and monthly targets.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-left">
                    {["Period", "Resolved", "Target", "Progress", "Quality", "Avg. time"].map((h) => (
                      <th key={h} className="label-cap px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {performance.map((row) => {
                    const progress = Math.round((row.resolved / row.target) * 100);
                    return (
                      <tr key={row.period} className="border-b border-border/70 last:border-0">
                        <td className="px-4 py-3 font-medium">{row.period}</td>
                        <td className="num px-4 py-3">{row.resolved}</td>
                        <td className="num px-4 py-3 text-muted-foreground">{row.target}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-28 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="num text-xs font-semibold">{progress}%</span>
                          </div>
                        </td>
                        <td className="num px-4 py-3">{row.quality}</td>
                        <td className="num px-4 py-3 text-muted-foreground">{row.avgTime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h2 className="text-base font-semibold">Priority work queue</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Open intimations that should be reviewed before settlement.
            </p>
            <div className="space-y-3">
              {priorityClaims.map((claim) => (
                <div key={`${claim.intimationNo}-${claim.entryNo}`} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="num truncate text-sm font-semibold">{claim.intimationNo}</div>
                      <div className="truncate text-xs text-muted-foreground">{claim.claimant}</div>
                    </div>
                    <span className="shrink-0 rounded-full border border-info/20 bg-info/10 px-2.5 py-1 text-[11px] font-semibold text-info">
                      {claim.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{claim.causeOfLoss}</span>
                    <span className="num font-semibold">PKR {money(claim.lossPayable)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
