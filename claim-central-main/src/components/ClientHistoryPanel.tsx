import { useState } from "react";
import { createPortal } from "react-dom";
import { Clock3, X } from "lucide-react";
import type { ClaimHistoryItem } from "@/lib/policy-data";

export type ClientHistoryMode = "split" | "closed";

function statusClass(status: ClaimHistoryItem["status"]) {
  if (status === "Paid" || status === "Approved") {
    return "border-primary/25 bg-primary/10 text-primary";
  }
  if (status === "Requirement Needed") {
    return "border-warning/40 bg-warning/15 text-warning-foreground";
  }
  return "border-destructive/25 bg-destructive/10 text-destructive";
}

function HistoryBody({ items }: { items: ClaimHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="grid h-full min-h-60 place-items-center p-6 text-center">
        <div>
          <Clock3 className="mx-auto mb-2 size-6 text-muted-foreground" />
          <div className="text-sm font-semibold">No old claims found</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Fetch a member by card number or CNIC to view matching claim history.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {items.map((claim) => (
        <article
          key={claim.id}
          className="rounded-xl border border-border bg-surface-2 p-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold">{claim.claimNo}</div>
              <div className="text-[11px] text-muted-foreground">
                Entry {claim.entryNo} · {claim.intimationDate}
              </div>
            </div>
            <span
              className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusClass(
                claim.status,
              )}`}
            >
              {claim.status}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            <div>
              <div className="label-cap">Patient</div>
              <div className="mt-1 font-medium">
                {claim.patientName} ({claim.relation})
              </div>
            </div>
            <div>
              <div className="label-cap">Hospital</div>
              <div className="mt-1 font-medium">{claim.hospital}</div>
            </div>
            <div>
              <div className="label-cap">Benefit</div>
              <div className="mt-1 font-medium">
                {claim.causeOfLoss} / {claim.benefit}
              </div>
            </div>
            <div>
              <div className="label-cap">Amounts</div>
              <div className="mt-1 font-medium">
                Claimed {claim.claimedAmount} · Approved {claim.approvedAmount}
              </div>
            </div>
          </div>

          {claim.settledDate && (
            <div className="mt-3 rounded-lg border border-border bg-surface px-2.5 py-2 text-[11px] text-muted-foreground">
              Settled on {claim.settledDate}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export function ClientHistoryPanel({
  mode,
  onModeChange,
  history,
}: {
  mode: ClientHistoryMode;
  onModeChange: (m: ClientHistoryMode) => void;
  history: ClaimHistoryItem[];
}) {
  const [fullscreen, setFullscreen] = useState(false);

  if (mode === "closed") return null;

  const header = (
    <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Clock3 className="size-4 text-primary" />
        <span className="text-sm font-semibold">Client history</span>
        <span className="text-[11px] text-muted-foreground">
          {history.length} claim(s)
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          title={fullscreen ? "Exit full screen" : "Full screen"}
          onClick={() => setFullscreen((value) => !value)}
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
          title="Close client history"
          onClick={() => onModeChange("closed")}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );

  if (!fullscreen) {
    return (
      <aside className="sticky top-25 z-10 relative flex h-full max-h-[calc(100vh-180px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {header}
        <div className="flex-1 overflow-y-auto">
          <HistoryBody items={history} />
        </div>
      </aside>
    );
  }

    const fullscreenPanel = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm sm:p-6">
      <aside
        className="relative flex max-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:max-h-[calc(100vh-3rem)]"
        style={{ maxWidth: "1000px", height: "min(80vh, 720px)" }}
      >
        {header}
        <div className="flex-1 overflow-y-auto">
          <HistoryBody items={history} />
        </div>
      </aside>
    </div>
  );

  return typeof document === "undefined"
    ? fullscreenPanel
    : createPortal(fullscreenPanel, document.body);
}
