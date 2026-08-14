import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Filter,
  Eye,
  RotateCcw,
  FileText,
  Printer,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { claims, money, type Claim } from "@/lib/claims-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claim Intimations — Premier Health Claims Desk" },
      {
        name: "description",
        content:
          "Review, revise and settle health claim intimations from a single workspace: statuses, payable amounts, deductibles and revisions at a glance.",
      },
      { property: "og:title", content: "Claim Intimations — Premier Health Claims Desk" },
      {
        property: "og:description",
        content:
          "Review, revise and settle health claim intimations from a single workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClaimsPage,
});

const statusStyles: Record<Claim["status"], string> = {
  Revised: "bg-info/10 text-info border-info/20",
  "Full & Final": "bg-primary/10 text-primary border-primary/20",
  Posted: "bg-warning/15 text-warning-foreground border-warning/30",
  Draft: "bg-muted text-muted-foreground border-border",
};

const filters = ["All", "Revised", "Full & Final", "Posted"] as const;

function ClaimsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      claims.filter(
        (c) =>
          (filter === "All" || c.status === filter) &&
          (query === "" ||
            `${c.intimationNo} ${c.claimant} ${c.policyNo} ${c.causeOfLoss}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [filter, query],
  );

  const totals = useMemo(
    () => ({
      payable: rows.reduce((s, c) => s + c.lossPayable, 0),
      deductable: rows.reduce((s, c) => s + c.lossDeductable, 0),
      open: rows.filter((c) => c.status !== "Posted").length,
    }),
    [rows],
  );

  return (
    <AppShell
      title="Claim Intimations"
      subtitle="Login year 2026 · 86 pages · updated a moment ago"
      actions={
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-card transition-colors hover:bg-muted">
            <Download className="size-4" strokeWidth={1.75} /> Export
          </button>
          <Link
            to="/claims/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px"
          >
            <Plus className="size-4" strokeWidth={2.25} /> New Claim
          </Link>
        </div>
      }
    >
      {/* Stat strip */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Intimations in view", value: rows.length.toString(), hint: "of 1,284 this year" },
          { label: "Loss payable", value: money(totals.payable), hint: "PKR, filtered" },
          { label: "Deductibles", value: money(totals.deductable), hint: "PKR, filtered" },
          { label: "Awaiting settlement", value: totals.open.toString(), hint: "needs officer action" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-card"
          >
            {i === 0 && (
              <div className="grid-paper pointer-events-none absolute inset-0 opacity-40" />
            )}
            <div className="relative">
              <div className="label-cap">{s.label}</div>
              <div className="num mt-2 text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-border bg-surface p-1 shadow-card">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-ink text-ink-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by claimant, policy or intimation no."
          className="h-9 min-w-[260px] flex-1 rounded-xl border border-border bg-surface px-3 text-sm shadow-card outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium shadow-card hover:bg-muted">
          <Filter className="size-3.5" /> More search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                {[
                  "Status",
                  "Intimation",
                  "Claimant",
                  "Cause of loss",
                  "Dates",
                  "Payable",
                  "Withheld",
                  "Deductible",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="label-cap whitespace-nowrap px-4 py-3 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const key = `${c.intimationNo}-${c.entryNo}`;
                const open = active === key;
                return (
                  <tr
                    key={key}
                    onClick={() => setActive(open ? null : key)}
                    className={`group cursor-pointer border-b border-border/70 transition-colors last:border-0 ${
                      open ? "bg-accent/40" : "hover:bg-muted/60"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="num text-[13px] font-semibold">{c.intimationNo}</div>
                      <div className="text-[11px] text-muted-foreground">
                        Entry {c.entryNo} · {c.policyNo}
                      </div>
                    </td>
                    <td className="max-w-[260px] px-4 py-3">
                      <div className="truncate font-medium">{c.claimant}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {c.causeOfLoss}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="num text-[12px]">{c.intimationDate}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {c.revisionDate ? `rev ${c.revisionDate}` : "no revision"}
                      </div>
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-right font-semibold">
                      {money(c.lossPayable)}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-right text-muted-foreground">
                      {money(c.lossWithheld)}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-right text-muted-foreground">
                      {money(c.lossDeductable)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {[
                          { icon: Eye, label: "View" },
                          { icon: RotateCcw, label: "Revise" },
                          { icon: FileText, label: "CMR" },
                          { icon: Printer, label: "Print" },
                        ].map((a) => (
                          <button
                            key={a.label}
                            title={a.label}
                            className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-primary"
                          >
                            <a.icon className="size-3.5" strokeWidth={1.75} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-sm text-muted-foreground">
                    No intimations match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2 px-4 py-3 text-xs text-muted-foreground">
          <span>
            Showing <span className="num font-semibold text-foreground">{rows.length}</span> of 1,284
            intimations
          </span>
          <div className="flex items-center gap-1">
            <button className="grid size-8 place-items-center rounded-lg border border-border bg-surface hover:bg-muted">
              <ChevronLeft className="size-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`num size-8 rounded-lg border text-xs ${
                  p === 1
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-surface hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1">…</span>
            <button className="num size-8 rounded-lg border border-border bg-surface text-xs hover:bg-muted">
              86
            </button>
            <button className="grid size-8 place-items-center rounded-lg border border-border bg-surface hover:bg-muted">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowUpRight className="size-3.5" />
        Click any row to focus it, then use the inline actions to view, revise, generate CMR or print.
      </div>
    </AppShell>
  );
}
