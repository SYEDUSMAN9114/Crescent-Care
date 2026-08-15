import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Clock, a as Search, b as Columns2, d as PictureInPicture2, f as Paperclip, g as FileText, k as ArrowLeft, n as Trash2, o as Save, p as Minus, t as X, u as Plus, x as CloudUpload } from "../_libs/lucide-react.mjs";
import { r as money, t as AppShell } from "./claims-data-Cm40imDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/claims.new-BYM8RjMB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatSize(b) {
	if (b < 1024) return `${b} B`;
	if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
	return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
function Viewer({ doc }) {
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center p-6 text-center text-xs text-muted-foreground",
		children: "Select a document to preview it here."
	});
	if (doc.type.startsWith("image/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center overflow-auto bg-surface-2 p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: doc.url,
			alt: doc.name,
			className: "max-h-full rounded-lg object-contain"
		})
	});
	if (doc.type === "application/pdf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
		src: doc.url,
		title: doc.name,
		className: "h-full w-full bg-surface-2"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center p-6 text-center text-xs text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-2 size-6" }), "Preview not available for this file type."] })
	});
}
function DocumentsPanel({ mode, onModeChange }) {
	const [docs, setDocs] = (0, import_react.useState)([]);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const active = docs.find((d) => d.id === activeId) ?? null;
	(0, import_react.useEffect)(() => () => docs.forEach((d) => URL.revokeObjectURL(d.url)), [docs]);
	function addFiles(files) {
		if (!files?.length) return;
		const next = Array.from(files).map((f) => ({
			id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
			name: f.name,
			size: f.size,
			type: f.type,
			url: URL.createObjectURL(f)
		}));
		setDocs((d) => [...d, ...next]);
		setActiveId((a) => a ?? next[0].id);
	}
	if (mode === "closed") return null;
	if (mode === "minimized") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => onModeChange("split"),
		className: "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-ink-foreground shadow-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" }),
			" Documents",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "num rounded-full bg-ink-foreground/15 px-2 py-0.5 text-[11px]",
				children: docs.length
			})
		]
	});
	const chrome = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold",
				children: "Documents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "num text-[11px] text-muted-foreground",
				children: [docs.length, " file(s)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						title: mode === "split" ? "Floating view" : "Split view",
						onClick: () => onModeChange(mode === "split" ? "float" : "split"),
						className: "grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
						children: mode === "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureInPicture2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						title: "Minimize",
						onClick: () => onModeChange("minimized"),
						className: "grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						title: "Close",
						onClick: () => onModeChange("closed"),
						className: "grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			})
		]
	});
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-0 flex-1 grid-rows-[auto_1fr] overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setDrag(true);
				},
				onDragLeave: () => setDrag(false),
				onDrop: (e) => {
					e.preventDefault();
					setDrag(false);
					addFiles(e.dataTransfer.files);
				},
				onClick: () => inputRef.current?.click(),
				className: `cursor-pointer rounded-xl border border-dashed p-4 text-center transition-colors ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "mx-auto mb-1 size-5 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium",
						children: "Drop files or click to upload"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "PDF, JPG, PNG · max 10 MB each"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				multiple: true,
				accept: "image/*,application/pdf",
				className: "hidden",
				onChange: (e) => addFiles(e.target.files)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-0 grid-rows-[auto_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "max-h-36 overflow-y-auto border-b border-border",
				children: [docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					onClick: () => setActiveId(d.id),
					className: `flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors ${d.id === activeId ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 shrink-0 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: d.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num ml-auto shrink-0 text-[11px] text-muted-foreground",
							children: formatSize(d.size)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: (e) => {
								e.stopPropagation();
								setDocs((x) => x.filter((y) => y.id !== d.id));
								if (activeId === d.id) setActiveId(null);
							},
							className: "grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})
					]
				}, d.id)), docs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-3 py-3 text-[11px] text-muted-foreground",
					children: "No documents attached."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewer, { doc: active })
			})]
		})]
	});
	if (mode === "float") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-5 right-5 z-40 flex h-[520px] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lift",
		children: [chrome, body]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card",
		children: [chrome, body]
	});
}
function Field({ label, value, required, readOnly, wide, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${wide ? "sm:col-span-2" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "label-cap flex items-center gap-1",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-destructive",
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				defaultValue: value,
				readOnly,
				disabled: readOnly,
				className: "field-underline mt-0.5 w-full text-sm font-medium"
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function Section({ step, title, desc, children, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: `s-${step}`,
		className: "scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-[11px] font-semibold text-ink-foreground",
					children: step
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: desc
				})] })]
			}), right]
		}), children]
	});
}
var lines = [{
	no: 1,
	date: "02/01/2026",
	main: "CPT",
	service: "CPT",
	procedure: "#4649 — Miscellaneous",
	rate: 999999999,
	bill: 8e4,
	payable: 8e4,
	excess: 0,
	withheld: 0,
	deductible: 0
}];
function NewClaim() {
	const [tab, setTab] = (0, import_react.useState)("payment");
	const [docMode, setDocMode] = (0, import_react.useState)("closed");
	const totals = (0, import_react.useMemo)(() => ({
		bill: lines.reduce((s, l) => s + l.bill, 0),
		payable: lines.reduce((s, l) => s + l.payable, 0)
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "New Claim Intimation",
		subtitle: "Claim no. 00001 · Entry 1 · Registered 02/01/2026 · Claim day 3",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-card hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "size-4",
						strokeWidth: 1.75
					}), " Back"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setDocMode((m) => m === "closed" ? "split" : "closed"),
					className: `inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-card transition-colors ${docMode !== "closed" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-surface hover:bg-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
						className: "size-4",
						strokeWidth: 1.75
					}), " Documents"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-px",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
						className: "size-4",
						strokeWidth: 2
					}), " Save claim"]
				})
			]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `grid gap-5 ${docMode === "split" ? "xl:grid-cols-[1fr_460px]" : "grid-cols-1"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						step: "1",
						title: "Claim header",
						desc: "Who is claiming, when it was intimated and under which authorization.",
						right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Pre-Authorization"]
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Claim No.",
									value: "00001",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Entry No.",
									value: "1",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Intimation date",
									value: "02/01/2026 00:00",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Admit / visit date",
									value: "01/01/2026",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Claim receive date",
									value: "01/01/2026",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Client name",
									value: "Expert Hazard and Waste Management",
									required: true,
									wide: true,
									hint: "Press F8 to search clients"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cause of loss",
									value: "Maternity C-Section",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Diagnose",
									value: "LSCS",
									hint: "ICD code linked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Discharge date",
									value: "03/01/2026"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "MR / Bill no." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Old claim no." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Leader claim no." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Bunch file no." })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						step: "2",
						title: "Member & cover",
						desc: "Policy, patient and the limits that govern this claim.",
						right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3" }), " Search previous claim"]
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Policy no.",
									value: "PIHGCDP00011/25",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Card holder",
									value: "000046 — Ajmal kausar",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Patient",
									value: "Atifa ajmal",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Plan",
									value: "Plan A",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Date of birth",
									value: "23/12/1989",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Age / gender",
									value: "36 · Female",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Relation",
									value: "Spouse",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Healthcare no.",
									value: "GC25-EHWM-1100-0046",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cover / benefit",
									value: "Caesarean Section",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cover type",
									value: "Per Person",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Effective / expiry",
									value: "01/12/2025",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Reim. tag",
									value: "No",
									required: true
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								{
									l: "Panel limit",
									v: "80,000",
									u: 0
								},
								{
									l: "Non-panel limit",
									v: "80,000",
									u: 0
								},
								{
									l: "Cover sub limit",
									v: "80,000",
									u: 0
								},
								{
									l: "Limit utilized",
									v: "0",
									u: 100
								}
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "label-cap",
										children: x.l
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "num mt-1 text-lg font-semibold",
										children: x.v
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 h-1.5 overflow-hidden rounded-full bg-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-primary",
											style: { width: `${100 - x.u}%` }
										})
									})
								]
							}, x.l))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						step: "3",
						title: "Hospital & room limits",
						desc: "Provider, network status and room entitlement for this admission.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Hospital",
									value: "Al-Hamd Medical Centre (KHI)",
									required: true,
									wide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Claim type",
									value: "Panel",
									readOnly: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Room entitlement",
									value: "Standard private"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Room limit",
									value: "10,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Outside network co-pay %" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Pre natal max.",
									value: "270"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Post natal max.",
									value: "30"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Deductible %",
									value: "0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Deductible amount",
									value: "0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Ex-gratia claim",
									value: "No"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Days admitted",
									value: "2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Special favour",
									value: "0"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						step: "4",
						title: "Payment detail",
						desc: "Line items, network rates and what the insurer actually pays.",
						right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-lg border border-border p-0.5 text-[11px] font-medium",
							children: [
								"payment",
								"recovery",
								"coinsurer"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTab(t),
								className: `rounded-md px-2.5 py-1 capitalize transition-colors ${tab === t ? "bg-ink text-ink-foreground" : "text-muted-foreground"}`,
								children: t
							}, t))
						}),
						children: tab === "payment" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[900px] text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
									className: "border-b border-border bg-surface-2 text-left",
									children: [
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
										""
									].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "label-cap whitespace-nowrap px-3 py-2.5",
										children: h
									}, h))
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3",
											children: l.no
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num whitespace-nowrap px-3 py-3",
											children: l.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "whitespace-nowrap px-3 py-3",
											children: [
												l.main,
												" / ",
												l.service
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "whitespace-nowrap px-3 py-3",
											children: l.procedure
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right text-muted-foreground",
											children: money(l.rate)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right",
											children: money(l.bill)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right font-semibold text-primary",
											children: money(l.payable)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right text-muted-foreground",
											children: "0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right text-muted-foreground",
											children: "0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right text-muted-foreground",
											children: "0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "grid size-7 place-items-center rounded-lg border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											})
										})
									]
								}, l.no)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-surface-2 font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											colSpan: 5,
											children: "Total"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right",
											children: money(totals.bill)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right text-primary",
											children: money(totals.payable)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right",
											children: "0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right",
											children: "0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "num px-3 py-3 text-right",
											children: "0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
									]
								})] })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add line item"]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground",
							children: [
								"No ",
								tab,
								" entries recorded for this claim yet."
							]
						})
					})
				]
			}), docMode === "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsPanel, {
					mode: docMode,
					onModeChange: setDocMode
				})
			}) : null]
		}), docMode !== "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsPanel, {
			mode: docMode,
			onModeChange: setDocMode
		}) : null]
	});
}
//#endregion
export { NewClaim as component };
