import { useEffect, useRef, useState } from "react";
import {
  X,
  Minus,
  PictureInPicture2,
  Columns2,
  UploadCloud,
  FileText,
  Trash2,
  Paperclip,
} from "lucide-react";

export type DocMode = "split" | "float" | "minimized" | "closed";

type Doc = { id: string; name: string; size: number; type: string; url: string };

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function Viewer({ doc }: { doc: Doc | null }) {
  if (!doc)
    return (
      <div className="grid h-full place-items-center p-6 text-center text-xs text-muted-foreground">
        Select a document to preview it here.
      </div>
    );
  if (doc.type.startsWith("image/"))
    return (
      <div className="grid h-full place-items-center overflow-auto bg-surface-2 p-3">
        <img src={doc.url} alt={doc.name} className="max-h-full rounded-lg object-contain" />
      </div>
    );
  if (doc.type === "application/pdf")
    return <iframe src={doc.url} title={doc.name} className="h-full w-full bg-surface-2" />;
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
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = docs.find((d) => d.id === activeId) ?? null;

  useEffect(() => () => docs.forEach((d) => URL.revokeObjectURL(d.url)), [docs]);

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));
    setDocs((d) => [...d, ...next]);
    setActiveId((a) => a ?? next[0]!.id);
  }

  if (mode === "closed") return null;

  if (mode === "minimized")
    return (
      <button
        onClick={() => onModeChange("split")}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-ink-foreground shadow-lift"
      >
        <Paperclip className="size-4" /> Documents
        <span className="num rounded-full bg-ink-foreground/15 px-2 py-0.5 text-[11px]">
          {docs.length}
        </span>
      </button>
    );

  const chrome = (
    <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
      <Paperclip className="size-4 text-primary" />
      <span className="text-sm font-semibold">Documents</span>
      <span className="num text-[11px] text-muted-foreground">{docs.length} file(s)</span>
      <div className="ml-auto flex items-center gap-1">
        <button
          title={mode === "split" ? "Floating view" : "Split view"}
          onClick={() => onModeChange(mode === "split" ? "float" : "split")}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {mode === "split" ? (
            <PictureInPicture2 className="size-4" />
          ) : (
            <Columns2 className="size-4" />
          )}
        </button>
        <button
          title="Minimize"
          onClick={() => onModeChange("minimized")}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Minus className="size-4" />
        </button>
        <button
          title="Close"
          onClick={() => onModeChange("closed")}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );

  const body = (
    <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] overflow-hidden">
      <div className="border-b border-border p-3">
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
          <div className="text-[11px] text-muted-foreground">PDF, JPG, PNG · max 10 MB each</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div className="grid min-h-0 grid-rows-[auto_1fr]">
        <ul className="max-h-36 overflow-y-auto border-b border-border">
          {docs.map((d) => (
            <li
              key={d.id}
              onClick={() => setActiveId(d.id)}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors ${
                d.id === activeId ? "bg-accent text-accent-foreground" : "hover:bg-muted"
              }`}
            >
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">{d.name}</span>
              <span className="num ml-auto shrink-0 text-[11px] text-muted-foreground">
                {formatSize(d.size)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDocs((x) => x.filter((y) => y.id !== d.id));
                  if (activeId === d.id) setActiveId(null);
                }}
                className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
          {docs.length === 0 && (
            <li className="px-3 py-3 text-[11px] text-muted-foreground">No documents attached.</li>
          )}
        </ul>
        <div className="min-h-0">
          <Viewer doc={active} />
        </div>
      </div>
    </div>
  );

  if (mode === "float")
    return (
      <div className="fixed bottom-5 right-5 z-40 flex h-[520px] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
        {chrome}
        {body}
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {chrome}
      {body}
    </div>
  );
}
