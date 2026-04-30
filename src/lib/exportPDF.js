import { ROLES } from "../data/roles.js";
import { INFRA } from "../data/infra.js";
import { STACK } from "../data/stack.js";
import { AI_PROVIDERS } from "../data/ai.js";
import { EQUIPOS } from "../data/equipos.js";
import { OFICINA } from "../data/oficina.js";
import { ADMIN } from "../data/admin.js";
import { BENEFICIOS } from "../data/beneficios.js";
import { MOVILIDAD } from "../data/movilidad.js";
import { fmtUSD, fmtMXN } from "./format.js";
import { getRoleMonthlyMXN, getStackCost, getAICost, getCatalogItemUSD } from "./cost.js";

// jsPDF y autoTable se cargan vía dynamic import dentro de exportPDF()
// y se exponen a los helpers vía esta ref de módulo.
let autoTable = null;

// Paleta consistente con la UI
const ACCENT = [12, 143, 87];     // verde
const NEUTRAL = [73, 88, 79];     // gris oscuro
const WARN = [196, 117, 18];      // ámbar
const DANGER = [199, 71, 71];     // rojo
const BG_ROW_ALT = [248, 246, 240];
const TEXT_FAINT = [124, 141, 132];

function header(doc, project) {
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("COSTCALC", 14, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Estimador de proyectos tech · MX 2026", 14, 18);

  const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(8);
  doc.text(today, 196, 13, { align: "right" });
  if (project.version) doc.text(`v${project.version}`, 196, 18, { align: "right" });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(project.name || "Proyecto sin nombre", 14, 32);
  if (project.client) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...NEUTRAL);
    doc.text(`Cliente: ${project.client}`, 14, 38);
  }
}

function footer(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...TEXT_FAINT);
    doc.text(`COSTCALC · ${i}/${pageCount}`, 14, 290);
    doc.text(
      "Generado automáticamente · cifras orientativas, verificar tasas fiscales antes de cotizar.",
      196,
      290,
      { align: "right" },
    );
  }
}

function paramsTable(doc, args) {
  const { mode, fx, months, margin, contingency, fiscalLabel, mxState, hoursPerMonth } = args;
  autoTable(doc, {
    startY: 45,
    theme: "plain",
    body: [
      [{ content: "PARÁMETROS", colSpan: 4, styles: { fontStyle: "bold", fillColor: ACCENT, textColor: 255, fontSize: 9, cellPadding: 2 } }],
      ["Modo", mode, "Tipo de cambio", `${fx} MXN/USD`],
      [
        mode === "freelancer" ? "Horas / mes" : mode === "project" ? "Meses" : "Horizonte",
        mode === "freelancer" ? hoursPerMonth : mode === "project" ? months : "mensual",
        "Margen",
        `${margin}%`,
      ],
      ["Contingencia", mode === "project" ? `${contingency}%` : "—", "Régimen fiscal", fiscalLabel || "N/D"],
      ["Estado (ISN)", mxState || "cdmx", "", ""],
    ],
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: NEUTRAL, cellWidth: 38 },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", textColor: NEUTRAL, cellWidth: 38 },
      3: { cellWidth: 55 },
    },
  });
}

function projectDescription(doc, description) {
  if (!description) return;
  const startY = doc.lastAutoTable.finalY + 4;
  doc.setFontSize(8);
  doc.setTextColor(...NEUTRAL);
  doc.setFont("helvetica", "italic");
  const lines = doc.splitTextToSize(description, 182);
  doc.text(lines, 14, startY);
  doc.setFont("helvetica", "normal");
  doc.lastAutoTable.finalY = startY + lines.length * 4;
}

function catalogSection(doc, { title, rows, subtotalUSD, fx }) {
  if (rows.length === 0) return;
  const body = rows.map((r) => [r.label, r.note || "", r.qty != null ? `×${r.qty}` : "", fmtUSD(r.usd), fmtMXN(r.usd * fx)]);
  body.push([
    { content: "Subtotal mensual", colSpan: 3, styles: { fontStyle: "bold", textColor: NEUTRAL } },
    { content: fmtUSD(subtotalUSD), styles: { fontStyle: "bold", textColor: ACCENT } },
    { content: fmtMXN(subtotalUSD * fx), styles: { fontStyle: "bold", textColor: ACCENT } },
  ]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 4,
    head: [[{ content: title, colSpan: 5, styles: { halign: "left", fillColor: ACCENT, textColor: 255, fontSize: 9 } }]],
    body,
    styles: { fontSize: 7.5, cellPadding: 1.5, overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 65, textColor: TEXT_FAINT, fontSize: 7 },
      2: { cellWidth: 14, halign: "right" },
      3: { cellWidth: 24, halign: "right" },
      4: { cellWidth: 25, halign: "right", textColor: TEXT_FAINT },
    },
    alternateRowStyles: { fillColor: BG_ROW_ALT },
  });
}

function summaryBlock(doc, { mode, fx, costs, months, margin, contingency }) {
  const isProject = mode === "project";
  const isFree = mode === "freelancer";
  const isOrg = mode === "org";
  const big = isFree ? `${fmtUSD(costs.hourlyClientUSD)}/hr`
    : isOrg ? `${fmtUSD(costs.monthlyWithMargin)}/mes`
    : fmtUSD(costs.withMargin);
  const subtitle = isFree ? `${fmtMXN(costs.hourlyClientUSD * fx)}/hr · costo ${fmtUSD(costs.hourlyCostUSD)}/hr`
    : isOrg ? `${fmtMXN(costs.monthlyWithMargin * fx)} · run rate anual ${fmtUSD(costs.annualWithMarginUSD)}`
    : fmtMXN(costs.withMargin * fx);
  const heading = isFree ? "TARIFA AL CLIENTE" : isOrg ? "REVENUE MÍNIMO MENSUAL" : "PRECIO FINAL";

  const startY = doc.lastAutoTable.finalY + 6;
  doc.setFillColor(...ACCENT);
  doc.rect(14, startY, 182, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(heading, 18, startY + 6);
  doc.setFontSize(18);
  doc.text(big, 18, startY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(subtitle, 18, startY + 20);
  doc.setTextColor(0, 0, 0);

  const detailY = startY + 26;
  const rows = isFree
    ? [
        ["Costo mensual", fmtUSD(costs.monthlyUSD)],
        [`Con margen ${margin}%`, fmtUSD(costs.monthlyWithMargin)],
        ["Costo por hora", fmtUSD(costs.hourlyCostUSD)],
        ["Facturación anual", fmtUSD(costs.annualWithMarginUSD)],
      ]
    : isOrg
    ? [
        ["Costo operativo / mes", fmtUSD(costs.monthlyUSD)],
        [`Con margen ${margin}%`, fmtUSD(costs.monthlyWithMargin)],
        ["Run rate anual base", fmtUSD(costs.annualRunRateUSD)],
        ["Run rate con margen", fmtUSD(costs.annualWithMarginUSD)],
      ]
    : [
        [`Base × ${months} meses`, fmtUSD(costs.projectBase)],
        [`Con contingencia ${contingency}%`, fmtUSD(costs.withCont)],
        ["Utilidad bruta operativa", fmtUSD(costs.grossProfit)],
        ["Utilidad neta estimada", fmtUSD(costs.estimatedNet)],
      ];

  autoTable(doc, {
    startY: detailY,
    theme: "grid",
    body: rows,
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: NEUTRAL, cellWidth: 91 },
      1: { halign: "right", textColor: ACCENT, cellWidth: 91 },
    },
  });
}

function financialReadingBlock(doc, { fx, costs }) {
  const startY = doc.lastAutoTable.finalY + 4;
  autoTable(doc, {
    startY,
    head: [[{ content: "LECTURA FINANCIERA", colSpan: 3, styles: { halign: "left", fillColor: NEUTRAL, textColor: 255, fontSize: 9 } }]],
    body: [
      ["Utilidad bruta operativa", fmtUSD(costs.grossProfit), fmtMXN(costs.grossProfit * fx)],
      ["Utilidad después de comisiones", fmtUSD(costs.netAfterCommissions), fmtMXN(costs.netAfterCommissions * fx)],
      ["Carga fiscal estimada", fmtUSD(costs.estimatedTaxBurden), fmtMXN(costs.estimatedTaxBurden * fx)],
      ["Utilidad neta estimada", fmtUSD(costs.estimatedNet), fmtMXN(costs.estimatedNet * fx)],
    ],
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: NEUTRAL, cellWidth: 90 },
      1: { halign: "right", cellWidth: 46 },
      2: { halign: "right", cellWidth: 46, textColor: TEXT_FAINT },
    },
  });
}

function fiscalAdvancedBlock(doc, { fx, costs }) {
  const hasAny = costs.extranjeroRetencionPeriodoUSD > 0
    || costs.ivaImportDigitalPeriodoUSD > 0
    || costs.ivaExportRecuperablePeriodoUSD > 0;
  if (!hasAny) return;
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 4,
    head: [[{ content: "FISCAL AVANZADO (PERÍODO)", colSpan: 3, styles: { halign: "left", fillColor: WARN, textColor: 255, fontSize: 9 } }]],
    body: [
      ["ISR estimado", fmtUSD(costs.estimatedISR), fmtMXN(costs.estimatedISR * fx)],
      ["PTU estimada", fmtUSD(costs.estimatedPTU), fmtMXN(costs.estimatedPTU * fx)],
      ["Retención extranjero", fmtUSD(costs.extranjeroRetencionPeriodoUSD), fmtMXN(costs.extranjeroRetencionPeriodoUSD * fx)],
      ["IVA importación digital (Netflix)", fmtUSD(costs.ivaImportDigitalPeriodoUSD), fmtMXN(costs.ivaImportDigitalPeriodoUSD * fx)],
      [
        "IVA exportación recuperable",
        fmtUSD(-costs.ivaExportRecuperablePeriodoUSD),
        fmtMXN(-costs.ivaExportRecuperablePeriodoUSD * fx),
      ],
    ],
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: NEUTRAL, cellWidth: 90 },
      1: { halign: "right", cellWidth: 46 },
      2: { halign: "right", cellWidth: 46, textColor: TEXT_FAINT },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 4 && data.column.index > 0) {
        data.cell.styles.textColor = ACCENT; // recovery rojo no, es bonificación
      }
    },
  });
}

export async function exportPDF(args) {
  // Dynamic import: jsPDF + autotable son ~400KB juntos. Solo se cargan
  // cuando el usuario hace clic en "Exportar .pdf", no en el bundle inicial.
  const [{ default: jsPDF }, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  autoTable = autoTableMod.default;

  const {
    project, costs, fx, mode, months, margin, contingency, hoursPerMonth,
    fiscalLabel, mxState,
    teamCount, teamSeniority,
    infraOn, infraQty,
    stackOn, stackQty, stackVariable,
    aiOn, aiUsage,
    equiposOn, equiposQty,
    oficinaOn, oficinaQty,
    adminOn, adminQty,
    benefOn, benefQty,
    movilOn, movilQty,
    customHumans, customInfra, customStack, customAI,
    sellers,
  } = args;

  const doc = new jsPDF({ format: "a4", unit: "mm" });

  header(doc, project);
  paramsTable(doc, { mode, fx, months, margin, contingency, fiscalLabel, mxState, hoursPerMonth });
  projectDescription(doc, project.description);

  // Capital humano
  const humanRows = [];
  ROLES.forEach((role) => {
    const count = teamCount[role.id] || 0;
    if (!count) return;
    const seniority = teamSeniority[role.id] || "mid";
    const monthlyMXN = getRoleMonthlyMXN(role, seniority);
    humanRows.push({ label: role.label, note: seniority.toUpperCase(), qty: count, usd: (monthlyMXN * count) / fx });
  });
  customHumans.forEach((entry) => humanRows.push({ label: entry.label, note: "custom", qty: 1, usd: entry.mxn / fx }));
  catalogSection(doc, { title: "CAPITAL HUMANO", rows: humanRows, subtotalUSD: costs.humanUSD, fx });

  // Catálogos genéricos
  const buildCatalogRows = (catalog, onMap, qtyMap, costForCustom = []) => {
    const rows = [];
    catalog.forEach((item) => {
      if (!onMap[item.id]) return;
      const baseUSD = getCatalogItemUSD(item, fx);
      let qty = qtyMap[item.id];
      if (qty === undefined || qty === null) qty = item.perPerson ? Math.max(1, costs.totalPersonas) : 1;
      rows.push({ label: item.label, note: item.note, qty, usd: baseUSD * qty });
    });
    costForCustom.forEach((entry) => rows.push({ label: entry.label, note: "custom", qty: 1, usd: entry.usd }));
    return rows;
  };

  catalogSection(doc, {
    title: "EQUIPOS",
    rows: buildCatalogRows(EQUIPOS, equiposOn, equiposQty),
    subtotalUSD: costs.equiposUSD, fx,
  });
  catalogSection(doc, {
    title: "OFICINA & CONECTIVIDAD",
    rows: buildCatalogRows(OFICINA, oficinaOn, oficinaQty),
    subtotalUSD: costs.oficinaUSD, fx,
  });
  catalogSection(doc, {
    title: "MOVILIDAD",
    rows: buildCatalogRows(MOVILIDAD, movilOn, movilQty),
    subtotalUSD: costs.movilUSD, fx,
  });

  // Infra (custom)
  const infraRows = [];
  INFRA.forEach((item) => {
    if (!infraOn[item.id]) return;
    const qty = infraQty[item.id] || 1;
    infraRows.push({ label: item.label, note: item.note, qty, usd: item.usd * qty });
  });
  customInfra.forEach((entry) => infraRows.push({ label: entry.label, note: "custom", qty: 1, usd: entry.usd }));
  catalogSection(doc, { title: "INFRAESTRUCTURA", rows: infraRows, subtotalUSD: costs.infraUSD, fx });

  // Stack
  const stackRows = [];
  STACK.forEach((item) => {
    if (!stackOn[item.id]) return;
    const cost = getStackCost(item, stackQty, stackVariable);
    stackRows.push({ label: item.label, note: item.unit, qty: stackQty[item.id] || 1, usd: cost });
  });
  customStack.forEach((entry) => stackRows.push({ label: entry.label, note: "custom", qty: 1, usd: entry.usd }));
  catalogSection(doc, { title: "STACK & SAAS", rows: stackRows, subtotalUSD: costs.stackUSD, fx });

  // AI
  const aiRows = [];
  AI_PROVIDERS.forEach((item) => {
    if (!aiOn[item.id]) return;
    aiRows.push({ label: item.label, note: item.note || item.billing, qty: 1, usd: getAICost(item, aiUsage) });
  });
  customAI.forEach((entry) => aiRows.push({ label: entry.label, note: "custom", qty: 1, usd: entry.usd }));
  catalogSection(doc, { title: "IA & ML", rows: aiRows, subtotalUSD: costs.aiUSD, fx });

  catalogSection(doc, {
    title: "BENEFICIOS",
    rows: buildCatalogRows(BENEFICIOS, benefOn, benefQty),
    subtotalUSD: costs.benefUSD, fx,
  });
  catalogSection(doc, {
    title: "ADMIN & LEGAL",
    rows: buildCatalogRows(ADMIN, adminOn, adminQty),
    subtotalUSD: costs.adminUSD, fx,
  });

  // Comisiones
  const activeSellers = sellers.filter((s) => s.name && s.commPct > 0);
  if (activeSellers.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 4,
      head: [[{ content: "COMISIONES", colSpan: 4, styles: { halign: "left", fillColor: ACCENT, textColor: 255, fontSize: 9 } }]],
      body: activeSellers
        .map((s) => {
          const base = s.appliesToNet ? costs.withCont : costs.withMargin;
          const estimate = (base * s.commPct) / 100;
          return [s.name, s.role, `${s.commPct}%`, fmtUSD(estimate)];
        })
        .concat([[
          { content: "Total comisiones", colSpan: 3, styles: { fontStyle: "bold", textColor: NEUTRAL } },
          { content: fmtUSD(costs.totalCommUSD), styles: { fontStyle: "bold", textColor: DANGER } },
        ]]),
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 60 },
        2: { cellWidth: 22, halign: "right" },
        3: { cellWidth: 30, halign: "right" },
      },
    });
  }

  summaryBlock(doc, { mode, fx, costs, months, margin, contingency });
  financialReadingBlock(doc, { fx, costs });
  fiscalAdvancedBlock(doc, { fx, costs });

  footer(doc);

  const slug = (project.name || "proyecto").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  doc.save(`estimacion-${slug}-${Date.now()}.pdf`);
}
