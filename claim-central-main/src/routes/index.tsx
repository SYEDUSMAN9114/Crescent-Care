import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  FilePlus2,
  Gauge,
  FileQuestion,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { claims, money, type Claim } from "@/lib/claims-data";

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

const parseClaimDate = (claim: Claim) => {
  const [day, month, year] = claim.intimationDate.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const getClaimYear = (claim: Claim) => {
  const [day, month, year] = claim.intimationDate.split("/").map(Number);
  return new Date(year, month - 1, day).getFullYear();
};

function DashboardPage() {
  const years = useMemo(
    () => Array.from(new Set(claims.map(getClaimYear))).sort((a, b) => b - a),
    [],
  );
  const [year, setYear] = useState(years[0] ?? 2026);
  const visibleClaims = useMemo(
    () => claims.filter((claim) => getClaimYear(claim) === year),
    [year],
  );
  const totals = useMemo(
    () => ({
      intimations: visibleClaims.length,
      awaitingApproval: visibleClaims.filter(
        (claim) => claim.status === "Revised",
      ).length,
      requirementNeeded: visibleClaims.filter(
        (claim) => claim.status === "Requirement Needed",
      ).length,
      awaitingSettlement: visibleClaims.filter(
        (claim) => claim.status !== "Posted",
      ).length,
      settled: visibleClaims.filter((claim) => claim.status === "Full & Final")
        .length,
      posted: visibleClaims.filter((claim) => claim.status === "Posted").length,
    }),
    [visibleClaims],
  );

  const performance = useMemo(
    () => [
      { period: "Today", resolved: Math.min(totals.settled, 9), target: 12 },
      {
        period: "This week",
        resolved: totals.settled + totals.posted,
        target: 55,
      },
      { period: "This month", resolved: totals.intimations, target: 210 },
    ],
    [totals],
  );

  const metricCards = [
    {
      label: "Intimations in view",
      value: totals.intimations.toString(),
      hint: "Active records in the current queue",
      icon: ClipboardList,
    },
    {
      label: "Awaiting approval",
      value: totals.awaitingApproval.toString(),
      hint: "Revised claims waiting for approval",
      icon: BadgeCheck,
    },
    {
      label: "Requirement Needed",
      value: totals.requirementNeeded.toString(),
      hint: "Claims pending required documents",
      icon: FileQuestion,
    },
    {
      label: "Awaiting settlement",
      value: totals.awaitingSettlement.toString(),
      hint: "Claims that still need officer action",
      icon: Gauge,
    },
  ];

  const resolutionData = [
    {
      name: "Full & Final",
      value: totals.settled,
      color: "var(--color-primary)",
    },
    { name: "Posted", value: totals.posted, color: "var(--color-warning)" },
    {
      name: "In progress",
      value: totals.awaitingSettlement,
      color: "var(--color-info)",
    },
  ];

  const recentClaims = [...visibleClaims].sort(
    (a, b) => parseClaimDate(b) - parseClaimDate(a),
  );

  return (
    <AppShell
      title="Dashboard"
      subtitle={`Claims overview for year ${year}`}
      yearControl={
        <label className="relative flex items-center">
          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="h-8 appearance-none rounded-lg bg-transparent py-1.5 pl-2 pr-7 text-xs font-medium text-muted-foreground outline-none hover:bg-muted focus:bg-muted"
            aria-label="Claim year"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                Year {item}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-muted-foreground" />
        </label>
      }
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/claims/list"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-card hover:bg-muted"
          >
            <ClipboardList className="size-4" strokeWidth={1.75} /> Claim List
          </Link>
          <Link
            to="/claims/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px"
          >
            <FilePlus2 className="size-4" strokeWidth={2} /> New Claim
          </Link>
        </div>
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
                  <div className="num mt-2 text-2xl font-semibold">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {metric.hint}
                  </div>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <metric.icon className="size-5" strokeWidth={1.75} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-4 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Resolution summary</h2>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resolutionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {resolutionData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} claims`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {resolutionData.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border bg-surface-2 p-2.5"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </div>
                  <div className="num mt-1 text-base font-semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-4 shadow-card">
            <div className="mb-2">
              <h2 className="text-base font-semibold">
                User performance matrix
              </h2>
              <p className="text-xs text-muted-foreground">
                Resolution output compared with daily, weekly and monthly
                targets.
              </p>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performance}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} claims`,
                      name === "resolved" ? "Resolved" : "Target",
                    ]}
                  />
                  <Bar
                    dataKey="target"
                    fill="var(--color-muted)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="resolved"
                    fill="var(--color-primary)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-semibold">Recent claims</h2>
            <p className="text-xs text-muted-foreground">
              All recent intimations sorted by intimation date.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left">
                  {[
                    "Intimation",
                    "Claimant",
                    "Cause of loss",
                    "Date",
                    "Status",
                    "Payable",
                    "Deductible",
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
                {recentClaims.map((claim) => (
                  <tr
                    key={`${claim.intimationNo}-${claim.entryNo}`}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="num font-semibold">
                        {claim.intimationNo}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Entry {claim.entryNo}
                      </div>
                    </td>
                    <td className="max-w-[320px] px-4 py-3">
                      <div className="truncate font-medium">
                        {claim.claimant}
                      </div>
                      <div className="num truncate text-[11px] text-muted-foreground">
                        {claim.policyNo}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {claim.causeOfLoss}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3">
                      {claim.intimationDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className="shrink-0 rounded-full border border-info/20 bg-info/10 px-2.5 py-1 text-[11px] font-semibold text-info">
                        {claim.status}
                      </span>
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-right font-semibold">
                      PKR {money(claim.lossPayable)}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-right text-muted-foreground">
                      PKR {money(claim.lossDeductable)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
