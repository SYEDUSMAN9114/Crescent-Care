import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Save,
  Paperclip,
  Search,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DocumentsPanel, type DocMode } from "@/components/DocumentsPanel";
import { money } from "@/lib/claims-data";

export const Route = createFileRoute("/claims/new")({
  head: () => ({
    meta: [
      { title: "New Claim Intimation — Premier Health Claims Desk" },
      {
        name: "description",
        content:
          "Register a health claim intimation: member and policy lookup, cover limits, hospital details and line-by-line payment breakdown.",
      },
      { property: "og:title", content: "New Claim Intimation — Premier Health Claims Desk" },
      {
        property: "og:description",
        content:
          "Register a health claim intimation with live cover limits and a payment breakdown.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewClaim,
});

function Field({
  label,
  value,
  required,
  readOnly,
  wide,
  hint,
}: {
  label: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  wide?: boolean;
  hint?: string;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="label-cap flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      <input
        defaultValue={value}
        readOnly={readOnly}
        disabled={readOnly}
        className="field-underline mt-0.5 w-full text-sm font-medium"
      />
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Section({
  step,
  title,
  desc,
  children,
  right,
}: {
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section
      id={`s-${step}`}
      className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-card"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="flex gap-3">
          <span className="num grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-[11px] font-semibold text-ink-foreground">
            {step}
          </span>
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

const lines = [
  {
    no: 1,
    date: "02/01/2026",
    main: "CPT",
    service: "CPT",
    procedure: "#4649 — Miscellaneous",
    rate: 999999999,
    bill: 80000,
    payable: 80000,
    excess: 0,
    withheld: 0,
    deductible: 0,
  },
];

function NewClaim() {
  const [tab, setTab] = useState<"payment" | "recovery" | "coinsurer">("payment");
  const [docMode, setDocMode] = useState<DocMode>("closed");
  const totals = useMemo(
    () => ({
      bill: lines.reduce((s, l) => s + l.bill, 0),
      payable: lines.reduce((s, l) => s + l.payable, 0),
    }),
    [],
  );

  return (
    <AppShell
      title="New Claim Intimation"
      subtitle="Claim no. 00001 · Entry 1 · Registered 02/01/2026 · Claim day 3"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-card hover:bg-muted"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} /> Back
          </Link>
          <button
            onClick={() => setDocMode((m) => (m === "closed" ? "split" : "closed"))}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-card transition-colors ${
              docMode !== "closed"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-surface hover:bg-muted"
            }`}
          >
            <Paperclip className="size-4" strokeWidth={1.75} /> Documents
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px">
            <Save className="size-4" strokeWidth={2} /> Save claim
          </button>
        </div>
      }
    >
      <div
        className={`grid gap-5 ${docMode === "split" ? "xl:grid-cols-[1fr_460px]" : "grid-cols-1"}`}
      >
        <div className="min-w-0 space-y-5">
          <Section
            step="1"
            title="Claim header"
            desc="Who is claiming, when it was intimated and under which authorization."
            right={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Clock className="size-3" /> Pre-Authorization
              </span>
            }
          >
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Claim No." value="00001" readOnly />
              <Field label="Entry No." value="1" readOnly />
              <Field label="Intimation date" value="02/01/2026 00:00" required />
              <Field label="Admit / visit date" value="01/01/2026" required />
              <Field label="Claim receive date" value="01/01/2026" required />
              <Field
                label="Client name"
                value="Expert Hazard and Waste Management"
                required
                wide
                hint="Press F8 to search clients"
              />
              <Field label="Cause of loss" value="Maternity C-Section" readOnly />
              <Field label="Diagnose" value="LSCS" hint="ICD code linked" />
              <Field label="Discharge date" value="03/01/2026" />
              <Field label="MR / Bill no." />
              <Field label="Old claim no." />
              <Field label="Leader claim no." />
              <Field label="Bunch file no." />
            </div>
          </Section>

          <Section
            step="2"
            title="Member & cover"
            desc="Policy, patient and the limits that govern this claim."
            right={
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold hover:bg-muted">
                <Search className="size-3" /> Search previous claim
              </button>
            }
          >
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Policy no." value="PIHGCDP00011/25" readOnly />
              <Field label="Card holder" value="000046 — Ajmal kausar" required />
              <Field label="Patient" value="Atifa ajmal" required />
              <Field label="Plan" value="Plan A" readOnly />
              <Field label="Date of birth" value="23/12/1989" readOnly />
              <Field label="Age / gender" value="36 · Female" readOnly />
              <Field label="Relation" value="Spouse" readOnly />
              <Field label="Healthcare no." value="GC25-EHWM-1100-0046" readOnly />
              <Field label="Cover / benefit" value="Caesarean Section" required />
              <Field label="Cover type" value="Per Person" readOnly />
              <Field label="Effective / expiry" value="01/12/2025" readOnly />
              <Field label="Reim. tag" value="No" required />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { l: "Panel limit", v: "80,000", u: 0 },
                { l: "Non-panel limit", v: "80,000", u: 0 },
                { l: "Cover sub limit", v: "80,000", u: 0 },
                { l: "Limit utilized", v: "0", u: 100 },
              ].map((x) => (
                <div key={x.l} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="label-cap">{x.l}</div>
                  <div className="num mt-1 text-lg font-semibold">{x.v}</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${100 - x.u}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            step="3"
            title="Hospital & room limits"
            desc="Provider, network status and room entitlement for this admission."
          >
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Hospital" value="Al-Hamd Medical Centre (KHI)" required wide />
              <Field label="Claim type" value="Panel" readOnly />
              <Field label="Room entitlement" value="Standard private" />
              <Field label="Room limit" value="10,000" />
              <Field label="Outside network co-pay %" />
              <Field label="Pre natal max." value="270" />
              <Field label="Post natal max." value="30" />
              <Field label="Deductible %" value="0" />
              <Field label="Deductible amount" value="0" />
              <Field label="Ex-gratia claim" value="No" />
              <Field label="Days admitted" value="2" />
              <Field label="Special favour" value="0" />
            </div>
          </Section>

          <Section
            step="4"
            title="Payment detail"
            desc="Line items, network rates and what the insurer actually pays."
            right={
              <div className="flex rounded-lg border border-border p-0.5 text-[11px] font-medium">
                {(["payment", "recovery", "coinsurer"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                      tab === t ? "bg-ink text-ink-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          >
            {tab === "payment" ? (
              <>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-2 text-left">
                        {[
                          "#",
                          "Bill date",
                          "Category",
                          "Procedure",
                          "Network rate",
                          "Bill amt",
                          "Payable",
                          "Excess",
                          "Withheld",
                          "Deductible",
                          "",
                        ].map((h) => (
                          <th key={h} className="label-cap whitespace-nowrap px-3 py-2.5">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l) => (
                        <tr key={l.no} className="border-b border-border/70">
                          <td className="num px-3 py-3">{l.no}</td>
                          <td className="num whitespace-nowrap px-3 py-3">{l.date}</td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {l.main} / {l.service}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">{l.procedure}</td>
                          <td className="num px-3 py-3 text-right text-muted-foreground">
                            {money(l.rate)}
                          </td>
                          <td className="num px-3 py-3 text-right">{money(l.bill)}</td>
                          <td className="num px-3 py-3 text-right font-semibold text-primary">
                            {money(l.payable)}
                          </td>
                          <td className="num px-3 py-3 text-right text-muted-foreground">0</td>
                          <td className="num px-3 py-3 text-right text-muted-foreground">0</td>
                          <td className="num px-3 py-3 text-right text-muted-foreground">0</td>
                          <td className="px-3 py-3 text-right">
                            <button className="grid size-7 place-items-center rounded-lg border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive">
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-surface-2 font-semibold">
                        <td className="px-3 py-3" colSpan={5}>
                          Total
                        </td>
                        <td className="num px-3 py-3 text-right">{money(totals.bill)}</td>
                        <td className="num px-3 py-3 text-right text-primary">
                          {money(totals.payable)}
                        </td>
                        <td className="num px-3 py-3 text-right">0</td>
                        <td className="num px-3 py-3 text-right">0</td>
                        <td className="num px-3 py-3 text-right">0</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary">
                  <Plus className="size-3.5" /> Add line item
                </button>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
                No {tab} entries recorded for this claim yet.
              </div>
            )}
          </Section>
        </div>

        {docMode === "split" ? (
          <aside className="xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
            <DocumentsPanel mode={docMode} onModeChange={setDocMode} />
          </aside>
        ) : null}
      </div>

      {docMode !== "split" ? (
        <DocumentsPanel mode={docMode} onModeChange={setDocMode} />
      ) : null}

    </AppShell>
  );
}
