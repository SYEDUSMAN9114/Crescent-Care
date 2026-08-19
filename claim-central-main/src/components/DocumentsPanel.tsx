import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  Paperclip,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export type DocMode = "split" | "closed";

type Doc = { id: string; name: string; size: number; type: string; url: string };

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

const TABS = [
  "Required Documents",
  "Receiving Documents",
  "Re-Insurance",
  "Claim D1",
  "D1",
  "HD1",
  "PD1",
] as const;

type TabName = (typeof TABS)[number];

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function Viewer({ doc, zoom }: { doc: Doc | null; zoom: number }) {
  if (!doc) {
    return (
      <div className="grid h-full place-items-center p-6 text-center text-xs text-muted-foreground">
        Select a document to preview it here.
      </div>
    );
  }

  if (doc.type.startsWith("image/")) {
    return (
      <div className="h-full w-full overflow-auto bg-muted">
        {/* At 100% the image is fully contained; zoom scales from the center. */}
        <div className="grid min-h-full min-w-full place-items-center p-3">
          <img
            src={doc.url}
            alt={doc.name}
            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            className="max-h-[calc(100%-0px)] max-w-full rounded-lg object-contain transition-transform"
          />
        </div>
      </div>
    );
  }

  if (doc.type === "application/pdf") {
    return (
      <div className="h-full w-full overflow-auto bg-muted">
        <div
          style={{
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <iframe src={doc.url} title={doc.name} className="h-full w-full border-0 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full place-items-center p-6 text-center text-xs text-muted-foreground">
      <div>
        <FileText className="mx-auto mb-2 size-6" />
        Preview not available for this file type.
      </div>
    </div>
  );
}

export function DocumentsPanel({
  mode,
  onModeChange,
}: {
  mode: DocMode;
  onModeChange: (m: DocMode) => void;
}) {
  const [docsByTab, setDocsByTab] = useState<Record<TabName, Doc[]>>(() => {
    const init = {} as Record<TabName, Doc[]>;
    TABS.forEach((t) => {
      init[t] = [];
    });
    return init;
  });

  const [tab, setTab] = useState<TabName>(TABS[0]);
  const docs = docsByTab[tab];
  const totalDocs = useMemo(
    () => Object.values(docsByTab).reduce((n, d) => n + d.length, 0),
    [docsByTab],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [listOpen, setListOpen] = useState(false);

  const [fullscreen, setFullscreen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const active = docs.find((d) => d.id === activeId) ?? null;

  // Reset zoom when the previewed document changes.
  useEffect(() => setZoom(1), [activeId]);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    if (!listOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setListOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [listOpen]);

  // Horizontal tab scrolling: React's onWheel is passive, so preventDefault()
  // there is ignored and the page scrolls instead of the tab strip.
  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const raw = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const dx = raw * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      if (dx === 0) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      if ((dx > 0 && atEnd) || (dx < 0 && atStart)) return;
      e.preventDefault();
      el.scrollLeft += dx;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Revoke object URLs only on unmount, so switching modes never drops documents.
  const docsRef = useRef(docsByTab);
  docsRef.current = docsByTab;
  useEffect(
    () => () =>
      Object.values(docsRef.current)
        .flat()
        .forEach((d) => URL.revokeObjectURL(d.url)),
    [],
  );

  function addFiles(files: FileList | null) {
    if (!files?.length) return;

    const next = Array.from(files).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));

    setDocsByTab((m) => ({ ...m, [tab]: [...m[tab], ...next] }));
    setActiveId((a) => a ?? next[0]!.id);
  }

  const body = (
    <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[auto_1fr] overflow-hidden">
      <div className="min-w-0 border-b border-border">
        <div className="flex min-w-0 items-center gap-1 px-2 py-1.5">
          <div
            ref={tabListRef}
            className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max gap-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setActiveId(null);
                    setListOpen(false);
                  }}
                  className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                    t === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {t}
                  {docsByTab[t].length > 0 && (
                    <span className="ml-1 opacity-70">{docsByTab[t].length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {docs.length > 0 && (
            <button
              title={`Add documents to ${tab}`}
              onClick={() => inputRef.current?.click()}
              data-no-drag
              className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 hover:bg-primary/90"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>

        {docs.length === 0 && (
          <div className="p-3 pt-0">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-xl border border-dashed p-4 text-center transition-colors ${
                drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <UploadCloud className="mx-auto mb-1 size-5 text-primary" />
              <div className="text-xs font-medium">Drop files or click to upload</div>
              <div className="text-[11px] text-muted-foreground">
                PDF, JPG, PNG · max 10 MB each
              </div>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="grid min-h-0 min-w-0 grid-rows-[auto_1fr]">
        {/* Document picker + zoom toolbar — wraps so it never overflows the panel */}
        <div
          className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2"
          data-no-drag
        >
          <div ref={dropdownRef} className="relative min-w-[140px] flex-1">
            <button
              onClick={() => setListOpen((o) => !o)}
              disabled={docs.length === 0}
              className="flex w-full items-center gap-2 rounded-lg border border-input bg-background px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-accent disabled:opacity-50"
            >
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">
                {active ? active.name : `Select a document (${docs.length})`}
              </span>
              <ChevronDown className="ml-auto size-3.5 shrink-0 opacity-60" />
            </button>

            {listOpen && docs.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-40 mt-1 max-h-52 overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-lg">
                {docs.map((d) => (
                  <li
                    key={d.id}
                    onClick={() => {
                      setActiveId(d.id);
                      setListOpen(false);
                    }}
                    className={`flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs transition-colors ${
                      d.id === activeId ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{d.name}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                      {formatSize(d.size)}
                    </span>
                    <button
                      title="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDocsByTab((m) => ({
                          ...m,
                          [tab]: m[tab].filter((y) => y.id !== d.id),
                        }));
                        if (activeId === d.id) setActiveId(null);
                      }}
                      className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border p-0.5">
            <button
              title="Zoom out"
              disabled={!active || zoom <= ZOOM_MIN}
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
              className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="w-9 text-center text-[11px] tabular-nums text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <button
              title="Zoom in"
              disabled={!active || zoom >= ZOOM_MAX}
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
              className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              <ZoomIn className="size-3.5" />
            </button>
            <button
              title="Reset zoom"
              disabled={!active || zoom === 1}
              onClick={() => setZoom(1)}
              className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 min-w-0">
          <Viewer doc={active} zoom={zoom} />
        </div>
      </div>
    </div>
  );

  if (mode === "closed") return null;

  // Split view: side panel. Fullscreen: modal popup at 80% of viewport.
  if (!fullscreen) {
    return (
      <div className="sticky top-25 z-10 relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg h-full max-h-[calc(100vh-180px)]">
        <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2 select-none">
          <Paperclip className="size-4 text-primary" />
          <span className="text-sm font-semibold">Documents</span>
          <span className="text-[11px] text-muted-foreground">{totalDocs} file(s)</span>

          <div className="ml-auto flex items-center gap-1">
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
              title="Close"
              onClick={() => onModeChange("closed")}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">{body}</div>
      </div>
    );
  }

  // Fullscreen mode: fixed modal popup at 60% of viewport
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-6 backdrop-blur-sm">
      <div
        className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        style={{
          width: "min(80vw, 1000px)",
          height: "min(80vh, 720px)",
        }}
      >
        <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2 select-none">
          <Paperclip className="size-4 text-primary" />
          <span className="text-sm font-semibold">Documents</span>
          <span className="text-[11px] text-muted-foreground">{totalDocs} file(s)</span>

          <div className="ml-auto flex items-center gap-1">
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
              title="Close"
              onClick={() => onModeChange("closed")}
              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">{body}</div>
      </div>
    </div>
  );
}
