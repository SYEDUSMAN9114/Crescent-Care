import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Bell, E as Building2, T as ChevronDown, _ as FileStack, a as Search, c as Receipt, i as Settings, m as LayoutGrid, r as Stethoscope } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/claims-data-Cm40imDG.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/",
		label: "Overview",
		icon: LayoutGrid
	},
	{
		to: "/",
		label: "Claims",
		icon: FileStack
	},
	{
		to: "/",
		label: "Providers",
		icon: Stethoscope
	},
	{
		to: "/",
		label: "Policies",
		icon: Building2
	},
	{
		to: "/",
		label: "Payments",
		icon: Receipt
	}
];
function AppShell({ children, title, subtitle, actions }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col items-center gap-1 bg-ink py-5 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mb-6 grid size-11 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground",
					children: "iG"
				}),
				nav.map((item, i) => {
					const active = i === (path === "/" ? 1 : 1);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: `group relative grid size-11 place-items-center rounded-xl transition-colors ${active ? "bg-ink-foreground/10 text-ink-foreground" : "text-ink-muted hover:bg-ink-foreground/5 hover:text-ink-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
							className: "size-[18px]",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute left-14 z-40 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-ink-foreground opacity-0 shadow-lift transition-opacity group-hover:opacity-100",
							children: item.label
						})]
					}, item.label);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-auto grid size-11 place-items-center rounded-xl text-ink-muted hover:text-ink-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
						className: "size-[18px]",
						strokeWidth: 1.75
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-[76px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center gap-4 px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display tracking-tight",
								children: "Premier Insurance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground",
								children: "Health"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-2 hidden items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs text-muted-foreground md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5" }),
								"Search claim, policy, member",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: "ml-6 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px]",
									children: "⌘K"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted",
									children: ["Year 2026 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "relative grid size-8 place-items-center rounded-lg hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
										className: "size-4",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 border-l border-border pl-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-8 place-items-center rounded-full bg-ink text-[11px] font-semibold text-ink-foreground",
										children: "FK"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden leading-tight sm:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold",
											children: "Faizan Khan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: "Claims Officer"
										})]
									})]
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pb-16 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold",
						children: title
					}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: subtitle
					}) : null] }), actions]
				}), children]
			})]
		})]
	});
}
var claims = [
	{
		intimationNo: "PIHGCI0000126",
		entryNo: 1,
		status: "Revised",
		intimationDate: "02/01/2026",
		admitDate: "01/01/2026",
		claimant: "Expert Hazard and Waste Management Solutions",
		causeOfLoss: "Maternity C-Section",
		policyNo: "PIHGCDP00011/25",
		lossPayable: 8e4,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000126",
		entryNo: 2,
		status: "Revised",
		intimationDate: "02/01/2026",
		revisionDate: "18/01/2026",
		admitDate: "01/01/2026",
		claimant: "Expert Hazard and Waste Management Solutions",
		causeOfLoss: "Maternity C-Section",
		policyNo: "PIHGCDP00011/25",
		lossPayable: 8e4,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000126",
		entryNo: 3,
		status: "Full & Final",
		intimationDate: "02/01/2026",
		revisionDate: "20/01/2026",
		admitDate: "01/01/2026",
		claimant: "Expert Hazard and Waste Management Solutions",
		causeOfLoss: "Maternity C-Section",
		policyNo: "PIHGCDP00011/25",
		lossPayable: 73678,
		lossWithheld: 0,
		lossDeductable: 6420
	},
	{
		intimationNo: "PIHGCI0000226",
		entryNo: 1,
		status: "Revised",
		intimationDate: "02/01/2026",
		admitDate: "01/01/2026",
		claimant: "Expert Hazard and Waste Management Solutions",
		causeOfLoss: "Hospitalization",
		policyNo: "PIHGCDP00011/25",
		lossPayable: 3e4,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000226",
		entryNo: 2,
		status: "Revised",
		intimationDate: "02/01/2026",
		revisionDate: "18/01/2026",
		admitDate: "01/01/2026",
		claimant: "Expert Hazard and Waste Management Solutions",
		causeOfLoss: "Hospitalization",
		policyNo: "PIHGCDP00011/25",
		lossPayable: 27470,
		lossWithheld: 0,
		lossDeductable: 2670
	},
	{
		intimationNo: "PIHGCI0000226",
		entryNo: 3,
		status: "Full & Final",
		intimationDate: "02/01/2026",
		revisionDate: "23/01/2026",
		admitDate: "01/01/2026",
		claimant: "Expert Hazard and Waste Management Solutions",
		causeOfLoss: "Hospitalization",
		policyNo: "PIHGCDP00011/25",
		lossPayable: 27470,
		lossWithheld: 0,
		lossDeductable: 2670
	},
	{
		intimationNo: "PIHGCI0000326",
		entryNo: 1,
		status: "Revised",
		intimationDate: "02/01/2026",
		admitDate: "03/01/2026",
		claimant: "Ocean Network Express Pakistan (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00002/25",
		lossPayable: 50700,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000326",
		entryNo: 2,
		status: "Full & Final",
		intimationDate: "02/01/2026",
		revisionDate: "03/03/2026",
		admitDate: "03/01/2026",
		claimant: "Ocean Network Express Pakistan (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00002/25",
		lossPayable: 49900,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000426",
		entryNo: 1,
		status: "Revised",
		intimationDate: "05/01/2026",
		admitDate: "05/01/2026",
		claimant: "Afroze Textile Industries (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00004/25",
		lossPayable: 8e4,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000426",
		entryNo: 2,
		status: "Revised",
		intimationDate: "05/01/2026",
		revisionDate: "05/03/2026",
		admitDate: "06/01/2026",
		claimant: "Afroze Textile Industries (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00004/25",
		lossPayable: 19810,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000426",
		entryNo: 3,
		status: "Full & Final",
		intimationDate: "05/01/2026",
		revisionDate: "10/03/2026",
		admitDate: "06/01/2026",
		claimant: "Afroze Textile Industries (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00004/25",
		lossPayable: 19800,
		lossWithheld: 0,
		lossDeductable: 10
	},
	{
		intimationNo: "PIHGCI0000526",
		entryNo: 1,
		status: "Revised",
		intimationDate: "06/01/2026",
		admitDate: "06/01/2026",
		claimant: "Afroze Textile Industries (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00004/25",
		lossPayable: 5e4,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000526",
		entryNo: 2,
		status: "Posted",
		intimationDate: "06/01/2026",
		revisionDate: "07/01/2026",
		admitDate: "06/01/2026",
		claimant: "Afroze Textile Industries (Private) Limited",
		causeOfLoss: "Day Care",
		policyNo: "PIHGCDP00004/25",
		lossPayable: 0,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000626",
		entryNo: 1,
		status: "Posted",
		intimationDate: "06/01/2026",
		revisionDate: "31/08/2025",
		admitDate: "",
		claimant: "Ocean Network Express Pakistan (Private) Limited",
		causeOfLoss: "Out Patient Care",
		policyNo: "PIHGCDP00002/25",
		lossPayable: 0,
		lossWithheld: 0,
		lossDeductable: 0
	},
	{
		intimationNo: "PIHGCI0000726",
		entryNo: 1,
		status: "Revised",
		intimationDate: "08/01/2026",
		admitDate: "21/12/2025",
		claimant: "Ocean Network Express Pakistan (Private) Limited",
		causeOfLoss: "Maternity — Normal Delivery",
		policyNo: "PIHGCDP00002/25",
		lossPayable: 176719,
		lossWithheld: 0,
		lossDeductable: 2750
	}
];
var money = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
//#endregion
export { claims as n, money as r, AppShell as t };
