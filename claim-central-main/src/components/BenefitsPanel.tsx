import { useState } from "react";
import { ShieldCheck, X, ChevronDown } from "lucide-react";
import { dependent } from "@/lib/policy-data";

export type BenefitMode = "split" | "closed";

type BenefitTab = "policy" | "cause" | "other" | "dependent";

type BenefitMetric = {
  label: string;
  value: string;
  meta?: string;
  tone?: "primary" | "muted" | "success";
};

type Dependent = {
  id: string;
  name: string;
  relation: string;
};

const policyBenefitMetrics: BenefitMetric[] = [
  { label: "Policy no.", value: "PIHGCDP00011/25", tone: "muted" },
  { label: "Plan", value: "Plan A", meta: "Active and eligible" },
  { label: "Policy coverage", value: "Hospitalization + maternity", meta: "Main policy benefit" },
  { label: "Overall panel limit", value: "80,000", meta: "AED / package limit" },
  { label: "Non-panel limit", value: "80,000", meta: "Maximum eligible" },
  { label: "Cover sub limit", value: "80,000", meta: "No exclusion" },
  { label: "Overall limit used", value: "0", meta: "0% used" },
  { label: "Excess threshold", value: "0", meta: "No excess active" },
];

const policyCoverageSummary = [
  { label: "Eligible amount", value: "80,000", percent: 100 },
  { label: "Approved amount", value: "80,000", percent: 100 },
  { label: "Outstanding", value: "0", percent: 0 },
  { label: "Deductible", value: "0", percent: 0 },
];

const causeSpecificMetrics = (causeOfLoss: string): BenefitMetric[] => [
  { label: "Cover / benefit", value: causeOfLoss, tone: "primary" },
  { label: "Room entitlement", value: "Standard private", meta: "Within network" },
  { label: "Covered period", value: "Pre/post natal", meta: "As per condition" },
  { label: "Entry benefit", value: "Full eligibility", meta: "Approved under policy" },
  { label: "Cause limit", value: "80,000", meta: "AED / cause-specific cap" },
  { label: "Co-pay", value: "0%", meta: "No co-pay applied" },
  { label: "Deductible", value: "0", meta: "No deductible due" },
  { label: "Status", value: "Active", meta: "Benefit available" },
];

const otherBenefitsMetrics: BenefitMetric[] = [
  { label: "Out-patient", value: "Covered", meta: "Subject to policy aggregate" },
  { label: "Day care", value: "Covered", meta: "Network providers only" },
  { label: "Emergency", value: "Covered", meta: "24/7 emergency access" },
  { label: "Diagnostic", value: "Included", meta: "As per policy schedule" },
  { label: "Ancillary services", value: "Included", meta: "Within benefit limit" },
  { label: "Cashless eligibility", value: "Yes", meta: "Available where network applies" },
  { label: "Annual benefit reset", value: "31 Dec", meta: "Policy cycle" },
  { label: "Special approval", value: "Required", meta: "Where claim exceeds limit" },
];

const dependents: Dependent[] = [
  { id: "dep-1", name: "Atifa Ajmal", relation: "Spouse" },
  { id: "dep-2", name: "Ahmed Ajmal", relation: "Son" },
  { id: "dep-3", name: "Hana Ajmal", relation: "Daughter" },
  { id: "dep-4", name: "Salma Ajmal", relation: "Mother" },
];

const getDependentMetrics = (dependentId: string): BenefitMetric[] => {
  const dependent = dependents.find((item) => item.id === dependentId) ?? dependents[0];
  if (!dependent) return [];
  return [
    { label: "Dependent name", value: dependent.name, tone: "primary" },
    { label: "Dependent type", value: dependent.relation, meta: "As enrolled" },
    { label: "Eligibility", value: "Eligible", meta: "Covered under same policy" },
    { label: "Dependent limit", value: "80,000", meta: "Shared benefit cap" },
    { label: "Network access", value: "Available", meta: "Provider panel access" },
    { label: "Exclusion", value: "None", meta: "No dependents-specific restriction" },
    { label: "Annual review", value: "Jan 2027", meta: "Audit follow-up" },
    { label: "Status", value: "Active", meta: "Benefit available" },
  ];
};

export function BenefitsPanel({
  mode,
  onModeChange,
  causeOfLoss = "Maternity C-Section",
}: {
  mode: BenefitMode;
  onModeChange: (m: BenefitMode) => void;
  causeOfLoss?: string;
}) {
  const [activeTab, setActiveTab] = useState<BenefitTab>("policy");
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedDependent, setSelectedDependent] = useState<string>("dep-1");
  const [dependentDropdownOpen, setDependentDropdownOpen] = useState(false);

  const tabs: { id: BenefitTab; label: string }[] = [
    { id: "policy", label: "Policy benefits" },
    { id: "cause", label: `${causeOfLoss} benefits` },
    { id: "other", label: "Other benefits" },
    { id: "dependent", label: "Dependent benefits" },
  ];

  const summaryForTab = {
    policy: {
      title: "Policy benefit overview",
      subtitle: "Verified under policy PIHGCDP00011/25 · effective 01/12/2025",
      metrics: policyBenefitMetrics,
      coverage: policyCoverageSummary,
    },
    cause: {
      title: causeOfLoss,
      subtitle: "Cause-of-loss specific cover and entitlements",
      metrics: causeSpecificMetrics(causeOfLoss),
      coverage: [
        { label: "Eligible amount", value: "80,000", percent: 100 },
        { label: "Cause-specific approval", value: "80,000", percent: 100 },
        { label: "Residual balance", value: "0", percent: 0 },
        { label: "Deductible", value: "0", percent: 0 },
      ],
    },
    other: {
      title: "Other covered benefits",
      subtitle: "Applicable to all other cause-of-loss cases covered under this policy",
      metrics: otherBenefitsMetrics,
      coverage: [
        { label: "Available benefits", value: "8", percent: 75 },
        { label: "Coverage ratio", value: "High", percent: 75 },
        { label: "Claims pending", value: "0", percent: 0 },
        { label: "Limit variance", value: "Low", percent: 30 },
      ],
    },
    dependent: {
      title: "Dependent benefits",
      subtitle: "Coverage for dependent members linked to the primary policyholder",
      metrics: getDependentMetrics(selectedDependent),
      coverage: [
        { label: "Dependent coverage", value: "Active", percent: 100 },
        { label: "Shared limit usage", value: "0%", percent: 0 },
        { label: "Dependent approval", value: "Approved", percent: 100 },
        { label: "Outstanding", value: "0", percent: 0 },
      ],
    },
  } as const;

  const activeSummary = summaryForTab[activeTab];

  if (mode === "closed") return null;

  // Split view: side panel. Fullscreen: modal popup at 60% of viewport.
  if (!fullscreen) {
    return (
      <aside className="sticky top-25 z-10 relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg h-full max-h-[calc(100vh-180px)]">
        <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-sm font-semibold">Benefits</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              title="Full screen"
              onClick={() => setFullscreen(true)}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5" />
              </svg>
            </button>
            <button
              title="Close benefits"
              onClick={() => onModeChange("closed")}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-border bg-surface-2">
          <div className="flex gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)_/_0.3)_transparent]">
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                Fetched benefit info
              </div>
              <div className="mt-2 text-base font-semibold text-foreground">{activeSummary.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{activeSummary.subtitle}</div>
            </div>

            {activeTab === "dependent" && (
              <div className="relative">
                <button
                  onClick={() => setDependentDropdownOpen(!dependentDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <span className="font-medium">
                    {dependents.find((item) => item.id === selectedDependent)?.name || "Select dependent"}
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${dependentDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {dependentDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-border bg-popover shadow-lg">
                    {dependents.map((dep) => (
                      <button
                        key={dep.id}
                        onClick={() => {
                          setSelectedDependent(dep.id);
                          setDependentDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          selectedDependent === dep.id
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium">{dep.name}</div>
                        <div className="text-[11px] opacity-70">{dep.relation}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {activeSummary.metrics.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="label-cap">{item.label}</div>
                  <div
                    className={`mt-1 text-sm font-semibold ${
                      item.tone === "primary"
                        ? "text-primary"
                        : item.tone === "success"
                          ? "text-emerald-600"
                          : "text-foreground"
                    }`}
                  >
                    {item.value}
                  </div>
                  {item.meta && <div className="mt-1 text-[11px] text-muted-foreground">{item.meta}</div>}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Coverage summary</div>
                <span className="text-[11px] text-muted-foreground">Active</span>
              </div>

              <div className="space-y-3">
                {activeSummary.coverage.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Fullscreen mode: fixed modal popup at 80% of viewport
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-6 backdrop-blur-sm">
      <aside className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" style={{
        width: "min(80vw, 880px)",
        height: "min(80vh, 720px)",
      }}>
        <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-sm font-semibold">Benefits</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              title="Exit full screen"
              onClick={() => setFullscreen(false)}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5" />
              </svg>
            </button>
            <button
              title="Close benefits"
              onClick={() => onModeChange("closed")}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-border bg-surface-2">
          <div className="flex gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent p-4">
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                Fetched benefit info
              </div>
              <div className="mt-2 text-base font-semibold text-foreground">{activeSummary.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{activeSummary.subtitle}</div>
            </div>

            {activeTab === "dependent" && (
              <div className="relative">
                <button
                  onClick={() => setDependentDropdownOpen(!dependentDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <span className="font-medium">
                    {dependents.find(d => d.id === selectedDependent)?.name || "Select dependent"}
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${dependentDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {dependentDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-border bg-popover shadow-lg">
                    {dependents.map((dep) => (
                      <button
                        key={dep.id}
                        onClick={() => {
                          setSelectedDependent(dep.id);
                          setDependentDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          selectedDependent === dep.id
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium">{dep.name}</div>
                        <div className="text-[11px] opacity-70">{dep.relation}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {activeSummary.metrics.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="label-cap">{item.label}</div>
                  <div
                    className={`mt-1 text-sm font-semibold ${
                      item.tone === "primary"
                        ? "text-primary"
                        : item.tone === "success"
                          ? "text-emerald-600"
                          : "text-foreground"
                    }`}
                  >
                    {item.value}
                  </div>
                  {item.meta && <div className="mt-1 text-[11px] text-muted-foreground">{item.meta}</div>}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Coverage summary</div>
                <span className="text-[11px] text-muted-foreground">Active</span>
              </div>

              <div className="space-y-3">
                {activeSummary.coverage.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
