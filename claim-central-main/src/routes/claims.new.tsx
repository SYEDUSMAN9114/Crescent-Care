import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Paperclip,
  FileText,
  Lock,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  X,
  AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DocumentsPanel, type DocMode } from "@/components/DocumentsPanel";
import { BenefitsPanel, type BenefitMode } from "@/components/BenefitsPanel";
import {
  lookupPolicy,
  hospitalList,
  claimStatusOptions,
  requiredDocumentOptions,
  type policy,
  type dependent,
  causeOfLossOptions,
  benefitsByCause,
} from "@/lib/policy-data";

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

/* ---------------------------------- field bits ---------------------------------- */

function Field({
  label,
  value,
  required,
  readOnly,
  wide,
  hint,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value?: string | number;
  required?: boolean;
  readOnly?: boolean;
  wide?: boolean;
  hint?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="label-cap flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className="field-underline mt-0.5 w-full text-sm font-medium"
      />
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  required,
  onChange,
  options,
  placeholder = "Select…",
  disabled,
  wide,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="label-cap flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="field-underline mt-0.5 w-full bg-transparent text-sm font-medium"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TagList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="block sm:col-span-2">
      <span className="label-cap">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
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

/* ---------------------------------- wizard steps ---------------------------------- */

type StepId = "identify" | "details" | "documents";
type IdMode = "card" | "cnic";

const STEPS: { id: StepId; label: string }[] = [
  { id: "identify", label: "Client Details" },
  { id: "details", label: "Claim details" },
  { id: "documents", label: "Documents & remarks" },
];

function NewClaim() {
  const [docMode, setDocMode] = useState<DocMode>("closed");
  const [benefitMode, setBenefitMode] = useState<BenefitMode>("closed");

  // wizard progress
  const [step, setStep] = useState<StepId>("identify");
  const [detailsUnlocked, setDetailsUnlocked] = useState(false);
  const [documentsUnlocked, setDocumentsUnlocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // step 1 — identification
  const [claimNo] = useState("00001");
  const [entryNo] = useState("1");
  const [idMode, setIdMode] = useState<IdMode>("card");
  const [cardOrCnic, setCardOrCnic] = useState("");
  const [fetchState, setFetchState] = useState<"idle" | "loading" | "error">("idle");

  // step 2 — policy & member (+ claim details, merged)
  const [policy, setPolicy] = useState<policy | null>(null);
  const [dept, setDept] = useState("");
  const [patientId, setPatientId] = useState("");
  const patient: dependent | undefined = useMemo(
    () => policy?.dependent.find((item) => item.id === patientId),
    [policy, patientId],
  );

  const [causeOfLoss, setCauseOfLoss] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [stay, setStay] = useState("");
  const [reqAmount, setReqAmount] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [hospital, setHospital] = useState("");
  const [status, setStatus] = useState("");

  // step 3 — documents & remarks
  const [requestedDocs, setRequestedDocs] = useState<string[]>([]);
  const [otherDocNote, setOtherDocNote] = useState("");
  const [remarks, setRemarks] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const toggleRequestedDoc = (doc: string) => {
    setRequestedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc],
    );
  };

  const handleIdModeChange = (mode: IdMode) => {
    setIdMode(mode);
    setCardOrCnic("");
    setFetchState("idle");
    setPolicy(null);
    setPatientId("");
    setCauseOfLoss("");
    setSelectedBenefit("");
  };

  const handleFetch = () => {
    if (!cardOrCnic.trim()) {
      setFetchState("error");
      return;
    }
    setFetchState("loading");
    // simulate a lookup call against the policy master
    setTimeout(() => {
      const record = lookupPolicy(cardOrCnic);
      if (!record) {
        setFetchState("error");
        setPolicy(null);
        return;
      }
      setFetchState("idle");
      setPolicy(record);
      setDept(record.deptList[0] ?? "");
      setPatientId("");
      setCauseOfLoss("");
      setSelectedBenefit("");
    }, 500);
  };

  const handlePatientSelect = (id: string) => {
    setPatientId(id);
  };

  const handleCauseSelect = (cause: string) => {
    setCauseOfLoss(cause);
    setSelectedBenefit("");
  };

  const goToDetails = () => {
    if (patient) {
      setDetailsUnlocked(true);
      setStep("details");
    }
  };

  const requiredDetailFields = [causeOfLoss, selectedBenefit, diagnosis, treatment, stay, hospital, status];
  const coreFieldsComplete = !!patient && requiredDetailFields.every((v) => v.trim() !== "");

  const goToDocuments = () => {
    if (coreFieldsComplete) {
      setDocumentsUnlocked(true);
      setStep("documents");
    }
  };

  // remarks are optional on Approve, but mandatory on Reject / Requirement Needed;
  // a reviewer name is additionally required when the case is rejected
  const remarksRequired = status === "Reject" || status === "Requirement Needed";
  const reviewerNameRequired = status === "Reject";
  const remarksValid = !remarksRequired || remarks.trim() !== "";
  const reviewerNameValid = !reviewerNameRequired || reviewerName.trim() !== "";

  const detailsComplete = coreFieldsComplete && remarksValid && reviewerNameValid;

  const documentOptions =
    status === "Approve"
      ? ["CNIC", "Card", "Intimation Form"]
      : status === "Requirement Needed"
        ? requiredDocumentOptions
        : [];

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (!detailsComplete) return;
    setSubmitted(true);
  };

  return (
    <AppShell
      title="New Claim Intimation"
      subtitle={`Claim no. ${claimNo} · Entry ${entryNo}${policy ? ` · ${policy.clientName}` : ""}`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-card hover:bg-muted"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} /> Back
          </Link>
          <button
            onClick={() => {
              setBenefitMode("closed");
              setDocMode((m) => (m === "closed" ? "split" : "closed"));
            }}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-card transition-colors ${
              docMode !== "closed"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-surface hover:bg-muted"
            }`}
          >
            <Paperclip className="size-4" strokeWidth={1.75} /> Documents
          </button>
          <button
            onClick={() => {
              setDocMode("closed");
              setBenefitMode((m) => (m === "closed" ? "split" : "closed"));
            }}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-card transition-colors ${
              benefitMode !== "closed"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-surface hover:bg-muted"
            }`}
          >
            <ShieldCheck className="size-4" strokeWidth={1.75} /> Benefits
          </button>
          <Link
            to="/claims/new/settlement"
            className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-card transition-colors border-border bg-surface hover:bg-muted"
          >
            <FileText className="size-4" strokeWidth={1.75} /> Settlement
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!coreFieldsComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <Save className="size-4" strokeWidth={2} /> Save &amp; submit
          </button>
        </div>
      }
    >
      <div
        className={`grid gap-5 ${docMode === "split" || benefitMode === "split" ? "xl:grid-cols-[1fr_460px]" : "grid-cols-1"}`}
      >
        <div className="min-w-0 space-y-5">
          {/* ---- tab bar ---- */}
          <div className="flex items-center gap-1 rounded-2xl border border-border bg-surface p-1.5 shadow-card">
            {STEPS.map((s, i) => {
              const locked =
                (s.id === "details" && !detailsUnlocked) ||
                (s.id === "documents" && !documentsUnlocked);
              const active = step === s.id;
              const done =
                (s.id === "identify" && detailsUnlocked) ||
                (s.id === "details" && documentsUnlocked) ||
                (s.id === "documents" && submitted);
              return (
                <button
                  key={s.id}
                  disabled={locked}
                  onClick={() => !locked && setStep(s.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-ink text-ink-foreground"
                      : locked
                        ? "cursor-not-allowed text-muted-foreground/50"
                        : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] ${
                      active
                        ? "bg-ink-foreground/20"
                        : done
                          ? "bg-primary/15 text-primary"
                          : "bg-border/70"
                    }`}
                  >
                    {locked ? <Lock className="size-2.5" /> : done ? <Check className="size-3" /> : i + 1}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* ---- step 1: identification ---- */}
          {step === "identify" && (
            <Section
              step="1"
              title="Client Details"
              desc="Enter the claim reference, then look up the member by card number or CNIC."
            >
              <div className="flex flex-wrap items-end gap-6">
                <div className="w-32">
                  <Field label="Claim No." value={claimNo} readOnly />
                </div>
                <div className="w-32">
                  <Field label="Entry No." value={entryNo} readOnly />
                </div>

                <div>
                  <div className="relative mt-1.5 inline-flex rounded-xl border border-border bg-surface-2 p-1">
                    <div
                      className="absolute inset-y-1 w-15 rounded-lg bg-ink transition-transform duration-200 ease-out"
                      style={{
                        transform: idMode === "cnic" ? "translateX(100%)" : "translateX(0%)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleIdModeChange("card")}
                      className={`relative z-10 w-15 rounded-lg py-2 text-xs font-semibold transition-colors ${
                        idMode === "card" ? "text-ink-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Card No.
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIdModeChange("cnic")}
                      className={`relative z-10 w-15 rounded-lg py-2 text-xs font-semibold transition-colors ${
                        idMode === "cnic" ? "text-ink-foreground" : "text-muted-foreground"
                      }`}
                    >
                      CNIC
                    </button>
                  </div>
                </div>

                <div className="min-w-[240px] flex-1 max-w-md">
                  <span className="label-cap flex items-center gap-1">
                    {idMode === "card" ? "Card No." : "CNIC No."}
                    <span className="text-destructive">*</span>
                  </span>
                  <div className="mt-0.5 flex items-center gap-2">
                    <input
                      type="text"
                      value={cardOrCnic}
                      placeholder={idMode === "card" ? "e.g. 000046" : "e.g. 42101-1234567-9"}
                      onChange={(e) => {
                        setCardOrCnic(e.target.value);
                        setFetchState("idle");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                      className="field-underline w-full text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleFetch}
                      disabled={fetchState === "loading"}
                      title="Fetch policy"
                      className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-card transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {fetchState === "loading" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <span className="mt-2 block text-[11px] text-muted-foreground">
                We'll look up policy, employee and family details automatically.
              </span>

              {fetchState === "error" && (
                <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
                  No policy found for that {idMode === "card" ? "card number" : "CNIC"}. Please
                  check and try again.
                </p>
              )}

              {policy && (
                <div className="mt-6 border-t border-border pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">Policy matched</h3>
                  </div>
                  <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Client ID" value={policy.clientId} readOnly />
                    <Field label="Client name" value={policy.clientName} readOnly wide />
                    <Field label="Policy no." value={policy.policyNo} readOnly />
                    <Field label="Policy period" value={policy.policyPeriod} readOnly wide />
                    <Field
                      label="Employee info"
                      value={`${policy.employeeInfo.empId} — ${policy.employeeInfo.empName} (${policy.employeeInfo.designation})`}
                      readOnly
                      wide
                    />
                  </div>
                  <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    <SelectField
                      label="Member"
                      required
                      value={patientId}
                      onChange={handlePatientSelect}
                      placeholder="Choose family member..."
                      options={policy.dependent.map((item) => ({
                        value: item.id,
                        label: `${item.name} - ${item.relation}`,
                      }))}
                    />
                    <SelectField
                      label="Cause of loss"
                      required
                      value={causeOfLoss}
                      onChange={handleCauseSelect}
                      placeholder="Choose cause of loss..."
                      options={causeOfLossOptions.map((cause) => ({ value: cause, label: cause }))}
                    />
                    <SelectField
                      label="Benefit"
                      required
                      value={selectedBenefit}
                      onChange={setSelectedBenefit}
                      disabled={!causeOfLoss}
                      placeholder="Choose benefit..."
                      options={causeOfLoss
                        ? benefitsByCause[causeOfLoss as (typeof causeOfLossOptions)[number]].map((benefit) => ({
                            value: benefit,
                            label: benefit,
                          }))
                        : []}
                    />
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={goToDetails}
                  disabled={!patient || !causeOfLoss || !selectedBenefit}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next: Claim details <ChevronRight className="size-4" />
                </button>
              </div>
            </Section>
          )}

          {/* ---- step 3: claim details ---- */}
          {step === "details" && policy && patient && (
            <Section
              step="2"
              title="Claim details"
              desc="Diagnosis, treatment, amounts and the decision on this claim."
            >
              <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Diagnosis"
                  value={diagnosis}
                  required
                  onChange={setDiagnosis}
                  placeholder="e.g. LSCS"
                  hint="ICD code where applicable"
                />
                <Field
                  label="Treatment"
                  value={treatment}
                  required
                  onChange={setTreatment}
                  placeholder="e.g. Surgical delivery"
                />
                <Field
                  label="Stay (days)"
                  value={stay}
                  required
                  type="number"
                  onChange={setStay}
                  placeholder="e.g. 2"
                />
                <Field
                  label="Requested amount"
                  value={reqAmount}
                  type="number"
                  onChange={setReqAmount}
                  placeholder="0"
                />
                <Field
                  label="Approved amount"
                  value={approveAmount}
                  type="number"
                  onChange={setApproveAmount}
                  placeholder="0"
                />
                <SelectField
                  label="Hospital"
                  required
                  value={hospital}
                  onChange={setHospital}
                  options={hospitalList.map((h) => ({ value: h, label: h }))}
                />
                <SelectField
                  label="Status"
                  required
                  value={status}
                  onChange={setStatus}
                  options={claimStatusOptions.map((s) => ({ value: s, label: s }))}
                />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setStep("identify")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <ChevronLeft className="size-4" /> Back
                </button>
                <button
                  onClick={goToDocuments}
                  disabled={!coreFieldsComplete}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next: Documents &amp; remarks <ChevronRight className="size-4" />
                </button>
              </div>
            </Section>
          )}

          {/* ---- step 4: documents & remarks ---- */}
          {step === "documents" && policy && patient && (
            <Section
              step="3"
              title="Documents & remarks"
              desc="Attach whatever's on file, flag anything still needed, then save."
            >
              {/* ---- remarks & requirement ---- */}
              <div className="mt-6 border-t border-border pt-5">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">Remarks & requirement</h3>
                  <p className="text-xs text-muted-foreground">
                    Tick anything still needed from the claimant, e.g. approve the case but ask
                    for an additional lab report.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                  {documentOptions.map((doc) => (
                    <label
                      key={doc}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                        requestedDocs.includes(doc)
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-surface hover:bg-muted"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={requestedDocs.includes(doc)}
                        onChange={() => toggleRequestedDoc(doc)}
                        className="size-3.5 accent-primary"
                      />
                      {doc}
                    </label>
                  ))}
                </div>

                <Field
                  label="Other document / requirement"
                  value={otherDocNote}
                  onChange={setOtherDocNote}
                  placeholder="e.g. Attending physician's report"
                  wide
                />

                <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="label-cap flex items-center gap-1">
                      Remarks
                      {remarksRequired && <span className="text-destructive">*</span>}
                    </span>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      placeholder={
                        status === "Approve"
                          ? "Optional — add any notes on this approval"
                          : "Explain what's missing or why the case was rejected"
                      }
                      className="field-underline mt-0.5 w-full resize-none text-sm font-medium"
                    />
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {status === "Approve"
                        ? "Not required when the case is approved."
                        : "Required when the status is Reject or Requirement Needed."}
                    </span>
                    {attemptedSubmit && remarksRequired && !remarksValid && (
                      <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertTriangle className="size-3" /> Please add remarks before submitting.
                      </span>
                    )}
                  </label>

                  {reviewerNameRequired && (
                    <Field
                      label="Reviewer name"
                      value={reviewerName}
                      required
                      onChange={setReviewerName}
                      placeholder="Name of the person rejecting this claim"
                      hint="Required when the status is Reject."
                    />
                  )}
                </div>
                {attemptedSubmit && reviewerNameRequired && !reviewerNameValid && (
                  <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
                    <AlertTriangle className="size-3" /> Please enter your name to reject this
                    claim.
                  </span>
                )}
              </div>

              {submitted && (
                <p className="mt-5 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                  <Check className="size-3.5" /> Claim saved for {patient.name} — status:{" "}
                  {status || "—"}
                  {reviewerName ? ` — reviewed by ${reviewerName}` : ""}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setStep("details")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <ChevronLeft className="size-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!coreFieldsComplete}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save className="size-4" /> Save &amp; submit
                </button>
              </div>
            </Section>
          )}
        </div>

        <aside
          className={
            docMode === "split" || benefitMode === "split"
              ? "xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]"
              : "contents"
          }
        >
          <DocumentsPanel
            mode={docMode}
            onModeChange={(mode) => {
              setDocMode(mode);
              if (mode === "split") setBenefitMode("closed");
            }}
          />
          <BenefitsPanel
            mode={benefitMode}
            onModeChange={(mode) => {
              setBenefitMode(mode);
              if (mode === "split") setDocMode("closed");
            }}
            causeOfLoss={causeOfLoss}
            selectedBenefit={selectedBenefit}
            memberName={patient?.name}
            underwritingTerms={policy?.underwritingTerms}
            selectedMember={patient}
          />
        </aside>
      </div>
    </AppShell>
  );
}