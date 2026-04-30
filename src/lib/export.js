import { ROLES } from "../data/roles.js";
import { INFRA } from "../data/infra.js";
import { STACK } from "../data/stack.js";
import { AI_PROVIDERS } from "../data/ai.js";
import { fmtUSD, fmtMXN } from "./format.js";
import { getRoleMonthlyMXN, getStackCost, getAICost } from "./cost.js";

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadTXT(filename, content) {
  downloadBlob(filename, content, "text/plain;charset=utf-8");
}

export function downloadJSON(filename, payload) {
  downloadBlob(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

export function exportTXT({
  project, costs, fx, months, margin, contingency,
  teamCount, teamSeniority,
  infraOn, infraQty,
  stackOn, stackQty, stackVariable,
  aiOn, aiUsage,
  sellers,
  customHumans, customInfra, customStack, customAI,
  fiscalLabel,
}) {
  const sep = "=".repeat(64);
  const div = "-".repeat(64);
  const pad = (text, size) => String(text).padEnd(size);
  const rpad = (text, size) => String(text).padStart(size);
  const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });

  let txt = `${sep}\nCOSTCALC - ESTIMACION DE PROYECTO TECNOLOGICO\n${sep}\n\n`;
  txt += `Proyecto     : ${project.name || "(sin nombre)"}\n`;
  txt += `Cliente      : ${project.client || "(sin especificar)"}\n`;
  txt += `Version      : ${project.version || "1.0"}\n`;
  txt += `Fecha        : ${today}\n`;
  if (project.description) txt += `Descripcion  : ${project.description}\n`;

  txt += `\n${div}\nPARAMETROS\n${div}\n`;
  txt += `Meses            : ${months}\n`;
  txt += `Tipo de cambio   : ${fx} MXN/USD\n`;
  txt += `Contingencia     : ${contingency}%\n`;
  txt += `Margen           : ${margin}%\n`;
  txt += `Regimen fiscal   : ${fiscalLabel || "N/D"}\n`;

  const activeTeam = ROLES.filter((role) => (teamCount[role.id] || 0) > 0);
  if (activeTeam.length > 0 || customHumans.length > 0) {
    txt += `\n${div}\nCAPITAL HUMANO\n${div}\n`;
    activeTeam.forEach((role) => {
      const count = teamCount[role.id] || 0;
      const seniority = teamSeniority[role.id] || "mid";
      const monthly = getRoleMonthlyMXN(role, seniority);
      txt += `${pad(role.label, 34)} ${pad(seniority, 8)} x${count} ${rpad(fmtMXN(monthly * count), 14)}\n`;
    });
    customHumans.forEach((entry) => {
      txt += `${pad(entry.label, 34)} ${pad("custom", 8)} x1 ${rpad(fmtMXN(entry.mxn), 14)}\n`;
    });
    txt += `${pad("Subtotal mensual", 46)} ${rpad(fmtMXN(costs.humanMXN), 14)}\n`;
  }

  const activeInfra = INFRA.filter((item) => infraOn[item.id]);
  if (activeInfra.length > 0 || customInfra.length > 0) {
    txt += `\n${div}\nINFRAESTRUCTURA\n${div}\n`;
    activeInfra.forEach((item) => {
      const quantity = infraQty[item.id] || 1;
      const monthly = item.usd * quantity;
      txt += `${pad(item.label, 40)} x${pad(quantity, 3)} ${rpad(fmtUSD(monthly), 11)}\n`;
    });
    customInfra.forEach((entry) => {
      txt += `${pad(entry.label, 40)} ${rpad(fmtUSD(entry.usd), 11)}\n`;
    });
    txt += `${pad("Subtotal mensual", 50)} ${rpad(fmtUSD(costs.infraUSD), 11)}\n`;
  }

  const activeStack = STACK.filter((item) => stackOn[item.id]);
  if (activeStack.length > 0 || customStack.length > 0) {
    txt += `\n${div}\nSTACK & SAAS\n${div}\n`;
    activeStack.forEach((item) => {
      const monthly = getStackCost(item, stackQty, stackVariable);
      txt += `${pad(item.label, 40)} ${rpad(fmtUSD(monthly), 11)}\n`;
    });
    customStack.forEach((entry) => {
      txt += `${pad(entry.label, 40)} ${rpad(fmtUSD(entry.usd), 11)}\n`;
    });
    txt += `${pad("Subtotal mensual", 50)} ${rpad(fmtUSD(costs.stackUSD), 11)}\n`;
  }

  const activeAI = AI_PROVIDERS.filter((item) => aiOn[item.id]);
  if (activeAI.length > 0 || customAI.length > 0) {
    txt += `\n${div}\nIA & ML\n${div}\n`;
    activeAI.forEach((item) => {
      txt += `${pad(item.label, 40)} ${rpad(fmtUSD(getAICost(item, aiUsage)), 11)}\n`;
    });
    customAI.forEach((entry) => {
      txt += `${pad(entry.label, 40)} ${rpad(fmtUSD(entry.usd), 11)}\n`;
    });
    txt += `${pad("Subtotal mensual", 50)} ${rpad(fmtUSD(costs.aiUSD), 11)}\n`;
  }

  const activeSellers = sellers.filter((seller) => seller.name && seller.commPct > 0);
  if (activeSellers.length > 0) {
    txt += `\n${div}\nCOMISIONES\n${div}\n`;
    activeSellers.forEach((seller) => {
      const base = seller.appliesToNet ? costs.withCont : costs.withMargin;
      txt += `${pad(`${seller.name} (${seller.role})`, 40)} ${rpad(fmtUSD((base * seller.commPct) / 100), 11)}\n`;
    });
    txt += `${pad("Total comisiones", 50)} ${rpad(fmtUSD(costs.totalCommUSD), 11)}\n`;
  }

  txt += `\n${sep}\nRESUMEN FINANCIERO\n${sep}\n`;
  [
    ["Costo mensual operativo", costs.monthlyUSD],
    [`Costo base x ${months} meses`, costs.projectBase],
    [`Precio con contingencia ${contingency}%`, costs.withCont],
    [`Precio cliente con margen ${margin}%`, costs.withMargin],
    ["Utilidad bruta operativa", costs.grossProfit],
    ["Utilidad tras comisiones", costs.netAfterCommissions],
    ["Impuestos + PTU estimados", costs.estimatedTaxBurden],
    ["Utilidad neta estimada", costs.estimatedNet],
  ].forEach(([label, amount]) => {
    txt += `${pad(label, 42)} ${rpad(fmtUSD(amount), 11)} ${rpad(fmtMXN(amount * fx), 14)}\n`;
  });

  txt += `\nNota: la utilidad bruta operativa no incluye ISR, IVA, PTU ni retenciones.\n`;
  txt += `${sep}\nGenerado con COSTCALC - ${today}\n${sep}\n`;

  const slug = (project.name || "proyecto").toLowerCase().replace(/\s+/g, "-");
  downloadTXT(`estimacion-${slug}.txt`, txt);
}
