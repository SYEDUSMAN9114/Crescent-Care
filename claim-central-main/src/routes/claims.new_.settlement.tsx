import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/claims/new_/settlement")({
  component: ClaimSettlement,
});

function Field({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="label-cap">{label}</span>
      <input defaultValue={value} className="field-underline mt-0.5 w-full text-sm font-medium" />
    </label>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: any }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

export default function ClaimSettlement() {
  const [rows, setRows] = useState<
    { id: string; paymentType: string; payeeType: string; payeeName: string; amount: number; nature: string; remarks: string }[]
  >([
    { id: "r-1", paymentType: "Loss", payeeType: "Hospital", payeeName: "Dr. Zauddin Hospital", amount: 0, nature: "", remarks: "" },
  ]);

  function addRow() {
    setRows((s) => [...s, { id: `r-${Date.now()}`, paymentType: "Loss", payeeType: "Hospital", payeeName: "", amount: 0, nature: "", remarks: "" }]);
  }

  function updateRow(id: string, patch: Partial<typeof rows[number]>) {
    setRows((s) => s.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setRows((s) => s.filter((r) => r.id !== id));
  }

  return (
    <AppShell title="Claim Settlement" subtitle="Claim settlement entry" actions={
      <div className="flex items-center gap-2">
        <Link to="/claims/new" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-card hover:bg-muted">
          <ArrowLeft className="size-4" strokeWidth={1.75} /> Back
        </Link>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px">
          <Save className="size-4" strokeWidth={2} /> Save settlement
        </button>
      </div>
    }>
      <div className="space-y-5">
        <Section title="Claim Settlement">
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Claim Ref No" value="SHGCI00470/26" />
            <Field label="Settlement Date" value="13-08-2026" />
            <Field label="Client Name" value="Sindh Microfinance Bank Ltd" wide />
            <Field label="Account #" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-border bg-surface-2 p-3">Total Loss: <span className="font-semibold">11,970</span></div>
          </div>
        </Section>

        <Section title="Payments Breakup" desc="Add payment lines for this settlement">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left">
                  {[
                    "S.No.",
                    "Payment Type",
                    "Payee Type",
                    "Payee Name",
                    "Amount",
                    "Nature",
                    "Remarks",
                    "",
                  ].map((h) => (
                    <th key={h} className="label-cap whitespace-nowrap px-3 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="border-b border-border/70">
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3">
                      <select value={r.paymentType} onChange={(e) => updateRow(r.id, { paymentType: e.target.value })} className="field-underline">
                        <option>Loss</option>
                        <option>Recoverable</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select value={r.payeeType} onChange={(e) => updateRow(r.id, { payeeType: e.target.value })} className="field-underline">
                        <option>Hospital</option>
                        <option>Patient</option>
                        <option>Bank</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input value={r.payeeName} onChange={(e) => updateRow(r.id, { payeeName: e.target.value })} className="field-underline" />
                    </td>
                    <td className="px-3 py-3">
                      <input type="number" value={r.amount} onChange={(e) => updateRow(r.id, { amount: Number(e.target.value) })} className="field-underline" />
                    </td>
                    <td className="px-3 py-3">
                      <input value={r.nature} onChange={(e) => updateRow(r.id, { nature: e.target.value })} className="field-underline" />
                    </td>
                    <td className="px-3 py-3">
                      <input value={r.remarks} onChange={(e) => updateRow(r.id, { remarks: e.target.value })} className="field-underline" />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => removeRow(r.id)} className="text-destructive">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={addRow} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary">
              Add row
            </button>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}