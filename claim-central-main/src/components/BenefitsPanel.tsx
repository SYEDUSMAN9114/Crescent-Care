import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShieldCheck, X } from "lucide-react";
import type { dependent } from "@/lib/policy-data";

export type BenefitMode = "split" | "closed";

type BenefitTab = "policy" | "cause" | "other";

type BenefitMetric = {
  label: string;
  value: string;
  meta?: string;
  tone?: "primary" | "muted" | "success";
};

const policyBenefitMetrics: BenefitMetric[] = [
  { label: "Policy no.", value: "PIHGCDP00011/25", tone: "muted" },
  { label: "Plan", value: "Plan A", meta: "Active and eligible" },
  {
    label: "Policy coverage",
    value: "Hospitalization + maternity",
    meta: "Main policy benefit",
  },
  {
    label: "Overall panel limit",
    value: "80,000",
    meta: "AED / package limit",
  },
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

const causeSpecificMetrics = (
  causeOfLoss: string,
  benefit: string,
  memberName: string,
): BenefitMetric[] => [
  { label: "Cover / benefit", value: causeOfLoss, tone: "primary" },
  {
    label: "Selected benefit",
    value: benefit || "Select a benefit",
    tone: "primary",
  },
  { label: "Member", value: memberName || "Select a member" },
  {
    label: "Room entitlement",
    value: "Standard private",
    meta: "Within network",
  },
  {
    label: "Covered period",
    value: "Pre/post natal",
    meta: "As per condition",
  },
  {
    label: "Entry benefit",
    value: "Full eligibility",
    meta: "Approved under policy",
  },
  { label: "Cause limit", value: "80,000", meta: "AED / cause-specific cap" },
  { label: "Co-pay", value: "0%", meta: "No co-pay applied" },
  { label: "Deductible", value: "0", meta: "No deductible due" },
  { label: "Status", value: "Active", meta: "Benefit available" },
];

const memberMetrics = (
  member: dependent | undefined,
  underwritingTerms: string[],
): BenefitMetric[] => [
  {
    label: "Member",
    value: member?.name || "Select a member",
    tone: "primary",
  },
  { label: "Healthcare no.", value: member?.healthcareNo || "-" },
  { label: "Balance / limit", value: member?.balanceLimit || "-" },
  { label: "Room entitlement", value: member?.roomEntitlement || "-" },
  { label: "Underwriting Terms", value: underwritingTerms.join(", ") || "-" },
];

const otherBenefitsMetrics: BenefitMetric[] = [
  {
    label: "Out-patient",
    value: "Covered",
    meta: "Subject to policy aggregate",
  },
  { label: "Day care", value: "Covered", meta: "Network providers only" },
  { label: "Emergency", value: "Covered", meta: "24/7 emergency access" },
  { label: "Diagnostic", value: "Included", meta: "As per policy schedule" },
  {
    label: "Ancillary services",
    value: "Included",
    meta: "Within benefit limit",
  },
  {
    label: "Cashless eligibility",
    value: "Yes",
    meta: "Available where network applies",
  },
  { label: "Annual benefit reset", value: "31 Dec", meta: "Policy cycle" },
  {
    label: "Special approval",
    value: "Required",
    meta: "Where claim exceeds limit",
  },
];

export function BenefitsPanel({
  mode,
  onModeChange,
  causeOfLoss = "Maternity",
  selectedBenefit = "",
  memberName = "",
  underwritingTerms = [],
  selectedMember,
}: {
  mode: BenefitMode;
  onModeChange: (m: BenefitMode) => void;
  causeOfLoss?: string;
  selectedBenefit?: string;
  memberName?: string;
  underwritingTerms?: string[];
  selectedMember?: dependent;
}) {
  const [activeTab, setActiveTab] = useState<BenefitTab>("policy");
  const [fullscreen, setFullscreen] = useState(false);
  const hasSelections = Boolean(causeOfLoss && selectedBenefit && memberName);

  useEffect(() => {
    if (hasSelections) setActiveTab("cause");
  }, [hasSelections]);

  const tabs: { id: BenefitTab; label: string }[] = hasSelections
    ? [
        { id: "policy", label: "Policy" },
        { id: "cause", label: `${causeOfLoss}` },
        { id: "other", label: "Others" },
      ]
    : [];

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
      metrics: causeSpecificMetrics(causeOfLoss, selectedBenefit, memberName),
      coverage: [
        { label: "Eligible amount", value: "80,000", percent: 100 },
        { label: "Cause-specific approval", value: "80,000", percent: 100 },
        { label: "Residual balance", value: "0", percent: 0 },
        { label: "Deductible", value: "0", percent: 0 },
      ],
    },
    other: {
      title: "Other covered benefits",
      subtitle:
        "Applicable to all other cause-of-loss cases covered under this policy",
      metrics: otherBenefitsMetrics,
      coverage: [
        { label: "Available benefits", value: "8", percent: 75 },
        { label: "Coverage ratio", value: "High", percent: 75 },
        { label: "Claims pending", value: "0", percent: 0 },
        { label: "Limit variance", value: "Low", percent: 30 },
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
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
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
            {!hasSelections ? (
              <div className="rounded-xl border border-border bg-surface-2 p-5 text-center">
                <div className="text-sm font-semibold text-foreground">
                  Benefits panel ready
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Select a member, cause of loss, and benefit to fetch coverage
                  information.
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Fetched benefit info
                  </div>
                  <div className="mt-2 text-base font-semibold text-foreground">
                    {activeSummary.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {activeSummary.subtitle}
                  </div>
                </div>

                {activeTab === "cause" && (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {memberMetrics(selectedMember, underwritingTerms).map(
                      (item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-border bg-surface-2 p-3"
                        >
                          <div className="label-cap">{item.label}</div>
                          <div className="mt-1 text-sm font-semibold text-foreground">
                            {item.value}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {activeSummary.metrics.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-surface-2 p-3"
                    >
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
                      {item.meta && (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {item.meta}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      Coverage summary
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeSummary.coverage.map((item) => (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{item.label}</span>
                          <span className="font-medium text-foreground">
                            {item.value}
                          </span>
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
              </>
            )}
          </div>
        </div>
      </aside>
    );
  }

    // Fullscreen mode: fixed modal popup above the app shell chrome.
  const fullscreenPanel = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm sm:p-6">
      <aside
        className="relative flex max-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:max-h-[calc(100vh-3rem)]"
        style={{
          maxWidth: "880px",
          height: "min(80vh, 720px)",
        }}

      >
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
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
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
            {!hasSelections ? (
              <div className="rounded-xl border border-border bg-surface-2 p-5 text-center">
                <div className="text-sm font-semibold text-foreground">
                  Benefits panel ready
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Select a member, cause of loss, and benefit to fetch coverage
                  information.
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Fetched benefit info
                  </div>
                  <div className="mt-2 text-base font-semibold text-foreground">
                    {activeSummary.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {activeSummary.subtitle}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {activeSummary.metrics.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-surface-2 p-3"
                    >
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
                      {item.meta && (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {item.meta}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      Coverage summary
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeSummary.coverage.map((item) => (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{item.label}</span>
                          <span className="font-medium text-foreground">
                            {item.value}
                          </span>
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
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );

  return typeof document === "undefined"
    ? fullscreenPanel
    : createPortal(fullscreenPanel, document.body);
}
