import { useEffect, useState } from "react";
import {
  Check,
  Download,
  FileCheck2,
  Loader2,
  Mail,
  Printer,
  Send,
  X,
} from "lucide-react";
import {
  fetchApprovedCaseForLetter,
  formatPkr,
  type ApprovalLetterCase,
} from "@/lib/approval-letter-data";

export function ApprovalLetterModal({ onClose }: { onClose: () => void }) {
  const [approval, setApproval] = useState<ApprovalLetterCase | null>(null);
  const [sendState, setSendState] = useState<
    "idle" | "confirm" | "sending" | "sent"
  >("idle");
  const [sentAt, setSentAt] = useState<string | null>(null);

  useEffect(() => {
    void fetchApprovedCaseForLetter().then(setApproval);
  }, []);

  if (!approval) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-background/70 p-5 backdrop-blur-sm">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-2xl">
          <Loader2 className="mx-auto size-6 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Preparing approval letter…
          </p>
        </div>
      </div>
    );
  }

  const revision = approval.previousApprovedAmount !== null;
  const print = () => window.print();
  const escapePdfText = (value: string) =>
    value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const downloadPdf = () => {
    const lines = [
      "Crescent Care",
      "Approval Letter",
      `Approval no: ${approval.approvalNo}`,
      `Issued: ${approval.issueDate}`,
      `Valid until: ${approval.validityDate}`,
      "",
      `To: ${approval.hospitalName}`,
      approval.hospitalAddress,
      `Attn: ${approval.doctorOrSupervisor}`,
      "",
      `Patient: ${approval.patientName}`,
      `Relationship: ${approval.relationship}`,
      `Employee: ${approval.employeeName} (${approval.employeeId})`,
      `Card number: ${approval.cardNumber}`,
      `Policy / plan: ${approval.policyNo} / ${approval.plan}`,
      "",
      `Diagnosis: ${approval.diagnosis}`,
      `Treatment / benefit: ${approval.treatment} - ${approval.benefit}`,
      `Approved limit: ${formatPkr(approval.approvedHospitalizationLimit)}`,
      `Room entitlement: ${approval.roomAndBoardEntitlement}`,
      `Approved stay: ${approval.approvedLengthOfStay} days from ${approval.admissionDate}`,
      "",
      "Conditions:",
      ...approval.approvalRemarks,
      ...approval.conditions,
      ...approval.exclusions,
      "",
      `Authorized approval: ${approval.approvingOfficer}`,
      approval.approvingDepartment,
    ];
    const content = lines
      .slice(0, 42)
      .map(
        (line, index) =>
          `BT /F1 10 Tf 50 ${780 - index * 16} Td (${escapePdfText(line)}) Tj ET`,
      )
      .join("\n");
    const objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
      "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${approval.approvalNo}-approval-letter.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const send = () => {
    setSendState("sending");
    window.setTimeout(() => {
      setSentAt(
        new Intl.DateTimeFormat("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
      );
      setSendState("sent");
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm print:static print:block print:bg-white print:p-0">
      <div className="flex h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl print:h-auto print:max-w-none print:border-0 print:shadow-none">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface p-3 print:hidden">
          <div>
            <div className="text-sm font-semibold">Approval letter preview</div>
            <div className="text-xs text-muted-foreground">
              {approval.approvalNo} · current approved revision
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              <X className="size-3.5" /> Close
            </button>
            <button
              onClick={print}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              <Printer className="size-3.5" /> Print
            </button>
            <button
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              <Download className="size-3.5" /> Download PDF
            </button>
            <button
              onClick={() => setSendState("confirm")}
              disabled={sendState === "sent"}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Send className="size-3.5" />{" "}
              {sendState === "sent" ? "Letter sent" : "Send Approval Letter"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-muted p-4 sm:p-7 print:overflow-visible print:bg-white print:p-0">
          <article className="mx-auto w-full max-w-[850px] bg-white p-7 text-[#292734] shadow-lift sm:p-10">
            <div className="flex items-start justify-between gap-6 border-b-2 border-[#33216d] pb-5">
              <div>
                <div className="font-display text-2xl font-bold text-[#33216d]">
                  Crescent Care
                </div>
                <div className="mt-1 text-xs text-[#625f70]">
                  Health Claims &amp; Medical Authorization
                </div>
              </div>
              <div className="text-right text-xs leading-5 text-[#625f70]">
                <div>
                  <span className="font-semibold text-[#292734]">
                    Approval no.
                  </span>{" "}
                  {approval.approvalNo}
                </div>
                <div>Issued: {approval.issueDate}</div>
                <div>Valid until: {approval.validityDate}</div>
              </div>
            </div>
            <div className="py-6 text-sm leading-6">
              <p className="font-semibold">To: {approval.hospitalName}</p>
              <p className="text-[#625f70]">{approval.hospitalAddress}</p>
              <p className="mt-4">Attn: {approval.doctorOrSupervisor}</p>
              <h1 className="mt-6 font-display text-xl font-bold text-[#33216d]">
                Approval Letter
              </h1>
              <p className="mt-3">
                We authorize treatment for the covered member below, subject to
                the policy terms, conditions and exclusions.
              </p>
            </div>
            <div className="grid overflow-hidden border border-[#d9d6e1] text-sm sm:grid-cols-2">
              {[
                ["Patient name", approval.patientName],
                ["Relationship", approval.relationship],
                ["Employee name", approval.employeeName],
                ["Employee ID", approval.employeeId],
                [
                  "Date of birth / age",
                  `${approval.dateOfBirth} / ${approval.age} years`,
                ],
                ["Card number", approval.cardNumber],
                ["Participant / company", approval.participantName],
                ["Policy / plan", `${approval.policyNo} · ${approval.plan}`],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`border-[#d9d6e1] p-3 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < 6 ? "border-b" : ""}`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#625f70]">
                    {label}
                  </div>
                  <div className="mt-1 font-medium">{value}</div>
                </div>
              ))}
            </div>
            <section className="mt-6">
              <h2 className="font-display text-base font-bold text-[#33216d]">
                Approved treatment
              </h2>
              <div className="mt-2 grid border border-[#d9d6e1] text-sm sm:grid-cols-2">
                <div className="border-b border-[#d9d6e1] p-3 sm:border-b-0 sm:border-r">
                  <span className="text-xs text-[#625f70]">Diagnosis</span>
                  <div className="mt-1 font-medium">{approval.diagnosis}</div>
                </div>
                <div className="p-3">
                  <span className="text-xs text-[#625f70]">
                    Treatment / benefit
                  </span>
                  <div className="mt-1 font-medium">
                    {approval.treatment} — {approval.benefit}
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-6 rounded-xl border border-[#cfc8e4] bg-[#f5f2ff] p-4">
              <h2 className="font-display text-base font-bold text-[#33216d]">
                Authorization details
              </h2>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <div className="text-xs text-[#625f70]">
                    Approved hospitalization limit
                  </div>
                  <div className="mt-1 font-semibold text-[#33216d]">
                    {formatPkr(approval.approvedHospitalizationLimit)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#625f70]">
                    Room &amp; board entitlement
                  </div>
                  <div className="mt-1 font-semibold text-[#33216d]">
                    {approval.roomAndBoardEntitlement}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#625f70]">
                    Approved length of stay
                  </div>
                  <div className="mt-1 font-semibold text-[#33216d]">
                    {approval.approvedLengthOfStay} days from{" "}
                    {approval.admissionDate}
                  </div>
                </div>
              </div>
              {revision && (
                <div className="mt-4 grid gap-3 border-t border-[#cfc8e4] pt-3 text-sm sm:grid-cols-3">
                  <div>
                    <span className="text-xs text-[#625f70]">
                      Previous approval
                    </span>
                    <div className="mt-1 font-medium">
                      {formatPkr(approval.previousApprovedAmount)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#625f70]">
                      Additional enhancement
                    </span>
                    <div className="mt-1 font-medium">
                      {formatPkr(approval.additionalEnhancementAmount ?? 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#625f70]">
                      Current total approval
                    </span>
                    <div className="mt-1 font-semibold text-[#33216d]">
                      {formatPkr(approval.currentTotalApprovedAmount)}
                    </div>
                  </div>
                  <p className="sm:col-span-3 text-xs text-[#4c3789]">
                    This current revision supersedes and voids the previous
                    approval.
                  </p>
                </div>
              )}
            </section>
            <section className="mt-6 text-sm leading-6">
              <h2 className="font-display text-base font-bold text-[#33216d]">
                Hospital instructions &amp; conditions
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {[
                  ...approval.approvalRemarks,
                  ...approval.conditions,
                  ...approval.exclusions,
                ].map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-[#d9d6e1] pt-5 text-sm">
              <div>
                <div className="h-8" />
                <div className="border-t border-[#625f70] pt-2 font-semibold">
                  Authorized approval
                </div>
                <div className="text-xs text-[#625f70]">
                  {approval.approvingOfficer}
                </div>
                <div className="text-xs text-[#625f70]">
                  {approval.approvingDepartment}
                </div>
              </div>
              <div className="text-right text-xs leading-5 text-[#625f70]">
                This approval is subject to policy terms and verification of
                final supporting documents.
              </div>
            </div>
          </article>
        </div>

        {sendState === "confirm" && (
          <div className="border-t border-border bg-surface p-4 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/5 p-3">
              <div className="text-sm">
                <span className="font-semibold">Confirm sending:</span>{" "}
                {approval.patientName} · {approval.hospitalName} ·{" "}
                {approval.approvalNo} ·{" "}
                <span className="font-semibold">
                  {formatPkr(approval.currentTotalApprovedAmount)}
                </span>
                <div className="mt-1 text-xs text-muted-foreground">
                  Recipient: {approval.hospitalEmail}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSendState("idle")}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={send}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Mail className="size-3.5" /> Confirm &amp; send
                </button>
              </div>
            </div>
          </div>
        )}
        {sendState === "sending" && (
          <div className="border-t border-border p-3 text-center text-xs text-muted-foreground print:hidden">
            <Loader2 className="mr-2 inline size-3.5 animate-spin" /> Sending
            approval letter…
          </div>
        )}
        {sendState === "sent" && (
          <div className="border-t border-primary/20 bg-primary/5 p-3 text-center text-xs font-medium text-primary print:hidden">
            <Check className="mr-1 inline size-3.5" /> Approval letter sent to{" "}
            {approval.hospitalEmail} by {approval.approvingOfficer}
            {sentAt ? ` on ${sentAt}` : ""}.
          </div>
        )}
      </div>
    </div>
  );
}
