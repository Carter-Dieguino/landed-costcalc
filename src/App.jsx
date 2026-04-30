import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ROLES, ROLE_CATS, CARGA_SOCIAL_FACTOR } from "./data/roles.js";
import { INFRA, INFRA_CATS } from "./data/infra.js";
import { STACK, STACK_CATS } from "./data/stack.js";
import { AI_PROVIDERS, AI_CATS } from "./data/ai.js";
import { EQUIPOS, EQUIPOS_CATS } from "./data/equipos.js";
import { OFICINA, OFICINA_CATS } from "./data/oficina.js";
import { ADMIN, ADMIN_CATS } from "./data/admin.js";
import { BENEFICIOS, BENEFICIOS_CATS } from "./data/beneficios.js";
import { MOVILIDAD, MOVILIDAD_CATS } from "./data/movilidad.js";
import {
  REGIMENES,
  calcISRFisicaAnual,
  ISN_ESTADOS,
  getCargaSocialFactor,
  NOM_037,
  RETENCIONES_EXTRANJERO,
  IVA_IMPORT_DIGITAL,
  IVA_EXPORTACION,
  US_FEDERAL_2026,
  US_ESTATAL,
  MULTAS_SAT_COMUNES,
} from "./data/fiscal.js";

const DEFAULT_FX = 18.5;
const DEFAULT_PROJECT = { name: "", client: "", version: "1.0", description: "" };
const DEFAULT_SELLER = { id: 1, name: "", role: "Vendedor / BDR", commPct: 10, appliesToNet: false };
const FX_API_URL = "https://open.er-api.com/v6/latest/USD";
const CONFIG_VERSION = "2.0";

const MODE_OPTIONS = [
  { value: "freelancer", label: "Freelancer", desc: "Tarifa por hora basada en costos personales + margen." },
  { value: "project",    label: "Proyecto",   desc: "Costo total del proyecto incluyendo equipo, recursos y meses." },
  { value: "org",        label: "Organización", desc: "Burn rate mensual y run rate anual de la operación." },
];
const THEME_OPTIONS = [
  { value: "system", label: "Sistema" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const TABS = [
  { id: "human",    icon: "Equ",  label: "Capital Humano",  modes: ["freelancer", "project", "org"] },
  { id: "equipos",  icon: "HW",   label: "Equipos",         modes: ["freelancer", "project", "org"] },
  { id: "oficina",  icon: "Off",  label: "Oficina",         modes: ["freelancer", "project", "org"] },
  { id: "movil",    icon: "Mov",  label: "Movilidad",       modes: ["freelancer", "project", "org"] },
  { id: "infra",    icon: "Ops",  label: "Infra",           modes: ["freelancer", "project", "org"] },
  { id: "stack",    icon: "SaaS", label: "Stack",           modes: ["freelancer", "project", "org"] },
  { id: "ai",       icon: "AI",   label: "IA & ML",         modes: ["freelancer", "project", "org"] },
  { id: "benef",    icon: "Ben",  label: "Beneficios",      modes: ["project", "org"] },
  { id: "admin",    icon: "Adm",  label: "Admin & Legal",   modes: ["freelancer", "project", "org"] },
  { id: "comision", icon: "%",    label: "Comisiones",      modes: ["project", "org"] },
  { id: "fiscal",   icon: "SAT",  label: "Fiscal",          modes: ["freelancer", "project", "org"] },
  { id: "summary",  icon: "Sum",  label: "Resumen",         modes: ["freelancer", "project", "org"] },
];

const USAGE_STEPS_BY_MODE = {
  freelancer: [
    "Selecciona modo Freelancer y define horas/mes que cobras (160 = full-time típico).",
    "Activa solo TUS costos personales: laptop amortizada, internet, software, GMM, contador.",
    "Margen aquí es el % adicional sobre tu costo para llegar a la tarifa al cliente.",
    "Resumen: revisa la tarifa por hora mínima sostenible y la facturación anual implícita.",
  ],
  project: [
    "Define tipo de cambio, meses, margen y contingencia para este proyecto.",
    "Activa perfiles de equipo, infra, SaaS e IA; solo cuenta lo seleccionado.",
    "Usa costos variables x volumen o usuarios para aproximar el consumo real del mes.",
    "Resumen: utilidad bruta NO incluye impuestos. Utilidad neta los estima orientativamente.",
  ],
  org: [
    "Modo Organización: estás midiendo el burn mensual de la operación, no un proyecto puntual.",
    "Activa todo lo que pagas mes a mes: equipo de planta, infra y SaaS recurrente, IA en producción.",
    "El margen aquí es el buffer sobre el costo operativo para definir el revenue mínimo necesario.",
    "Resumen muestra burn mensual, run rate anual y carga fiscal estimada para sostener la operación.",
  ],
};

const fmtUSD = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Math.abs(value || 0) < 10 ? 2 : 0,
    maximumFractionDigits: Math.abs(value || 0) < 10 ? 3 : 0,
  }).format(value || 0);

const fmtMXN = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

const pct = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const money = (value) => Math.round(value * 100) / 100;
const emptyObject = Object.freeze({});

function sanitizeNumericInput(raw, mode) {
  const stripped = raw.replace(/,/g, ".").replace(mode === "decimal" ? /[^\d.]/g : /\D/g, "");
  if (mode !== "decimal") {
    return stripped;
  }

  const [head, ...tail] = stripped.split(".");
  return tail.length > 0 ? `${head}.${tail.join("")}` : head;
}

function NumericInput({
  value,
  onChange,
  min = 0,
  max = 9999999,
  step = 1,
  style = {},
  mode = "integer",
  placeholder,
}) {
  const [draft, setDraft] = useState(String(value ?? 0));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isFocused) {
      setDraft(String(value ?? 0));
    }
  }, [isFocused, value]);

  const commit = useCallback(
    (raw) => {
      const next = sanitizeNumericInput(raw, mode);
      if (next === "") {
        onChange(min <= 0 ? 0 : min);
        return;
      }
      const parsed = mode === "decimal" ? Number.parseFloat(next) : Number.parseInt(next, 10);
      if (Number.isNaN(parsed)) {
        onChange(min <= 0 ? 0 : min);
        return;
      }
      onChange(clamp(parsed, min, max));
    },
    [max, min, mode, onChange],
  );

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode={mode === "decimal" ? "decimal" : "numeric"}
      value={draft}
      placeholder={placeholder}
      onFocus={(event) => {
        setIsFocused(true);
        if ((value ?? 0) === 0) {
          event.target.select();
        }
        event.target.style.borderColor = "var(--accent)";
      }}
      onBlur={(event) => {
        setIsFocused(false);
        commit(draft);
        setDraft(String(value === 0 && draft === "" ? 0 : clamp(Number.parseFloat(draft || "0") || 0, min, max)));
        event.target.style.borderColor = "var(--border-strong)";
      }}
      onChange={(event) => {
        const next = sanitizeNumericInput(event.target.value, mode);
        setDraft(next);
        commit(next);
      }}
      onKeyDown={(event) => {
        if (["e", "E", "+", "-"].includes(event.key)) {
          event.preventDefault();
        }
      }}
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-strong)",
        color: "var(--accent)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        padding: "6px 9px",
        borderRadius: 8,
        outline: "none",
        width: 80,
        textAlign: "center",
        transition: "border-color 0.15s ease, background 0.15s ease",
        ...style,
      }}
    />
  );
}

function TextInput({ value, onChange, placeholder, style = {} }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onFocus={(event) => {
        event.target.style.borderColor = "var(--accent)";
      }}
      onBlur={(event) => {
        event.target.style.borderColor = "var(--border-strong)";
      }}
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-strong)",
        color: "var(--text-1)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        padding: "8px 10px",
        borderRadius: 8,
        outline: "none",
        ...style,
      }}
    />
  );
}

function SelectInput({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-strong)",
        color: "var(--text-1)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        padding: "6px 9px",
        borderRadius: 8,
        outline: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ActionButton({ label, onClick, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "var(--surface-1)", border: "var(--border-strong)", color: "var(--text-1)" },
    accent: { bg: "var(--accent)", border: "var(--accent)", color: "#08120d" },
    subtle: { bg: "transparent", border: "var(--border)", color: "var(--text-2)" },
  };
  const current = tones[tone] || tones.neutral;

  return (
    <button
      onClick={onClick}
      style={{
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        borderRadius: 999,
        padding: "8px 12px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </button>
  );
}

function SectionCard({ children, style = {} }) {
  return (
    <section
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "var(--shadow-soft)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function CatHeader({ label, hint }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>
        {label}
      </span>
      {hint ? <span style={{ fontSize: 10, color: "var(--text-3)" }}>{hint}</span> : null}
    </div>
  );
}

function SummaryMetric({ label, usd, mxn, color = "var(--text-1)", note }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--text-2)" }}>{label}</div>
        {note ? <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{note}</div> : null}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, color }}>{fmtUSD(usd)}</div>
        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(mxn)}</div>
      </div>
    </div>
  );
}

function BarRow({ label, usd, total, color }) {
  const width = total > 0 ? Math.max(2, pct(usd, total)) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
        <span style={{ color: "var(--text-2)" }}>{label}</span>
        <span style={{ color }}>{fmtUSD(usd)}/mes</span>
      </div>
      <div style={{ height: 7, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 999, transition: "width 0.35s ease" }} />
      </div>
      <div style={{ fontSize: 9, color: "var(--text-3)", marginTop: 3 }}>{pct(usd, total)}% del costo mensual</div>
    </div>
  );
}

function ToggleRow({ checked, onToggle, label, sublabel, note, right, controls }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        background: checked ? "var(--row-active)" : "transparent",
        transition: "background 0.15s ease",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          border: `1.5px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
          borderRadius: 5,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: checked ? "var(--accent-soft)" : "transparent",
        }}
      >
        {checked ? <span style={{ color: "var(--accent)", fontSize: 10 }}>+</span> : null}
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{label}</div>
        {sublabel ? <div style={{ fontSize: 10, color: "var(--text-3)" }}>{sublabel}</div> : null}
        {note ? <div style={{ fontSize: 10, color: "var(--warning)" }}>{note}</div> : null}
      </div>
      <div style={{ minWidth: 120, textAlign: "right" }}>
        <div style={{ fontSize: 12, color: checked ? "var(--accent)" : "var(--text-3)" }}>{right}</div>
      </div>
      {controls ? (
        <div onClick={(event) => event.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {controls}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({ label }) {
  return <div style={{ padding: "0 16px 14px", fontSize: 10, color: "var(--text-3)" }}>{label}</div>;
}

function CatalogTab({ catalog, cats, onMap, qtyMap, toggle, setQty, fx, totalPersonas, intro }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {intro ? (
        <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{intro}</div>
      ) : null}
      {cats.map((category) => (
        <SectionCard key={category}>
          <CatHeader label={category} />
          {catalog.filter((item) => item.cat === category).map((item) => {
            const baseUSD = getCatalogItemUSD(item, fx);
            let qty = qtyMap[item.id];
            if (qty === undefined || qty === null) qty = item.perPerson ? Math.max(1, totalPersonas) : 1;
            const totalUSD = baseUSD * qty;
            const baseLabel = typeof item.usd === "number"
              ? `${fmtUSD(item.usd)}/mes`
              : `${fmtMXN(item.mxn)}/mes`;
            return (
              <ToggleRow
                key={item.id}
                checked={Boolean(onMap[item.id])}
                onToggle={() => toggle(item.id)}
                label={item.label}
                sublabel={item.note}
                note={item.perPerson ? "Por persona — multiplica por personas activas" : null}
                right={onMap[item.id] ? `${fmtUSD(totalUSD)}/mes` : baseLabel}
                controls={
                  onMap[item.id] ? (
                    <>
                      <span style={{ fontSize: 10, color: "var(--text-3)" }}>x</span>
                      <NumericInput value={qty} onChange={(v) => setQty(item.id, v)} min={1} max={500} />
                      <div style={{ minWidth: 110, textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "var(--accent)" }}>{fmtUSD(totalUSD)}</div>
                        <div style={{ fontSize: 9, color: "var(--text-3)" }}>{fmtMXN(totalUSD * fx)}</div>
                      </div>
                    </>
                  ) : null
                }
              />
            );
          })}
        </SectionCard>
      ))}
    </div>
  );
}

function getRoleMonthlyMXN(role, seniority) {
  switch (seniority) {
    case "min":
      return role.minMXN;
    case "max":
      return role.maxMXN;
    default:
      return Math.round((role.minMXN + role.maxMXN) / 2);
  }
}

function getStackVariableState(variableState, item) {
  return (
    variableState[item.id] || {
      mode: item.unit?.includes("usuario") ? "per_user" : "usage",
      rate: item.unit?.includes("gratis") ? 0 : 0.1,
      quantity: item.unit?.includes("usuario") ? 5 : 1000,
      label: item.unit?.includes("usuario") ? "usuarios" : "unidades",
    }
  );
}

function getStackCost(item, stackQty, stackVariable) {
  if (item.usd > 0) {
    return money(item.usd * (stackQty[item.id] || 1));
  }
  const variable = getStackVariableState(stackVariable, item);
  if (variable.mode === "fixed") {
    return money(variable.rate);
  }
  return money(variable.rate * variable.quantity);
}

function getAIDefaultUsage(item) {
  if (item.billing === "monthly") {
    return { units: item.monthlyUSD || 0, tokensM: 0, outputTokensM: 0 };
  }
  if (item.billing === "usage") {
    return { units: item.defaultUnits || 100, tokensM: 0, outputTokensM: 0 };
  }
  return { units: 0, tokensM: 1, outputTokensM: 0.43 };
}

function getAIUsageState(aiUsage, item) {
  const stored = aiUsage[item.id];
  if (!stored) return getAIDefaultUsage(item);
  // Backwards compat: si no tiene outputTokensM, deriva del ratio histórico 0.43
  if (item.billing === "tokens" && stored.outputTokensM === undefined) {
    return { ...stored, outputTokensM: (stored.tokensM || 0) * 0.43 };
  }
  return stored;
}

function getAICost(item, aiUsage) {
  const usage = getAIUsageState(aiUsage, item);
  if (item.billing === "monthly") {
    return money(item.monthlyUSD || usage.units || 0);
  }
  if (item.billing === "usage") {
    return money((item.rateUSD || 0) * (usage.units || 0));
  }
  const inputM = usage.tokensM || 0;
  const outputM = usage.outputTokensM || 0;
  return money(inputM * (item.inputPer1M || 0) + outputM * (item.outputPer1M || 0));
}

function getCatalogItemUSD(item, fx) {
  if (typeof item.usd === "number") return item.usd;
  if (typeof item.mxn === "number") return item.mxn / (fx || 1);
  return 0;
}

function sumCatalog(catalog, onMap, qtyMap, fx, totalPersonas = 0) {
  let sumUSD = 0;
  catalog.forEach((item) => {
    if (!onMap[item.id]) return;
    const baseUSD = getCatalogItemUSD(item, fx);
    let qty = qtyMap[item.id];
    if (qty === undefined || qty === null) {
      qty = item.perPerson ? Math.max(1, totalPersonas) : 1;
    }
    sumUSD += baseUSD * qty;
  });
  return sumUSD;
}

function describeAIItem(item) {
  if (item.billing === "monthly") {
    return `Escenario mensual ${fmtUSD(item.monthlyUSD || 0)}${item.note ? ` · ${item.note}` : ""}`;
  }
  if (item.billing === "usage") {
    return `${fmtUSD(item.rateUSD || 0)} por ${item.unitLabel}${item.note ? ` · ${item.note}` : ""}`;
  }
  return `input ${fmtUSD(item.inputPer1M || 0)}/1M · output ${fmtUSD(item.outputPer1M || 0)}/1M${item.note ? ` · ${item.note}` : ""}`;
}

function downloadTXT(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportTXT({
  project,
  costs,
  fx,
  months,
  margin,
  contingency,
  teamCount,
  teamSeniority,
  infraOn,
  infraQty,
  stackOn,
  stackQty,
  stackVariable,
  aiOn,
  aiUsage,
  sellers,
  customHumans,
  customInfra,
  customStack,
  customAI,
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
  if (project.description) {
    txt += `Descripcion  : ${project.description}\n`;
  }

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

export default function App() {
  const [mode, setMode] = useState("project");
  const [hoursPerMonth, setHoursPerMonth] = useState(160);
  const [tab, setTab] = useState("human");
  const [themeMode, setThemeMode] = useState("system");
  const [fx, setFx] = useState(DEFAULT_FX);
  const [fxAuto, setFxAuto] = useState(true);
  const [fxStatus, setFxStatus] = useState("idle");
  const [fxUpdatedAt, setFxUpdatedAt] = useState(null);
  const [months, setMonths] = useState(3);
  const [margin, setMargin] = useState(30);
  const [contingency, setContingency] = useState(15);
  const [includeCargaSocial, setIncludeCargaSocial] = useState(true);
  const [mxState, setMxState] = useState("cdmx");
  const [aguinaldo30, setAguinaldo30] = useState(false);
  const [includePTUFactor, setIncludePTUFactor] = useState(true);
  const [includeNOM037, setIncludeNOM037] = useState(false);
  const [nom037MXN, setNom037MXN] = useState(NOM_037.defaultMXN);
  const [project, setProject] = useState(DEFAULT_PROJECT);
  const fileInputRef = useRef(null);

  const [teamCount, setTeamCount] = useState(emptyObject);
  const [teamSeniority, setTeamSeniority] = useState(emptyObject);
  const [infraOn, setInfraOn] = useState(emptyObject);
  const [infraQty, setInfraQty] = useState(emptyObject);
  const [stackOn, setStackOn] = useState(emptyObject);
  const [stackQty, setStackQty] = useState(emptyObject);
  const [stackVariable, setStackVariable] = useState(emptyObject);
  const [aiOn, setAiOn] = useState(emptyObject);
  const [aiUsage, setAiUsage] = useState(emptyObject);
  const [equiposOn, setEquiposOn] = useState(emptyObject);
  const [equiposQty, setEquiposQty] = useState(emptyObject);
  const [oficinaOn, setOficinaOn] = useState(emptyObject);
  const [oficinaQty, setOficinaQty] = useState(emptyObject);
  const [adminOn, setAdminOn] = useState(emptyObject);
  const [adminQty, setAdminQty] = useState(emptyObject);
  const [benefOn, setBenefOn] = useState(emptyObject);
  const [benefQty, setBenefQty] = useState(emptyObject);
  const [movilOn, setMovilOn] = useState(emptyObject);
  const [movilQty, setMovilQty] = useState(emptyObject);
  const [sellers, setSellers] = useState([DEFAULT_SELLER]);
  const [fiscalRegimen, setFiscalRegimen] = useState("pm_general");
  const [isrIncome, setIsrIncome] = useState(500000);
  // Fiscal avanzado
  const [extranjeroPagoUSD, setExtranjeroPagoUSD] = useState(0);
  const [extranjeroTratadoUSA, setExtranjeroTratadoUSA] = useState(true);
  const [extranjeroConcepto, setExtranjeroConcepto] = useState("regalia_software");
  const [ivaImportDigital, setIvaImportDigital] = useState(false);
  const [ivaExportacion, setIvaExportacion] = useState(false);
  const [usEstadoSel, setUsEstadoSel] = useState("us_ca");
  const [usSalaryUSD, setUsSalaryUSD] = useState(120000);

  const [customHumans, setCustomHumans] = useState([]);
  const [customHumanLabel, setCustomHumanLabel] = useState("");
  const [customHumanCost, setCustomHumanCost] = useState(0);
  const [customInfra, setCustomInfra] = useState([]);
  const [customInfraLabel, setCustomInfraLabel] = useState("");
  const [customInfraCost, setCustomInfraCost] = useState(0);
  const [customStack, setCustomStack] = useState([]);
  const [customStackLabel, setCustomStackLabel] = useState("");
  const [customStackCost, setCustomStackCost] = useState(0);
  const [customAI, setCustomAI] = useState([]);
  const [customAILabel, setCustomAILabel] = useState("");
  const [customAICost, setCustomAICost] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const applyTheme = () => {
      const resolved = themeMode === "system" ? (mediaQuery.matches ? "light" : "dark") : themeMode;
      document.documentElement.dataset.theme = resolved;
    };
    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [themeMode]);

  const fetchFx = useCallback(async () => {
    setFxStatus("loading");
    try {
      const response = await fetch(FX_API_URL);
      const data = await response.json();
      const rate = data?.rates?.MXN;
      if (typeof rate === "number" && rate > 0) {
        setFx(Math.round(rate * 100) / 100);
        setFxUpdatedAt(new Date().toISOString());
        setFxStatus("ok");
      } else {
        setFxStatus("error");
      }
    } catch (err) {
      setFxStatus("error");
    }
  }, []);

  useEffect(() => {
    if (fxAuto) {
      fetchFx();
    }
  }, [fxAuto, fetchFx]);

  useEffect(() => {
    const allowed = TABS.filter((t) => t.modes.includes(mode)).map((t) => t.id);
    if (!allowed.includes(tab)) {
      setTab(allowed[0] || "summary");
    }
  }, [mode, tab]);

  const prevModeRef = useRef(mode);
  useEffect(() => {
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;
    if (mode === "freelancer" && (fiscalRegimen === "pm_general" || fiscalRegimen === "resico_moral")) {
      setFiscalRegimen("resico_fisica");
    }
    if (mode === "org" && (fiscalRegimen === "resico_fisica" || fiscalRegimen === "pf_profesional")) {
      setFiscalRegimen("pm_general");
    }
  }, [mode, fiscalRegimen]);

  const setProj = useCallback((key, nextValue) => setProject((prev) => ({ ...prev, [key]: nextValue })), []);
  const setCount = useCallback((id, nextValue) => setTeamCount((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(nextValue)) })), []);
  const setSen = useCallback((id, nextValue) => setTeamSeniority((prev) => ({ ...prev, [id]: nextValue })), []);
  const toggleInfra = useCallback((id) => setInfraOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setInfraQuantity = useCallback((id, nextValue) => setInfraQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(nextValue)) })), []);
  const toggleStack = useCallback((id) => setStackOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setStackQuantity = useCallback((id, nextValue) => setStackQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(nextValue)) })), []);
  const updateStackVariable = useCallback((id, key, nextValue) => {
    setStackVariable((prev) => {
      const current = prev[id] || getStackVariableState(prev, { id, unit: "variable" });
      return { ...prev, [id]: { ...current, [key]: nextValue } };
    });
  }, []);
  const toggleAI = useCallback((id) => setAiOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const toggleEquipos = useCallback((id) => setEquiposOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setEquiposQuantity = useCallback((id, v) => setEquiposQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleOficina = useCallback((id) => setOficinaOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setOficinaQuantity = useCallback((id, v) => setOficinaQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleAdmin = useCallback((id) => setAdminOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setAdminQuantity = useCallback((id, v) => setAdminQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleBenef = useCallback((id) => setBenefOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setBenefQuantity = useCallback((id, v) => setBenefQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const toggleMovil = useCallback((id) => setMovilOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const setMovilQuantity = useCallback((id, v) => setMovilQty((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(v)) })), []);
  const updateAIUsage = useCallback((id, key, nextValue) => {
    setAiUsage((prev) => {
      const item = AI_PROVIDERS.find((provider) => provider.id === id);
      const current = item ? getAIUsageState(prev, item) : { units: 0, tokensM: 0 };
      return { ...prev, [id]: { ...current, [key]: nextValue } };
    });
  }, []);

  const addSeller = () => setSellers((prev) => [...prev, { id: Date.now(), name: "", role: "Vendedor", commPct: 10, appliesToNet: false }]);
  const removeSeller = (id) => setSellers((prev) => prev.filter((seller) => seller.id !== id));
  const updateSeller = (id, key, nextValue) =>
    setSellers((prev) => prev.map((seller) => (seller.id === id ? { ...seller, [key]: nextValue } : seller)));

  const addCustomHuman = () => {
    const label = customHumanLabel.trim();
    if (!label || customHumanCost <= 0) return;
    setCustomHumans((prev) => [...prev, { id: Date.now(), label, mxn: customHumanCost }]);
    setCustomHumanLabel("");
    setCustomHumanCost(0);
  };
  const addCustomInfra = () => {
    const label = customInfraLabel.trim();
    if (!label || customInfraCost <= 0) return;
    setCustomInfra((prev) => [...prev, { id: Date.now(), label, usd: customInfraCost }]);
    setCustomInfraLabel("");
    setCustomInfraCost(0);
  };
  const addCustomStack = () => {
    const label = customStackLabel.trim();
    if (!label || customStackCost <= 0) return;
    setCustomStack((prev) => [...prev, { id: Date.now(), label, usd: customStackCost }]);
    setCustomStackLabel("");
    setCustomStackCost(0);
  };
  const addCustomAI = () => {
    const label = customAILabel.trim();
    if (!label || customAICost <= 0) return;
    setCustomAI((prev) => [...prev, { id: Date.now(), label, usd: customAICost }]);
    setCustomAILabel("");
    setCustomAICost(0);
  };

  const removeCustomHuman = (id) => setCustomHumans((prev) => prev.filter((entry) => entry.id !== id));
  const removeCustomInfra = (id) => setCustomInfra((prev) => prev.filter((entry) => entry.id !== id));
  const removeCustomStack = (id) => setCustomStack((prev) => prev.filter((entry) => entry.id !== id));
  const removeCustomAI = (id) => setCustomAI((prev) => prev.filter((entry) => entry.id !== id));

  const selectedRegimen = REGIMENES.find((regimen) => regimen.id === fiscalRegimen) || REGIMENES[0];
  const isrAnual = calcISRFisicaAnual(isrIncome);

  const cargaSocialFactor = useMemo(() => {
    if (mode === "freelancer") return 0;
    return includeCargaSocial
      ? getCargaSocialFactor({ stateId: mxState, includePTU: includePTUFactor, aguinaldo30Dias: aguinaldo30 })
      : 0;
  }, [mode, includeCargaSocial, mxState, includePTUFactor, aguinaldo30]);

  const costs = useMemo(() => {
    let humanBaseMXN = 0;
    let totalPersonas = 0;
    ROLES.forEach((role) => {
      const count = teamCount[role.id] || 0;
      if (!count) return;
      const monthly = getRoleMonthlyMXN(role, teamSeniority[role.id] || "mid");
      humanBaseMXN += monthly * count;
      totalPersonas += count;
    });
    humanBaseMXN += customHumans.reduce((sum, entry) => sum + entry.mxn, 0);
    totalPersonas += customHumans.length;
    let humanMXN = humanBaseMXN * (1 + cargaSocialFactor);
    if (mode !== "freelancer" && includeNOM037 && totalPersonas > 0) {
      humanMXN += nom037MXN * totalPersonas;
    }

    let infraUSD = customInfra.reduce((sum, entry) => sum + entry.usd, 0);
    INFRA.forEach((item) => {
      if (infraOn[item.id]) {
        infraUSD += item.usd * (infraQty[item.id] || 1);
      }
    });

    let stackUSD = customStack.reduce((sum, entry) => sum + entry.usd, 0);
    STACK.forEach((item) => {
      if (stackOn[item.id]) {
        stackUSD += getStackCost(item, stackQty, stackVariable);
      }
    });

    let aiUSD = customAI.reduce((sum, entry) => sum + entry.usd, 0);
    AI_PROVIDERS.forEach((item) => {
      if (aiOn[item.id]) {
        aiUSD += getAICost(item, aiUsage);
      }
    });

    const equiposUSD = sumCatalog(EQUIPOS, equiposOn, equiposQty, fx, totalPersonas);
    const oficinaUSD = sumCatalog(OFICINA, oficinaOn, oficinaQty, fx, totalPersonas);
    const adminUSD   = sumCatalog(ADMIN,   adminOn,   adminQty,   fx, totalPersonas);
    const benefUSD   = sumCatalog(BENEFICIOS, benefOn, benefQty,  fx, totalPersonas);
    const movilUSD   = sumCatalog(MOVILIDAD, movilOn, movilQty,   fx, totalPersonas);

    const humanUSD = humanMXN / fx;
    const monthlyUSD = humanUSD + infraUSD + stackUSD + aiUSD + equiposUSD + oficinaUSD + adminUSD + benefUSD + movilUSD;

    // Métricas por modo
    const monthlyWithMargin = monthlyUSD * (1 + margin / 100);
    const annualRunRateUSD = monthlyUSD * 12;
    const annualWithMarginUSD = monthlyWithMargin * 12;
    const safeHours = hoursPerMonth > 0 ? hoursPerMonth : 1;
    const hourlyCostUSD = monthlyUSD / safeHours;
    const hourlyClientUSD = hourlyCostUSD * (1 + margin / 100);

    const projectBase = monthlyUSD * months;
    const withCont = projectBase * (1 + contingency / 100);
    const withMargin = withCont * (1 + margin / 100);
    const grossProfit = withMargin - withCont;
    const totalCommUSD = sellers
      .filter((seller) => seller.name && seller.commPct > 0)
      .reduce((sum, seller) => {
        const base = seller.appliesToNet ? withCont : withMargin;
        return sum + (base * seller.commPct) / 100;
      }, 0);
    const estimatedISR = grossProfit * selectedRegimen.isrEfectivo;
    const estimatedPTU = Object.values(teamCount).some((count) => count > 0) ? grossProfit * 0.1 : 0;
    const estimatedTaxBurden = estimatedISR + estimatedPTU;
    const netAfterCommissions = grossProfit - totalCommUSD;
    const estimatedNet = netAfterCommissions - estimatedTaxBurden;

    return {
      humanMXN,
      humanUSD,
      totalPersonas,
      infraUSD,
      stackUSD,
      aiUSD,
      equiposUSD,
      oficinaUSD,
      adminUSD,
      benefUSD,
      movilUSD,
      monthlyUSD,
      monthlyWithMargin,
      annualRunRateUSD,
      annualWithMarginUSD,
      hourlyCostUSD,
      hourlyClientUSD,
      projectBase,
      withCont,
      withMargin,
      grossProfit,
      totalCommUSD,
      estimatedISR,
      estimatedPTU,
      estimatedTaxBurden,
      netAfterCommissions,
      estimatedNet,
    };
  }, [
    aiOn,
    aiUsage,
    adminOn,
    adminQty,
    benefOn,
    benefQty,
    cargaSocialFactor,
    contingency,
    customAI,
    customHumans,
    customInfra,
    customStack,
    equiposOn,
    equiposQty,
    fx,
    hoursPerMonth,
    includeNOM037,
    mode,
    infraOn,
    infraQty,
    margin,
    months,
    nom037MXN,
    movilOn,
    movilQty,
    oficinaOn,
    oficinaQty,
    selectedRegimen.isrEfectivo,
    sellers,
    stackOn,
    stackQty,
    stackVariable,
    teamCount,
    teamSeniority,
  ]);

  const resetTab = useCallback(
    (tabId) => {
      switch (tabId) {
        case "human":
          setTeamCount(emptyObject);
          setTeamSeniority(emptyObject);
          setIncludeCargaSocial(true);
          setCustomHumans([]);
          setCustomHumanLabel("");
          setCustomHumanCost(0);
          break;
        case "infra":
          setInfraOn(emptyObject);
          setInfraQty(emptyObject);
          setCustomInfra([]);
          setCustomInfraLabel("");
          setCustomInfraCost(0);
          break;
        case "stack":
          setStackOn(emptyObject);
          setStackQty(emptyObject);
          setStackVariable(emptyObject);
          setCustomStack([]);
          setCustomStackLabel("");
          setCustomStackCost(0);
          break;
        case "ai":
          setAiOn(emptyObject);
          setAiUsage(emptyObject);
          setCustomAI([]);
          setCustomAILabel("");
          setCustomAICost(0);
          break;
        case "equipos":
          setEquiposOn(emptyObject);
          setEquiposQty(emptyObject);
          break;
        case "oficina":
          setOficinaOn(emptyObject);
          setOficinaQty(emptyObject);
          break;
        case "admin":
          setAdminOn(emptyObject);
          setAdminQty(emptyObject);
          break;
        case "benef":
          setBenefOn(emptyObject);
          setBenefQty(emptyObject);
          break;
        case "movil":
          setMovilOn(emptyObject);
          setMovilQty(emptyObject);
          break;
        case "comision":
          setSellers([DEFAULT_SELLER]);
          break;
        case "fiscal":
          setFiscalRegimen("pm_general");
          setIsrIncome(500000);
          setExtranjeroPagoUSD(0);
          setExtranjeroTratadoUSA(true);
          setExtranjeroConcepto("regalia_software");
          setIvaImportDigital(false);
          setIvaExportacion(false);
          setUsEstadoSel("us_ca");
          setUsSalaryUSD(120000);
          break;
        case "summary":
          setProject(DEFAULT_PROJECT);
          break;
        default:
          break;
      }
    },
    [],
  );

  const resetAll = useCallback(() => {
    setMode("project");
    setHoursPerMonth(160);
    setTab("human");
    setThemeMode("system");
    setFx(DEFAULT_FX);
    setMonths(3);
    setMargin(30);
    setContingency(15);
    setProject(DEFAULT_PROJECT);
    setMxState("cdmx");
    setAguinaldo30(false);
    setIncludePTUFactor(true);
    setIncludeNOM037(false);
    setNom037MXN(NOM_037.defaultMXN);
    ["human", "equipos", "oficina", "movil", "infra", "stack", "ai", "benef", "admin", "comision", "fiscal", "summary"].forEach(resetTab);
  }, [resetTab]);

  const exportConfig = useCallback(() => {
    const payload = {
      version: CONFIG_VERSION,
      exportedAt: new Date().toISOString(),
      project,
      params: { mode, fx, fxAuto, months, margin, contingency, hoursPerMonth },
      flags: { includeCargaSocial, mxState, aguinaldo30, includePTUFactor, includeNOM037, nom037MXN },
      team: { teamCount, teamSeniority, customHumans },
      infra: { infraOn, infraQty, customInfra },
      stack: { stackOn, stackQty, stackVariable, customStack },
      ai: { aiOn, aiUsage, customAI },
      equipos: { equiposOn, equiposQty },
      oficina: { oficinaOn, oficinaQty },
      admin:   { adminOn, adminQty },
      benef:   { benefOn, benefQty },
      movil:   { movilOn, movilQty },
      sellers,
      fiscal: {
        fiscalRegimen, isrIncome,
        extranjeroPagoUSD, extranjeroTratadoUSA, extranjeroConcepto,
        ivaImportDigital, ivaExportacion,
        usEstadoSel, usSalaryUSD,
      },
    };
    const slug = (project.name || "config").toLowerCase().replace(/\s+/g, "-");
    downloadJSON(`costcalc-${slug}-${Date.now()}.json`, payload);
  }, [
    mode, hoursPerMonth,
    project, fx, fxAuto, months, margin, contingency,
    includeCargaSocial, mxState, aguinaldo30, includePTUFactor, includeNOM037, nom037MXN,
    teamCount, teamSeniority, customHumans,
    infraOn, infraQty, customInfra,
    stackOn, stackQty, stackVariable, customStack,
    aiOn, aiUsage, customAI,
    equiposOn, equiposQty,
    oficinaOn, oficinaQty,
    adminOn, adminQty,
    benefOn, benefQty,
    movilOn, movilQty,
    sellers, fiscalRegimen, isrIncome,
    extranjeroPagoUSD, extranjeroTratadoUSA, extranjeroConcepto,
    ivaImportDigital, ivaExportacion,
    usEstadoSel, usSalaryUSD,
  ]);

  const importConfig = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data || typeof data !== "object") throw new Error("Archivo inválido");
        if (data.project) setProject({ ...DEFAULT_PROJECT, ...data.project });
        if (data.params) {
          if (typeof data.params.mode === "string" && MODE_OPTIONS.some((m) => m.value === data.params.mode)) setMode(data.params.mode);
          if (typeof data.params.hoursPerMonth === "number") setHoursPerMonth(data.params.hoursPerMonth);
          if (typeof data.params.fx === "number") setFx(data.params.fx);
          if (typeof data.params.fxAuto === "boolean") setFxAuto(data.params.fxAuto);
          if (typeof data.params.months === "number") setMonths(data.params.months);
          if (typeof data.params.margin === "number") setMargin(data.params.margin);
          if (typeof data.params.contingency === "number") setContingency(data.params.contingency);
        }
        if (data.flags) {
          if (typeof data.flags.includeCargaSocial === "boolean") setIncludeCargaSocial(data.flags.includeCargaSocial);
          if (typeof data.flags.mxState === "string") setMxState(data.flags.mxState);
          if (typeof data.flags.aguinaldo30 === "boolean") setAguinaldo30(data.flags.aguinaldo30);
          if (typeof data.flags.includePTUFactor === "boolean") setIncludePTUFactor(data.flags.includePTUFactor);
          if (typeof data.flags.includeNOM037 === "boolean") setIncludeNOM037(data.flags.includeNOM037);
          if (typeof data.flags.nom037MXN === "number") setNom037MXN(data.flags.nom037MXN);
        }
        if (data.team) {
          setTeamCount(data.team.teamCount || {});
          setTeamSeniority(data.team.teamSeniority || {});
          setCustomHumans(data.team.customHumans || []);
        }
        if (data.infra) {
          setInfraOn(data.infra.infraOn || {});
          setInfraQty(data.infra.infraQty || {});
          setCustomInfra(data.infra.customInfra || []);
        }
        if (data.stack) {
          setStackOn(data.stack.stackOn || {});
          setStackQty(data.stack.stackQty || {});
          setStackVariable(data.stack.stackVariable || {});
          setCustomStack(data.stack.customStack || []);
        }
        if (data.ai) {
          setAiOn(data.ai.aiOn || {});
          setAiUsage(data.ai.aiUsage || {});
          setCustomAI(data.ai.customAI || []);
        }
        if (data.equipos) {
          setEquiposOn(data.equipos.equiposOn || {});
          setEquiposQty(data.equipos.equiposQty || {});
        }
        if (data.oficina) {
          setOficinaOn(data.oficina.oficinaOn || {});
          setOficinaQty(data.oficina.oficinaQty || {});
        }
        if (data.admin) {
          setAdminOn(data.admin.adminOn || {});
          setAdminQty(data.admin.adminQty || {});
        }
        if (data.benef) {
          setBenefOn(data.benef.benefOn || {});
          setBenefQty(data.benef.benefQty || {});
        }
        if (data.movil) {
          setMovilOn(data.movil.movilOn || {});
          setMovilQty(data.movil.movilQty || {});
        }
        if (Array.isArray(data.sellers) && data.sellers.length > 0) setSellers(data.sellers);
        if (data.fiscal) {
          if (typeof data.fiscal.fiscalRegimen === "string") setFiscalRegimen(data.fiscal.fiscalRegimen);
          if (typeof data.fiscal.isrIncome === "number") setIsrIncome(data.fiscal.isrIncome);
          if (typeof data.fiscal.extranjeroPagoUSD === "number") setExtranjeroPagoUSD(data.fiscal.extranjeroPagoUSD);
          if (typeof data.fiscal.extranjeroTratadoUSA === "boolean") setExtranjeroTratadoUSA(data.fiscal.extranjeroTratadoUSA);
          if (typeof data.fiscal.extranjeroConcepto === "string") setExtranjeroConcepto(data.fiscal.extranjeroConcepto);
          if (typeof data.fiscal.ivaImportDigital === "boolean") setIvaImportDigital(data.fiscal.ivaImportDigital);
          if (typeof data.fiscal.ivaExportacion === "boolean") setIvaExportacion(data.fiscal.ivaExportacion);
          if (typeof data.fiscal.usEstadoSel === "string") setUsEstadoSel(data.fiscal.usEstadoSel);
          if (typeof data.fiscal.usSalaryUSD === "number") setUsSalaryUSD(data.fiscal.usSalaryUSD);
        }
      } catch (err) {
        alert(`No se pudo cargar la configuración: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }, []);

  const triggerImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) importConfig(file);
      event.target.value = "";
    },
    [importConfig],
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid var(--border)", backdropFilter: "blur(14px)", background: "var(--header-bg)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ maxWidth: 520 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-0.05em" }}>
                  COST<span style={{ color: "var(--accent)" }}>CALC</span>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>MX estimator</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6, lineHeight: 1.6 }}>
                Calculadora operativa para cotizar software, nube, SaaS, IA y fiscalidad de forma mas realista.
              </div>
              <div style={{ marginTop: 10, display: "inline-flex", gap: 4, padding: 3, border: "1px solid var(--border)", borderRadius: 999, background: "var(--surface-0)" }}>
                {MODE_OPTIONS.map((option) => {
                  const active = mode === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      title={option.desc}
                      style={{
                        border: "none",
                        background: active ? "var(--accent)" : "transparent",
                        color: active ? "#08120d" : "var(--text-2)",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                  <span>TC MXN/USD</span>
                  <button
                    onClick={() => { setFxAuto(true); fetchFx(); }}
                    title="Actualizar TC en vivo"
                    style={{ background: "transparent", border: "none", color: fxStatus === "ok" ? "var(--accent)" : fxStatus === "loading" ? "var(--warning)" : fxStatus === "error" ? "var(--danger)" : "var(--text-3)", fontSize: 9, cursor: "pointer", padding: 0 }}
                  >
                    {fxStatus === "loading" ? "..." : fxStatus === "ok" ? "LIVE" : fxStatus === "error" ? "ERR" : "AUTO"}
                  </button>
                </div>
                <NumericInput
                  value={fx}
                  onChange={(v) => { setFx(v); setFxAuto(false); }}
                  min={10}
                  max={30}
                  step={0.1}
                  mode="decimal"
                />
              </div>
              {mode === "freelancer" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>HRS / MES</div>
                  <NumericInput value={hoursPerMonth} onChange={setHoursPerMonth} min={1} max={400} />
                </div>
              ) : mode === "project" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>MESES</div>
                  <NumericInput value={months} onChange={setMonths} min={1} max={60} />
                </div>
              ) : null}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>MARGEN %</div>
                <NumericInput value={margin} onChange={setMargin} min={0} max={200} />
              </div>
              {mode === "project" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>CONTINGENCIA %</div>
                  <NumericInput value={contingency} onChange={setContingency} min={0} max={50} />
                </div>
              ) : null}

              <div style={{ minWidth: 140, paddingLeft: 12, borderLeft: "1px solid var(--border)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>
                  {mode === "freelancer" ? "TARIFA / HORA" : mode === "org" ? "BURN MENSUAL" : "COSTO MENSUAL"}
                </div>
                <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 900, color: "var(--accent)" }}>
                  {mode === "freelancer" ? fmtUSD(costs.hourlyClientUSD) : mode === "org" ? fmtUSD(costs.monthlyWithMargin) : fmtUSD(costs.monthlyUSD)}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-3)" }}>
                  {mode === "freelancer"
                    ? `${fmtMXN(costs.hourlyClientUSD * fx)}/hr · costo ${fmtUSD(costs.hourlyCostUSD)}`
                    : mode === "org"
                    ? `Anual ${fmtUSD(costs.annualWithMarginUSD)}`
                    : fmtMXN(costs.monthlyUSD * fx)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", overflowX: "auto", gap: 4, paddingBottom: 2 }}>
              {TABS.filter((t) => t.modes.includes(mode)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  style={{
                    border: "none",
                    background: tab === item.id ? "var(--surface-1)" : "transparent",
                    color: tab === item.id ? "var(--accent)" : "var(--text-3)",
                    padding: "9px 12px",
                    borderRadius: 999,
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                    boxShadow: tab === item.id ? "inset 0 0 0 1px var(--border)" : "none",
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <SelectInput value={themeMode} onChange={setThemeMode} options={THEME_OPTIONS} style={{ minWidth: 110 }} />
              <ActionButton label="Limpiar pestana" onClick={() => resetTab(tab)} tone="subtle" />
              <ActionButton label="Limpiar todo" onClick={resetAll} tone="accent" />
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: "0 auto", width: "100%", padding: "22px 20px 40px", display: "grid", gap: 18 }}>
        <SectionCard style={{ background: "var(--hero-bg)", borderColor: "var(--hero-border)" }}>
          <div style={{ padding: "18px 18px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Modo {MODE_OPTIONS.find((m) => m.value === mode)?.label}</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--text-1)", marginTop: 2 }}>
                  {mode === "freelancer" ? "Tarifa por hora sostenible" : mode === "org" ? "Burn rate de la operación" : "Cotización por proyecto"}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-2)" }}>Tema actual: {themeMode === "system" ? "Sistema" : themeMode}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {(USAGE_STEPS_BY_MODE[mode] || USAGE_STEPS_BY_MODE.project).map((step, index) => (
                <div key={step} style={{ padding: 12, borderRadius: 14, background: "var(--surface-0)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9, color: "var(--accent)", letterSpacing: "0.16em", marginBottom: 6 }}>PASO 0{index + 1}</div>
                  <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.6 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {tab === "human" ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              {mode === "freelancer"
                ? "Modo Freelancer · selecciona TU rol y mete tu objetivo de ingreso bruto mensual"
                : "Sueldos de mercado México 2026 · carga social desglosada"}
            </div>
            {mode !== "freelancer" ? (
            <SectionCard>
              <CatHeader label="Carga social y región" hint={includeCargaSocial ? `Factor real ${(cargaSocialFactor * 100).toFixed(1)}%` : "Sin carga social"} />
              <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, alignItems: "end" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                  <input type="checkbox" checked={includeCargaSocial} onChange={(event) => setIncludeCargaSocial(event.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  Incluir carga social MX
                </label>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>ESTADO (ISN)</div>
                  <SelectInput
                    value={mxState}
                    onChange={setMxState}
                    options={ISN_ESTADOS.map((s) => ({ value: s.id, label: `${s.label} · ${(s.tasa * 100).toFixed(2)}%` }))}
                    style={{ width: "100%" }}
                  />
                </div>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                  <input type="checkbox" checked={aguinaldo30} onChange={(event) => setAguinaldo30(event.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  Aguinaldo 30 días (costumbre tech)
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                  <input type="checkbox" checked={includePTUFactor} onChange={(event) => setIncludePTUFactor(event.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  Provisionar PTU (10% util.)
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                  <input type="checkbox" checked={includeNOM037} onChange={(event) => setIncludeNOM037(event.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  NOM-037 home office (obligatoria si {">"}40% remoto)
                </label>
                {includeNOM037 ? (
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>SUBSIDIO MXN/PERSONA/MES</div>
                    <NumericInput value={nom037MXN} onChange={setNom037MXN} min={0} max={10000} style={{ width: "100%" }} />
                  </div>
                ) : null}
              </div>
              <div style={{ padding: "0 16px 14px", fontSize: 10, color: "var(--text-3)", lineHeight: 1.7 }}>
                Desglose: IMSS 18.2% · INFONAVIT 5.4% · Aguinaldo {aguinaldo30 ? "8.3%" : "4.2%"} · Prima vac 0.8%{includePTUFactor ? " · PTU 4.2%" : ""} · ISN {(ISN_ESTADOS.find((s) => s.id === mxState)?.tasa * 100 || 3).toFixed(2)}%. CEAV escalonada hasta 2030. Verificar tasas anualmente.
              </div>
            </SectionCard>
            ) : (
            <SectionCard>
              <CatHeader label="Modo Freelancer" hint="Sin relación patronal" />
              <div style={{ padding: "12px 16px", fontSize: 11, color: "var(--text-2)", lineHeight: 1.7 }}>
                Como freelancer no aplican IMSS patronal, INFONAVIT, ISN, aguinaldo ni PTU. Tu fiscalidad va por la pestaña <strong style={{ color: "var(--accent)" }}>Fiscal MX</strong> (RESICO PF, PF Honorarios). Selecciona <em>tu</em> perfil más abajo y mete el ingreso bruto mensual al que apuntas; el costo real lo defines con infra, software y administración personal en las otras pestañas.
              </div>
            </SectionCard>
            )}

            {ROLE_CATS.map((category) => (
              <SectionCard key={category}>
                <CatHeader label={category} />
                {ROLES.filter((role) => role.cat === category).map((role) => {
                  const count = teamCount[role.id] || 0;
                  const seniority = teamSeniority[role.id] || "mid";
                  const baseMonthly = getRoleMonthlyMXN(role, seniority);
                  const effectiveMonthly = baseMonthly * (1 + cargaSocialFactor);
                  return (
                    <div key={role.id} style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1fr) 150px 120px 120px 85px 120px", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{role.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(role.minMXN)} - {fmtMXN(role.maxMXN)}</div>
                      </div>
                      <SelectInput
                        value={seniority}
                        onChange={(nextValue) => setSen(role.id, nextValue)}
                        options={[
                          { value: "min", label: "Junior" },
                          { value: "mid", label: "Mid" },
                          { value: "max", label: "Senior" },
                        ]}
                      />
                      <div style={{ fontSize: 11, color: "var(--text-2)", textAlign: "right" }}>
                        {fmtMXN(effectiveMonthly)}/mes
                        <div style={{ fontSize: 9, color: "var(--text-3)" }}>{fmtUSD(effectiveMonthly / fx)}</div>
                      </div>
                      <NumericInput value={count} onChange={(nextValue) => setCount(role.id, nextValue)} min={0} max={30} />
                      <div style={{ fontSize: 10, color: "var(--text-3)", textAlign: "center" }}>personas</div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: count > 0 ? "var(--accent)" : "var(--text-3)" }}>{count > 0 ? fmtMXN(effectiveMonthly * count) : "-"}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{count > 0 ? fmtUSD((effectiveMonthly * count) / fx) : ""}</div>
                      </div>
                    </div>
                  );
                })}
              </SectionCard>
            ))}

            <SectionCard>
              <CatHeader label="Perfiles personalizados" hint="MXN/mes" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
                <TextInput value={customHumanLabel} onChange={setCustomHumanLabel} placeholder="Nombre del perfil" style={{ flex: 1, minWidth: 220 }} />
                <NumericInput value={customHumanCost} onChange={setCustomHumanCost} min={0} max={500000} style={{ width: 120 }} />
                <ActionButton label="Agregar" onClick={addCustomHuman} tone="accent" />
              </div>
              {customHumans.length > 0 ? (
                <div style={{ padding: "0 16px 14px" }}>
                  {customHumans.map((entry) => (
                    <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(entry.mxn)} / {fmtUSD(entry.mxn / fx)}</div>
                      </div>
                      <ActionButton label="Eliminar" onClick={() => removeCustomHuman(entry.id)} tone="subtle" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="Sin perfiles personalizados." />
              )}
            </SectionCard>

            <SectionCard>
              <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Total mensual</div>
                  <div style={{ fontFamily: "var(--display)", fontSize: 24, color: "var(--accent)" }}>{fmtMXN(costs.humanMXN)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>{fmtUSD(costs.humanUSD)}/mes</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>Incluye prestaciones si el switch esta activo</div>
                </div>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {tab === "infra" ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Infra mensual de referencia · incluye Cloudflare Domains prorrateado</div>
            {INFRA_CATS.map((category) => (
              <SectionCard key={category}>
                <CatHeader label={category} />
                {INFRA.filter((item) => item.cat === category).map((item) => (
                  <ToggleRow
                    key={item.id}
                    checked={Boolean(infraOn[item.id])}
                    onToggle={() => toggleInfra(item.id)}
                    label={item.label}
                    sublabel={item.note}
                    right={`${fmtUSD(item.usd)}/mes`}
                    controls={
                      infraOn[item.id] ? (
                        <>
                          <span style={{ fontSize: 10, color: "var(--text-3)" }}>x</span>
                          <NumericInput value={infraQty[item.id] || 1} onChange={(nextValue) => setInfraQuantity(item.id, nextValue)} min={1} max={200} />
                          <div style={{ minWidth: 110, textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "var(--accent)" }}>{fmtUSD(item.usd * (infraQty[item.id] || 1))}</div>
                            <div style={{ fontSize: 9, color: "var(--text-3)" }}>{fmtMXN(item.usd * (infraQty[item.id] || 1) * fx)}</div>
                          </div>
                        </>
                      ) : null
                    }
                  />
                ))}
              </SectionCard>
            ))}

            <SectionCard>
              <CatHeader label="Infra personalizada" hint="USD/mes" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
                <TextInput value={customInfraLabel} onChange={setCustomInfraLabel} placeholder="Proveedor / servicio" style={{ flex: 1, minWidth: 220 }} />
                <NumericInput value={customInfraCost} onChange={setCustomInfraCost} min={0} max={20000} mode="decimal" style={{ width: 120 }} />
                <ActionButton label="Agregar" onClick={addCustomInfra} tone="accent" />
              </div>
              {customInfra.length > 0 ? (
                <div style={{ padding: "0 16px 14px" }}>
                  {customInfra.map((entry) => (
                    <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(entry.usd)} / {fmtMXN(entry.usd * fx)}</div>
                      </div>
                      <ActionButton label="Eliminar" onClick={() => removeCustomInfra(entry.id)} tone="subtle" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="Sin infraestructura personalizada." />
              )}
            </SectionCard>
          </div>
        ) : null}

        {tab === "stack" ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              SaaS, BaaS y serverless. Los costos variables ahora pueden modelarse por usuario, consumo o monto fijo.
            </div>
            {STACK_CATS.map((category) => (
              <SectionCard key={category}>
                <CatHeader label={category} />
                {STACK.filter((item) => item.cat === category).map((item) => {
                  const variable = getStackVariableState(stackVariable, item);
                  const cost = getStackCost(item, stackQty, stackVariable);
                  const isVariable = item.usd === 0;
                  return (
                    <ToggleRow
                      key={item.id}
                      checked={Boolean(stackOn[item.id])}
                      onToggle={() => toggleStack(item.id)}
                      label={item.label}
                      sublabel={item.unit}
                      note={item.note}
                      right={stackOn[item.id] ? `${fmtUSD(cost)}/mes` : item.usd > 0 ? `${fmtUSD(item.usd)}/mes` : "variable"}
                      controls={
                        stackOn[item.id] ? (
                          isVariable ? (
                            <>
                              <SelectInput
                                value={variable.mode}
                                onChange={(nextValue) => updateStackVariable(item.id, "mode", nextValue)}
                                options={[
                                  { value: "per_user", label: "Por usuario" },
                                  { value: "usage", label: "Por consumo" },
                                  { value: "fixed", label: "Monto fijo" },
                                ]}
                              />
                              <NumericInput
                                value={variable.rate}
                                onChange={(nextValue) => updateStackVariable(item.id, "rate", nextValue)}
                                min={0}
                                max={100000}
                                mode="decimal"
                                style={{ width: 92 }}
                              />
                              {variable.mode !== "fixed" ? (
                                <NumericInput
                                  value={variable.quantity}
                                  onChange={(nextValue) => updateStackVariable(item.id, "quantity", nextValue)}
                                  min={0}
                                  max={1000000}
                                  mode="decimal"
                                  style={{ width: 92 }}
                                />
                              ) : null}
                              <TextInput
                                value={variable.label}
                                onChange={(nextValue) => updateStackVariable(item.id, "label", nextValue)}
                                placeholder="unidad"
                                style={{ width: 92 }}
                              />
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: 10, color: "var(--text-3)" }}>x</span>
                              <NumericInput value={stackQty[item.id] || 1} onChange={(nextValue) => setStackQuantity(item.id, nextValue)} min={1} max={500} />
                            </>
                          )
                        ) : null
                      }
                    />
                  );
                })}
              </SectionCard>
            ))}

            <SectionCard>
              <CatHeader label="Stack personalizado" hint="USD/mes" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
                <TextInput value={customStackLabel} onChange={setCustomStackLabel} placeholder="Herramienta / SaaS" style={{ flex: 1, minWidth: 220 }} />
                <NumericInput value={customStackCost} onChange={setCustomStackCost} min={0} max={20000} mode="decimal" style={{ width: 120 }} />
                <ActionButton label="Agregar" onClick={addCustomStack} tone="accent" />
              </div>
              {customStack.length > 0 ? (
                <div style={{ padding: "0 16px 14px" }}>
                  {customStack.map((entry) => (
                    <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(entry.usd)} / {fmtMXN(entry.usd * fx)}</div>
                      </div>
                      <ActionButton label="Eliminar" onClick={() => removeCustomStack(entry.id)} tone="subtle" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="Sin stack personalizado." />
              )}
            </SectionCard>
          </div>
        ) : null}

        {tab === "ai" ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Incluye APIs, modelos open source, Ollama self-host, fine-tuning, vision por computadora y escenarios 3D.
            </div>
            {AI_CATS.map((category) => (
              <SectionCard key={category}>
                <CatHeader label={category} />
                {AI_PROVIDERS.filter((item) => item.cat === category).map((item) => {
                  const usage = getAIUsageState(aiUsage, item);
                  const cost = getAICost(item, aiUsage);
                  return (
                    <ToggleRow
                      key={item.id}
                      checked={Boolean(aiOn[item.id])}
                      onToggle={() => toggleAI(item.id)}
                      label={item.label}
                      sublabel={describeAIItem(item)}
                      right={aiOn[item.id] ? `${fmtUSD(cost)}/mes` : item.billing === "monthly" ? `${fmtUSD(item.monthlyUSD || 0)}/mes` : item.billing === "usage" ? `${fmtUSD(item.rateUSD || 0)}/${item.unitLabel}` : "tokens"}
                      controls={
                        aiOn[item.id] ? (
                          item.billing === "tokens" ? (
                            <>
                              <span style={{ fontSize: 10, color: "var(--text-3)" }}>M tok in</span>
                              <NumericInput value={usage.tokensM} onChange={(nextValue) => updateAIUsage(item.id, "tokensM", nextValue)} min={0} max={100000} mode="decimal" style={{ width: 88 }} />
                              <span style={{ fontSize: 10, color: "var(--text-3)" }}>M tok out</span>
                              <NumericInput value={usage.outputTokensM ?? 0} onChange={(nextValue) => updateAIUsage(item.id, "outputTokensM", nextValue)} min={0} max={100000} mode="decimal" style={{ width: 88 }} />
                            </>
                          ) : item.billing === "usage" ? (
                            <>
                              <span style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(item.rateUSD || 0)}/u</span>
                              <NumericInput value={usage.units} onChange={(nextValue) => updateAIUsage(item.id, "units", nextValue)} min={0} max={1000000} mode="decimal" style={{ width: 96 }} />
                              <span style={{ fontSize: 10, color: "var(--text-3)" }}>{item.unitLabel}</span>
                            </>
                          ) : null
                        ) : null
                      }
                    />
                  );
                })}
              </SectionCard>
            ))}

            <SectionCard>
              <CatHeader label="IA personalizada" hint="USD/mes" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
                <TextInput value={customAILabel} onChange={setCustomAILabel} placeholder="Experimento / modelo / GPU" style={{ flex: 1, minWidth: 220 }} />
                <NumericInput value={customAICost} onChange={setCustomAICost} min={0} max={30000} mode="decimal" style={{ width: 120 }} />
                <ActionButton label="Agregar" onClick={addCustomAI} tone="accent" />
              </div>
              {customAI.length > 0 ? (
                <div style={{ padding: "0 16px 14px" }}>
                  {customAI.map((entry) => (
                    <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(entry.usd)} / {fmtMXN(entry.usd * fx)}</div>
                      </div>
                      <ActionButton label="Eliminar" onClick={() => removeCustomAI(entry.id)} tone="subtle" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="Sin IA personalizada." />
              )}
            </SectionCard>
          </div>
        ) : null}

        {tab === "equipos" ? (
          <CatalogTab
            catalog={EQUIPOS}
            cats={EQUIPOS_CATS}
            onMap={equiposOn}
            qtyMap={equiposQty}
            toggle={toggleEquipos}
            setQty={setEquiposQuantity}
            fx={fx}
            totalPersonas={costs.totalPersonas}
            intro="Hardware amortizado mensual · vida útil aplicada (laptops 48m, monitores 72m, sillas 144m)"
          />
        ) : null}

        {tab === "oficina" ? (
          <CatalogTab
            catalog={OFICINA}
            cats={OFICINA_CATS}
            onMap={oficinaOn}
            qtyMap={oficinaQty}
            toggle={toggleOficina}
            setQty={setOficinaQuantity}
            fx={fx}
            totalPersonas={costs.totalPersonas}
            intro="Oficina, conectividad, móvil y VoIP · renta tradicional es $/m² (multiplica por m²/persona, ~6-9)"
          />
        ) : null}

        {tab === "movil" ? (
          <CatalogTab
            catalog={MOVILIDAD}
            cats={MOVILIDAD_CATS}
            onMap={movilOn}
            qtyMap={movilQty}
            toggle={toggleMovil}
            setQty={setMovilQuantity}
            fx={fx}
            totalPersonas={costs.totalPersonas}
            intro="Combustible, autos, viajes y viáticos · topes SAT 2026: nacional $1,968/día · extranjero $3,148/día · gasolina $7,000 PEPM"
          />
        ) : null}

        {tab === "admin" ? (
          <CatalogTab
            catalog={ADMIN}
            cats={ADMIN_CATS}
            onMap={adminOn}
            qtyMap={adminQty}
            toggle={toggleAdmin}
            setQty={setAdminQuantity}
            fx={fx}
            totalPersonas={costs.totalPersonas}
            intro="Contabilidad, legal, banca, seguros corporativos · ítems variables (FX spread, Stripe %) requieren ajuste manual"
          />
        ) : null}

        {tab === "benef" ? (
          <CatalogTab
            catalog={BENEFICIOS}
            cats={BENEFICIOS_CATS}
            onMap={benefOn}
            qtyMap={benefQty}
            toggle={toggleBenef}
            setQty={setBenefQuantity}
            fx={fx}
            totalPersonas={costs.totalPersonas}
            intro="GMM, vales, perks, capacitación, reclutamiento · ítems PEPM se multiplican por personas activas"
          />
        ) : null}

        {tab === "comision" ? (
          <div style={{ display: "grid", gap: 16, maxWidth: 880 }}>
            <SectionCard>
              <CatHeader label="Personas con comision" />
              {sellers.map((seller) => {
                const base = seller.appliesToNet ? costs.withCont : costs.withMargin;
                const estimate = (base * seller.commPct) / 100;
                return (
                  <div key={seller.id} style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1.2fr 1fr 100px 1.2fr 140px auto", gap: 12, alignItems: "end" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>NOMBRE</div>
                      <TextInput value={seller.name} onChange={(nextValue) => updateSeller(seller.id, "name", nextValue)} placeholder="Ej. Carlos Reyes" style={{ width: "100%" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>ROL</div>
                      <TextInput value={seller.role} onChange={(nextValue) => updateSeller(seller.id, "role", nextValue)} placeholder="Vendedor / Partner" style={{ width: "100%" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>%</div>
                      <NumericInput value={seller.commPct} onChange={(nextValue) => updateSeller(seller.id, "commPct", nextValue)} min={0} max={80} mode="decimal" style={{ width: 88 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>BASE</div>
                      <SelectInput
                        value={seller.appliesToNet ? "net" : "gross"}
                        onChange={(nextValue) => updateSeller(seller.id, "appliesToNet", nextValue === "net")}
                        options={[
                          { value: "gross", label: "Precio final al cliente" },
                          { value: "net", label: "Base + contingencia" },
                        ]}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "var(--text-3)" }}>Estimado</div>
                      <div style={{ fontSize: 14, color: "var(--accent-alt)" }}>{fmtUSD(estimate)}</div>
                      <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(estimate * fx)}</div>
                    </div>
                    {sellers.length > 1 ? <ActionButton label="Quitar" onClick={() => removeSeller(seller.id)} tone="subtle" /> : <div />}
                  </div>
                );
              })}
              <div style={{ padding: "12px 16px" }}>
                <ActionButton label="Agregar vendedor / socio" onClick={addSeller} tone="subtle" />
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Impacto" />
              <div style={{ padding: "14px 18px" }}>
                <SummaryMetric label="Precio al cliente antes de comisiones" usd={costs.withMargin} mxn={costs.withMargin * fx} color="var(--accent)" />
                <SummaryMetric label="Total comisiones" usd={costs.totalCommUSD} mxn={costs.totalCommUSD * fx} color="var(--danger)" />
                <SummaryMetric label="Utilidad tras comisiones" usd={costs.netAfterCommissions} mxn={costs.netAfterCommissions * fx} color="var(--accent-alt)" note="Aun sin ISR / PTU" />
              </div>
            </SectionCard>
          </div>
        ) : null}

        {tab === "fiscal" ? (
          <div style={{ display: "grid", gap: 16, maxWidth: 920 }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Tributacion Mexico 2025 · orientativo</div>
            <SectionCard>
              <CatHeader label="Regimen fiscal" />
              <div style={{ padding: "16px", display: "grid", gap: 10 }}>
                {REGIMENES.map((regimen) => (
                  <button
                    key={regimen.id}
                    onClick={() => setFiscalRegimen(regimen.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 14,
                      border: `1px solid ${fiscalRegimen === regimen.id ? "var(--accent)" : "var(--border)"}`,
                      background: fiscalRegimen === regimen.id ? "var(--accent-soft)" : "var(--surface-0)",
                      padding: "12px 14px",
                      color: "var(--text-1)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13 }}>{regimen.label}</span>
                      <span style={{ fontSize: 11, color: "var(--warning)" }}>ISR efectivo ~{Math.round(regimen.isrEfectivo * 100)}%</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{regimen.perfil}</div>
                    <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 4 }}>{regimen.ventajas}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>Consideraciones: {regimen.consideraciones}</div>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label={`Impacto estimado - ${selectedRegimen.label}`} />
              <div style={{ padding: "14px 18px" }}>
                <SummaryMetric label="Precio base al cliente" usd={costs.withMargin} mxn={costs.withMargin * fx} color="var(--text-1)" note="Sin IVA" />
                <SummaryMetric label="IVA trasladado" usd={costs.withMargin * 0.16} mxn={costs.withMargin * 0.16 * fx} color="var(--warning)" note="Se cobra, no es utilidad" />
                <SummaryMetric label="ISR estimado" usd={costs.estimatedISR} mxn={costs.estimatedISR * fx} color="var(--danger)" note={`${Math.round(selectedRegimen.isrEfectivo * 100)}% sobre utilidad bruta operativa`} />
                <SummaryMetric label="PTU estimada" usd={costs.estimatedPTU} mxn={costs.estimatedPTU * fx} color="var(--danger)" note="Solo si tienes empleados" />
                <SummaryMetric label="Utilidad neta estimada" usd={costs.estimatedNet} mxn={costs.estimatedNet * fx} color="var(--accent-alt)" note="Despues de comisiones, ISR y PTU" />
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Calculadora ISR Persona Fisica" hint="Tabla Art. 152" />
              <div style={{ padding: "16px 18px", display: "grid", gap: 16 }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>INGRESO ANUAL MXN</div>
                    <NumericInput value={isrIncome} onChange={setIsrIncome} min={0} max={100000000} style={{ width: 140 }} />
                  </div>
                  <div style={{ padding: 14, background: "var(--surface-0)", borderRadius: 14, border: "1px solid var(--border)", minWidth: 220 }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)" }}>ISR anual estimado</div>
                    <div style={{ fontFamily: "var(--display)", fontSize: 24, color: "var(--warning)" }}>{fmtMXN(isrAnual)}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)" }}>Mensual aprox: {fmtMXN(isrAnual / 12)}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1.8 }}>
                  <div>RESICO PF tope alto: {fmtMXN(isrIncome * 0.025)}</div>
                  <div>PM general orientativo: {fmtMXN(isrIncome * 0.3)}</div>
                  <div>PM RESICO orientativo: {fmtMXN(isrIncome * 0.01)}</div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Retención a residentes en el extranjero" hint="LISR Título V" />
              <div style={{ padding: "16px 18px", display: "grid", gap: 12 }}>
                <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.7 }}>
                  Cuando pagas a OpenAI, Anthropic, AWS, GitHub, Stripe Inc desde MX, técnicamente debes retener ISR sobre el pago. Si el proveedor presenta forma 6166 IRS (residencia fiscal USA), aplicas tratado y la retención baja a 10%. Si NO retienes, el SAT puede no permitir deducir el gasto.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>CONCEPTO</div>
                    <SelectInput
                      value={extranjeroConcepto}
                      onChange={setExtranjeroConcepto}
                      options={RETENCIONES_EXTRANJERO.map((r) => ({ value: r.id, label: r.label }))}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>PAGO MENSUAL USD</div>
                    <NumericInput value={extranjeroPagoUSD} onChange={setExtranjeroPagoUSD} min={0} max={1000000} mode="decimal" style={{ width: "100%" }} />
                  </div>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                    <input type="checkbox" checked={extranjeroTratadoUSA} onChange={(e) => setExtranjeroTratadoUSA(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                    Aplicar tratado MX-USA
                  </label>
                </div>
                {(() => {
                  const concepto = RETENCIONES_EXTRANJERO.find((r) => r.id === extranjeroConcepto);
                  const tasa = extranjeroTratadoUSA ? concepto.tratadoUSA : concepto.general;
                  const retencion = (extranjeroPagoUSD || 0) * tasa;
                  return (
                    <>
                      <SummaryMetric label={`Retención aplicable (${(tasa * 100).toFixed(1)}%)`} usd={retencion} mxn={retencion * fx} color="var(--warning)" note={concepto.note} />
                      <SummaryMetric label="IVA importación digital (Netflix tax)" usd={ivaImportDigital ? (extranjeroPagoUSD || 0) * 0.16 : 0} mxn={ivaImportDigital ? (extranjeroPagoUSD || 0) * 0.16 * fx : 0} color="var(--accent-blue)" note="Auto-acumulación 16% si proveedor sin RFC MX" />
                    </>
                  );
                })()}
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                  <input type="checkbox" checked={ivaImportDigital} onChange={(e) => setIvaImportDigital(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  Activar auto-acumulación IVA importación (proveedor sin RFC MX)
                </label>
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="IVA tasa 0% por exportación de servicios" hint="LIVA art. 29-IV" />
              <div style={{ padding: "16px 18px", display: "grid", gap: 12 }}>
                <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.7 }}>
                  Si facturas USD a empresa en el extranjero por servicios aprovechados allá, aplicas IVA tasa 0%. Te permite acreditar el IVA pagado en MX y solicitar devolución (típico 6-9 meses post-solicitud). Oportunidad enorme para tech que exporta a USA.
                </div>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
                  <input type="checkbox" checked={ivaExportacion} onChange={(e) => setIvaExportacion(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  Esta cotización es una exportación de servicios (cliente en USA / extranjero)
                </label>
                {ivaExportacion ? (
                  <>
                    <SummaryMetric label="IVA aplicado al cliente" usd={0} mxn={0} color="var(--accent)" note="Tasa 0% — cliente extranjero no paga IVA" />
                    <SummaryMetric label="IVA acreditable estimado (16% del costo MX)" usd={(costs.humanUSD + costs.adminUSD + costs.oficinaUSD) * 0.16} mxn={(costs.humanUSD + costs.adminUSD + costs.oficinaUSD) * 0.16 * fx} color="var(--accent-blue)" note="Recuperable vía devolución SAT" />
                  </>
                ) : (
                  <SummaryMetric label="IVA trasladado al cliente" usd={costs.withMargin * 0.16} mxn={costs.withMargin * 0.16 * fx} color="var(--warning)" note="16% sobre precio final · cliente MX" />
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Calculadora US Payroll (referencia)" hint="Federal + estatal 2026" />
              <div style={{ padding: "16px 18px", display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>ESTADO</div>
                    <SelectInput
                      value={usEstadoSel}
                      onChange={setUsEstadoSel}
                      options={US_ESTATAL.map((s) => ({ value: s.id, label: s.label }))}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>SALARIO ANUAL USD</div>
                    <NumericInput value={usSalaryUSD} onChange={setUsSalaryUSD} min={0} max={1000000} style={{ width: "100%" }} />
                  </div>
                </div>
                {(() => {
                  const est = US_ESTATAL.find((s) => s.id === usEstadoSel);
                  const ss = Math.min(usSalaryUSD, US_FEDERAL_2026.ssEmployer.wageBaseUSD) * US_FEDERAL_2026.ssEmployer.tasa;
                  const medicare = usSalaryUSD * US_FEDERAL_2026.medicare.tasa;
                  const futa = US_FEDERAL_2026.futa.wageBaseUSD * US_FEDERAL_2026.futa.tasa;
                  const sui = (est.sui.wageBaseUSD || 0) * (est.sui.tasa || 0);
                  const totalEmployerTax = ss + medicare + futa + sui;
                  const totalCostUS = usSalaryUSD + totalEmployerTax;
                  const factor = usSalaryUSD > 0 ? totalCostUS / usSalaryUSD : 1;
                  return (
                    <>
                      <SummaryMetric label={`SS patrón (cap $${US_FEDERAL_2026.ssEmployer.wageBaseUSD.toLocaleString()})`} usd={ss} mxn={ss * fx} color="var(--warning)" />
                      <SummaryMetric label="Medicare 1.45% (sin tope)" usd={medicare} mxn={medicare * fx} color="var(--warning)" />
                      <SummaryMetric label="FUTA efectiva 0.6% sobre $7k" usd={futa} mxn={futa * fx} color="var(--warning)" />
                      <SummaryMetric label={`SUI ${est.label}`} usd={sui} mxn={sui * fx} color="var(--warning)" note={est.sui.note || ""} />
                      <SummaryMetric label="Costo total empleador (anual)" usd={totalCostUS} mxn={totalCostUS * fx} color="var(--accent)" note={`Factor ${factor.toFixed(3)}× sobre salario base`} />
                      <div style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1.7 }}>
                        Otros estatales {est.label}: {(est.otros || []).join(" · ") || "—"}. No incluido: health PPO ~$680/PEPM single, 401(k) match, dental/vision/STD/LTD, PTO ~11%.
                      </div>
                    </>
                  );
                })()}
              </div>
            </SectionCard>

            <SectionCard>
              <CatHeader label="Multas SAT comunes" hint="Para no olvidar obligaciones" />
              <div style={{ padding: "10px 16px" }}>
                {MULTAS_SAT_COMUNES.map((multa) => (
                  <div key={multa.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                    <div>
                      <div style={{ color: "var(--text-1)" }}>{multa.label}</div>
                      <div style={{ fontSize: 10, color: "var(--text-3)" }}>{multa.note}</div>
                    </div>
                    <div style={{ textAlign: "right", color: "var(--danger)" }}>
                      {fmtMXN(multa.minMXN)} – {fmtMXN(multa.maxMXN)}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {tab === "summary" ? (
          <div style={{ display: "grid", gap: 18 }}>
            <SectionCard>
              <CatHeader label={mode === "freelancer" ? "Mi perfil" : mode === "org" ? "Organización" : "Proyecto"} hint="Estos datos salen en la exportacion" />
              <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 140px auto", gap: 12, alignItems: "end" }}>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>
                    {mode === "freelancer" ? "MI NOMBRE" : mode === "org" ? "ORGANIZACIÓN" : "NOMBRE"}
                  </div>
                  <TextInput value={project.name} onChange={(nextValue) => setProj("name", nextValue)} placeholder={mode === "freelancer" ? "Tu nombre" : mode === "org" ? "Nombre de la empresa" : "Mi sistema / app"} style={{ width: "100%" }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>
                    {mode === "freelancer" ? "ESPECIALIDAD" : mode === "org" ? "RFC / TAX ID" : "CLIENTE"}
                  </div>
                  <TextInput value={project.client} onChange={(nextValue) => setProj("client", nextValue)} placeholder={mode === "freelancer" ? "Ej. Backend / Diseño UI" : mode === "org" ? "RFC u opcional" : "Empresa ABC"} style={{ width: "100%" }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>VERSION</div>
                  <TextInput value={project.version} onChange={(nextValue) => setProj("version", nextValue)} placeholder="1.0" style={{ width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <ActionButton label="Cargar .json" onClick={triggerImport} tone="subtle" />
                  <ActionButton label="Guardar .json" onClick={exportConfig} tone="neutral" />
                  <ActionButton
                    label="Exportar .txt"
                    onClick={() =>
                      exportTXT({
                        project,
                        costs,
                        fx,
                        months,
                        margin,
                        contingency,
                        teamCount,
                        teamSeniority,
                        infraOn,
                        infraQty,
                        stackOn,
                        stackQty,
                        stackVariable,
                        aiOn,
                        aiUsage,
                        sellers,
                        customHumans,
                        customInfra,
                        customStack,
                        customAI,
                        fiscalLabel: selectedRegimen.label,
                      })
                    }
                    tone="accent"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div style={{ padding: "0 18px 18px" }}>
                <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>DESCRIPCION</div>
                <textarea
                  value={project.description}
                  onChange={(event) => setProj("description", event.target.value)}
                  rows={3}
                  style={{ width: "100%", resize: "vertical", background: "var(--surface-0)", border: "1px solid var(--border-strong)", borderRadius: 12, color: "var(--text-1)", fontFamily: "var(--mono)", fontSize: 11, padding: "10px 12px", lineHeight: 1.6, outline: "none" }}
                  placeholder="Alcance, entregables, exclusiones, supuestos..."
                />
              </div>
            </SectionCard>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={{ display: "grid", gap: 18 }}>
                <SectionCard>
                  <CatHeader label="Desglose mensual" />
                  <div style={{ padding: "16px 18px" }}>
                    <BarRow label="Capital humano" usd={costs.humanUSD} total={costs.monthlyUSD} color="var(--accent)" />
                    <BarRow label="Equipos" usd={costs.equiposUSD} total={costs.monthlyUSD} color="var(--accent-blue)" />
                    <BarRow label="Oficina & conectividad" usd={costs.oficinaUSD} total={costs.monthlyUSD} color="var(--warning)" />
                    <BarRow label="Infraestructura" usd={costs.infraUSD} total={costs.monthlyUSD} color="var(--accent-blue)" />
                    <BarRow label="Stack & SaaS" usd={costs.stackUSD} total={costs.monthlyUSD} color="var(--warning)" />
                    <BarRow label="IA & ML" usd={costs.aiUSD} total={costs.monthlyUSD} color="var(--accent-alt)" />
                    <BarRow label="Beneficios" usd={costs.benefUSD} total={costs.monthlyUSD} color="var(--accent)" />
                    <BarRow label="Movilidad" usd={costs.movilUSD} total={costs.monthlyUSD} color="var(--danger)" />
                    <BarRow label="Admin & legal" usd={costs.adminUSD} total={costs.monthlyUSD} color="var(--text-2)" />
                  </div>
                </SectionCard>

                <SectionCard>
                  <CatHeader label="Costos mensuales" />
                  <div style={{ padding: "0 18px 12px" }}>
                    <SummaryMetric label="Capital humano" usd={costs.humanUSD} mxn={costs.humanMXN} color="var(--accent)" />
                    <SummaryMetric label="Equipos" usd={costs.equiposUSD} mxn={costs.equiposUSD * fx} color="var(--accent-blue)" />
                    <SummaryMetric label="Oficina & conect." usd={costs.oficinaUSD} mxn={costs.oficinaUSD * fx} color="var(--warning)" />
                    <SummaryMetric label="Infraestructura" usd={costs.infraUSD} mxn={costs.infraUSD * fx} color="var(--accent-blue)" />
                    <SummaryMetric label="Stack & SaaS" usd={costs.stackUSD} mxn={costs.stackUSD * fx} color="var(--warning)" />
                    <SummaryMetric label="IA & ML" usd={costs.aiUSD} mxn={costs.aiUSD * fx} color="var(--accent-alt)" />
                    <SummaryMetric label="Beneficios" usd={costs.benefUSD} mxn={costs.benefUSD * fx} color="var(--accent)" />
                    <SummaryMetric label="Movilidad" usd={costs.movilUSD} mxn={costs.movilUSD * fx} color="var(--danger)" />
                    <SummaryMetric label="Admin & legal" usd={costs.adminUSD} mxn={costs.adminUSD * fx} color="var(--text-2)" />
                    <SummaryMetric label="Total mensual" usd={costs.monthlyUSD} mxn={costs.monthlyUSD * fx} color="var(--text-1)" />
                  </div>
                </SectionCard>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                <SectionCard style={{ background: "var(--hero-bg)", borderColor: "var(--hero-border)" }}>
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                      {mode === "freelancer" ? "Tarifa al cliente" : mode === "org" ? "Revenue mínimo mensual" : "Precio final"}
                    </div>
                    <div style={{ marginTop: 10, fontFamily: "var(--display)", fontSize: 38, fontWeight: 900, color: "var(--accent)" }}>
                      {mode === "freelancer" ? fmtUSD(costs.hourlyClientUSD) + "/hr" : mode === "org" ? fmtUSD(costs.monthlyWithMargin) + "/mes" : fmtUSD(costs.withMargin)}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--text-2)", marginTop: 4 }}>
                      {mode === "freelancer"
                        ? `${fmtMXN(costs.hourlyClientUSD * fx)}/hr · costo real ${fmtUSD(costs.hourlyCostUSD)}/hr`
                        : mode === "org"
                        ? `${fmtMXN(costs.monthlyWithMargin * fx)} · run rate anual ${fmtUSD(costs.annualWithMarginUSD)}`
                        : fmtMXN(costs.withMargin * fx)}
                    </div>
                    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {(mode === "freelancer"
                        ? [
                            { label: "Costo mensual", value: costs.monthlyUSD, color: "var(--text-1)" },
                            { label: `Con margen ${margin}%`, value: costs.monthlyWithMargin, color: "var(--warning)" },
                            { label: "Costo por hora", value: costs.hourlyCostUSD, color: "var(--accent-alt)" },
                            { label: "Facturación anual", value: costs.annualWithMarginUSD, color: "var(--accent)" },
                          ]
                        : mode === "org"
                        ? [
                            { label: "Costo operativo mes", value: costs.monthlyUSD, color: "var(--text-1)" },
                            { label: `Con margen ${margin}%`, value: costs.monthlyWithMargin, color: "var(--warning)" },
                            { label: "Run rate anual base", value: costs.annualRunRateUSD, color: "var(--accent-alt)" },
                            { label: "Run rate con margen", value: costs.annualWithMarginUSD, color: "var(--accent)" },
                          ]
                        : [
                            { label: `Base ${months} meses`, value: costs.projectBase, color: "var(--text-1)" },
                            { label: `Con contingencia ${contingency}%`, value: costs.withCont, color: "var(--warning)" },
                            { label: "Utilidad bruta operativa", value: costs.grossProfit, color: "var(--accent)" },
                            { label: "Utilidad neta estimada", value: costs.estimatedNet, color: "var(--accent-alt)" },
                          ]
                      ).map((metric) => (
                        <div key={metric.label} style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: 14, padding: 12 }}>
                          <div style={{ fontSize: 8, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{metric.label}</div>
                          <div style={{ fontSize: 16, color: metric.color, marginTop: 6 }}>{fmtUSD(metric.value)}</div>
                          <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(metric.value * fx)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <CatHeader label="Lectura financiera correcta" />
                  <div style={{ padding: "14px 18px" }}>
                    <SummaryMetric label="Utilidad bruta operativa" usd={costs.grossProfit} mxn={costs.grossProfit * fx} color="var(--accent)" note="Margen sobre costo + contingencia. No incluye impuestos ni comisiones." />
                    <SummaryMetric label="Utilidad despues de comisiones" usd={costs.netAfterCommissions} mxn={costs.netAfterCommissions * fx} color="var(--accent-blue)" note="Resta pagos a vendedores o partners." />
                    <SummaryMetric label="Carga fiscal estimada" usd={costs.estimatedTaxBurden} mxn={costs.estimatedTaxBurden * fx} color="var(--danger)" note="ISR + PTU orientativos." />
                    <SummaryMetric label="Utilidad neta estimada" usd={costs.estimatedNet} mxn={costs.estimatedNet * fx} color="var(--accent-alt)" note="Despues de comisiones e impuestos estimados." />
                  </div>
                </SectionCard>

                <SectionCard>
                  <CatHeader label="Variables que siguen siendo aproximadas" />
                  <div style={{ padding: "14px 18px", fontSize: 10, color: "var(--text-2)", lineHeight: 1.8 }}>
                    <div>· IVA: se cobra al cliente pero no debe tratarse como ingreso propio.</div>
                    <div>· PSP y pasarelas: si son variables, ya puedes modelarlas por tarifa x volumen en Stack & SaaS.</div>
                    <div>· IA por uso: conviene cargar volumen mensual real para no subcotizar.</div>
                    <div>· ISR / PTU son orientativos; la deducibilidad real cambia con tu operacion.</div>
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "12px 20px", textAlign: "center", fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em" }}>
        COSTCALC · Mercado mexicano · Referencias Q1 2025
      </footer>
    </div>
  );
}
